"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

export interface AudioPlayerApi {
  play: () => Promise<void>;
  pause: () => void;
  muted: boolean;
  setMuted: (muted: boolean) => void;
}

interface AudioPlayerProps {
  /** URL of the audio file. Null until the signed URL resolves. */
  src?: string | null;
  title?: string;
  artist?: string;
}

type Status = "idle" | "loading" | "playing" | "paused" | "error";

/**
 * Background music player.
 *
 * Exposes an imperative API so the splash heart tap can call `play()`
 * synchronously inside the click gesture — required by iOS Safari /
 * Android Chrome autoplay policies. The crafted, floating UI exposes
 * play/pause and mute/unmute; loading, paused, and error states are
 * reflected visually.
 */
const AudioPlayer = forwardRef<AudioPlayerApi, AudioPlayerProps>(
  function AudioPlayer({ src, title, artist }, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playRequested = useRef(false);
    const [muted, setMutedState] = useState(false);
    const [status, setStatus] = useState<Status>(src ? "loading" : "idle");
    const reduceMotion = useReducedMotion();
    const srcValue = src ?? undefined;

    const play = useCallback(() => {
      playRequested.current = true;
      return audioRef.current?.play() ?? Promise.resolve();
    }, []);

    const pause = useCallback(() => {
      audioRef.current?.pause();
    }, []);

    const toggleMuted = useCallback(() => {
      const next = !muted;
      if (audioRef.current) audioRef.current.muted = next;
      setMutedState(next);
    }, [muted]);

    useImperativeHandle(
      ref,
      () => ({
        play,
        pause,
        muted,
        setMuted: (value: boolean) => {
          if (audioRef.current) audioRef.current.muted = value;
          setMutedState(value);
        },
      }),
      [muted, play, pause],
    );

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.muted = muted;
    }, [muted]);

    // Reset state whenever the source changes (e.g. signed URL arrival).
    useEffect(() => {
      setStatus(src ? "loading" : "idle");
    }, [src]);

    // Wire up media element events once.
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onPlaying = () => {
        setStatus("playing");
      };
      const onPause = () => {
        setStatus("paused");
      };
      const onWaiting = () => {
        if (!audio.paused) setStatus("loading");
      };
      const onCanPlay = () => {
        // Retry playback after the gesture if the source just arrived.
        if (playRequested.current) void audio.play().catch(() => {});
      };
      const onError = () => {
        setStatus("error");
        console.error("[audio] playback error");
      };

      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("waiting", onWaiting);
      audio.addEventListener("loadeddata", onCanPlay);
      audio.addEventListener("error", onError);

      return () => {
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("pause", onPause);
        audio.removeEventListener("waiting", onWaiting);
        audio.removeEventListener("loadeddata", onCanPlay);
        audio.removeEventListener("error", onError);
      };
    }, []);

    // Collect side-effect-free render helpers.
    const isPlaying = status === "playing";
    const busy = status === "loading";

    return (
      <>
        <audio
          ref={audioRef}
          src={srcValue}
          title={title}
          loop
          preload="auto"
          className="hidden"
        />

        <motion.div
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-surface/90 py-2 pl-3 pr-2 shadow-lg ring-1 ring-accent/15 backdrop-blur sm:bottom-6 sm:right-6"
          style={{ maxWidth: "calc(100vw - 2rem)" }}
          initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          role="group"
          aria-label="Music controls"
        >
          {busy ? (
            <Loader2 aria-hidden className="h-5 w-5 shrink-0 animate-spin text-accent" />
          ) : isPlaying ? (
            <Music aria-hidden className="h-5 w-5 shrink-0 text-accent" />
          ) : (
            <Music aria-hidden className="h-5 w-5 shrink-0 text-muted" />
          )}

          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-xs font-medium text-foreground">
              {title ?? "Music"}
            </span>
            {artist ? (
              <span className="truncate text-[0.65rem] text-muted">{artist}</span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => (isPlaying ? pause() : void play())}
            disabled={!src || status === "error"}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-background transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95 disabled:opacity-40"
          >
            {busy ? null : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 translate-x-[1px]" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMuted}
            aria-label={muted ? "Unmute music" : "Mute music"}
            aria-pressed={muted}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 active:scale-95"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </motion.div>
      </>
    );
  },
);

export default AudioPlayer;
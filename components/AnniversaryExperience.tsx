"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SplashScreen from "@/components/SplashScreen";
import AudioPlayer, { type AudioPlayerApi } from "@/components/AudioPlayer";
import RelationshipTimer from "@/components/RelationshipTimer";
import MemoryTimeline from "@/components/MemoryTimeline";
import PhotoGallery from "@/components/PhotoGallery";
import LoveEnvelope from "@/components/LoveEnvelope";
import Section from "@/components/Section";
import Footer from "@/components/Footer";
import { useSignedMediaUrl } from "@/lib/media-url";
import { formatDate } from "@/lib/dates";
import type { AnniversaryData } from "@/types/anniversary";

interface AnniversaryExperienceProps {
  data: AnniversaryData;
}

export default function AnniversaryExperience({
  data,
}: AnniversaryExperienceProps) {
  const [started, setStarted] = useState(false);
  const audioRef = useRef<AudioPlayerApi | null>(null);
  const musicSrc = useSignedMediaUrl(data.music.publicId);

  const handleStart = () => {
    // Start audio inside the click gesture so mobile browsers permit it.
    void audioRef.current?.play().catch(() => {
      // Audio may fail (no src yet, autoplay policy). The experience
      // continues regardless.
    });
    setStarted(true);
  };

  const { couple, relationship, music, timeline, gallery, letter } = data;
  const splash = data.splash ?? {};
  const hero = data.hero ?? {};
  const titles = data.sectionTitles ?? {};
  const envelope = data.envelope ?? {};

  return (
    <>
      <AnimatePresence mode="wait">
        {!started && (
          <SplashScreen
            key="splash"
            personOne={couple.personOne}
            personTwo={couple.personTwo}
            subtitle={splash.subtitle}
            startLabel={splash.startLabel}
            soundHint={splash.soundHint}
            onStart={handleStart}
          />
        )}

        {started && (
          <motion.main
            key="content"
            id="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex min-h-[88dvh] flex-col items-center justify-center gap-6 px-6 text-center">
              <div
                aria-hidden
                className="h-16 w-16 rounded-full bg-gradient-to-br from-accent-soft to-accent opacity-70"
              />
              <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">
                {couple.personTwo} &amp; {couple.personOne}
              </h1>
              <p className="max-w-sm text-sm text-muted">
                {hero.intro ?? "It has been a journey since"} {formatDate(relationship.startDate)}.
              </p>
              <RelationshipTimer startDate={relationship.startDate} />
            </div>

            <Section className="bg-surface/40">
              <h2 className="mb-10 text-center font-serif text-3xl text-foreground">
                {titles.timeline ?? "Our story together"}
              </h2>
              <MemoryTimeline items={timeline} />
            </Section>

            <Section>
              <h2 className="mb-10 text-center font-serif text-3xl text-foreground">
                {titles.gallery ?? "Moments captured"}
              </h2>
              <PhotoGallery items={gallery} />
            </Section>

            <Section className="bg-surface/40">
              <h2 className="mb-10 text-center font-serif text-3xl text-foreground">
                {titles.letter ?? "A letter for you"}
              </h2>
              <LoveEnvelope letter={letter} tapToOpen={envelope.tapToOpen} />
            </Section>

            <Footer
              personOne={couple.personOne}
              personTwo={couple.personTwo}
              line={data.footer?.line}
            />
          </motion.main>
        )}
      </AnimatePresence>

      <AudioPlayer
        ref={audioRef}
        src={musicSrc}
        title={music.title}
        artist={music.artist}
      />
    </>
  );
}
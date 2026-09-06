import type { AnniversaryData } from "@/types/anniversary";

/**
 * TEMPLATE configuration — safe to commit to GitHub.
 *
 * This file contains only placeholder content so the repository can be
 * shared as a template. Copy it to `config/anniversaryData.ts` and
 * replace every value with your own personal content:
 *
 *   cp config/anniversaryData.example.ts config/anniversaryData.ts
 *
 * The real `config/anniversaryData.ts` is gitignored, so your names,
 * dates, captions, letter text, and Cloudinary public IDs never get
 * pushed to GitHub.
 */
export const anniversaryData: AnniversaryData = {
  couple: {
    personOne: "Your Name",
    personOneNickname: "Your Nickname",
    personTwo: "Your Partner's Name",
    personTwoNickname: "Their Nickname",
  },
  relationship: {
    startDate: "2020-02-14T18:30:00",
  },
  splash: {
    subtitle: "Tap the heart to begin our story",
    startLabel: "Tap to begin our story",
    soundHint: "with sound on",
  },
  hero: {
    intro: "It has been a journey since",
  },
  sectionTitles: {
    timeline: "Our story together",
    gallery: "Moments captured",
    letter: "A letter for you",
  },
  envelope: {
    tapToOpen: "Tap to open",
  },
  footer: {
    line: "Made with love, for us.",
  },
  metadata: {
    title: "Our Anniversary",
    description: "A private, interactive celebration of our story. Made with love.",
  },
  timeline: [
    {
      date: "2020-02-14",
      title: "The day we met",
      description:
        "Replace this with the story of how you first met. The date is rendered automatically as a friendly date.",
      imagePublicId: "YOUR_CLOUDINARY_PUBLIC_ID",
    },
    {
      date: "2020-08-01",
      title: "Our first trip",
      description:
        "Describe a trip or moment that mattered. Leave `imagePublicId` out entirely if you have no photo.",
    },
  ],
  gallery: [
    {
      publicId: "YOUR_CLOUDINARY_PUBLIC_ID",
      caption: "Your first photo caption",
    },
    {
      publicId: "YOUR_CLOUDINARY_PUBLIC_ID_2",
      caption: "Your second photo caption",
    },
  ],
  music: {
    publicId: "YOUR_CLOUDINARY_AUDIO_PUBLIC_ID",
    title: "Our Song",
  },
  letter: {
    greeting: "My dearest",
    paragraphs: [
      "Write your first heartfelt paragraph here.",
      "Write your second heart-felt paragraph here. Keep paragraphs short enough to feel easy to read on a phone.",
    ],
    signature: "Forever yours",
  },
  theme: {
    accentColor: "#b3575a",
    accentSoftColor: "#c47a7f",
  },
};
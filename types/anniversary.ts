export interface CoupleNames {
  personOne: string;
  personTwo: string;
  /** Optional affectionate nickname shown alongside the first name */
  personOneNickname?: string;
  personTwoNickname?: string;
}

export interface RelationshipConfig {
  /** ISO timestamp, e.g. "2019-06-15T18:30:00" */
  startDate: string;
}

export interface SplashConfig {
  /** Small line under the heart button, e.g. "Tap the heart to begin our story" */
  subtitle?: string;
  /** Accessible label for the heart button, e.g. "Tap to begin our story" */
  startLabel?: string;
  /** Tiny hint under the subtitle, e.g. "with sound on" */
  soundHint?: string;
}

export interface HeroConfig {
  /** Intro sentence before the relationship timer, e.g. "It has been a journey since" */
  intro?: string;
}

export interface SectionTitlesConfig {
  /** Heading above the timeline, e.g. "Our story together" */
  timeline?: string;
  /** Heading above the photo gallery, e.g. "Moments captured" */
  gallery?: string;
  /** Heading above the love letter, e.g. "A letter for you" */
  letter?: string;
}

export interface EnvelopeConfig {
  /** Hint shown under the sealed envelope, e.g. "Tap to open" */
  tapToOpen?: string;
}

export interface FooterConfig {
  /** One-liner under the couple names, e.g. "Made with love, for us." */
  line?: string;
}

export interface MetadataConfig {
  /** Browser tab / SEO title */
  title?: string;
  /** Browser tab / SEO description */
  description?: string;
}

export interface TimelineMilestone {
  /** Date of the milestone, rendered like "February 14, 2020" */
  date: string;
  title: string;
  description: string;
  /** Optional Cloudinary public ID of an authenticated image, e.g. "relationship/photos/memory-01" */
  imagePublicId?: string;
}

export interface GalleryItem {
  /** Cloudinary public ID of an authenticated image, e.g. "relationship/photos/memory-01" */
  publicId: string;
  caption?: string;
}

export interface MusicConfig {
  /** Cloudinary public ID of an authenticated audio asset, e.g. "relationship/audio/our-song" */
  publicId: string;
  title: string;
  artist?: string;
}

export interface LetterConfig {
  /** Opening line of the letter, e.g. "My dearest" */
  greeting: string;
  paragraphs: string[];
  signature?: string;
}

export interface ThemeConfig {
  /** Optional main accent hex color, overrides the default (e.g. "#b3575a") */
  accentColor?: string;
  /** Optional soft variant of the accent hex color */
  accentSoftColor?: string;
}

export interface AnniversaryData {
  couple: CoupleNames;
  relationship: RelationshipConfig;
  /** Splash screen copy */
  splash?: SplashConfig;
  /** Hero / first-screen copy */
  hero?: HeroConfig;
  /** Section headings */
  sectionTitles?: SectionTitlesConfig;
  /** Photo gallery copy */
  gallery: GalleryItem[];
  /** Memory timeline */
  timeline: TimelineMilestone[];
  /** Background music */
  music: MusicConfig;
  /** Love letter */
  letter: LetterConfig;
  /** Sealed-envelope copy */
  envelope?: EnvelopeConfig;
  /** Footer copy */
  footer?: FooterConfig;
  /** Browser metadata */
  metadata?: MetadataConfig;
  /** Optional accent colors (design keeps the defaults) */
  theme?: ThemeConfig;
}
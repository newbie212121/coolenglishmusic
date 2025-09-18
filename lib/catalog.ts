export type Activity = {
  id: string;
  title: string;
  slug: string;          // URL path slug
  s3Prefix: string;      // e.g. "Pure_WW/" (folder in CloudFront/S3)
  level: "Beginner" | "Intermediate" | "Advanced";
  durationMin: number;
  tags: string[];        // e.g. ["Pop","Vocabulary"]
  free?: boolean;        // show in Free section if true
};

export const ACTIVITIES: Activity[] = [
  {
    id: "pure-ww",
    title: "Golden – Full Song Pop",
    slug: "golden-full-song-pop",
    s3Prefix: "Pure_WW/",
    level: "Beginner",
    durationMin: 10,
    tags: ["Pop","Full Song"],
    free: true
  },
  {
    id: "elvis-video-clips",
    title: "Elvis Song Clips Game",
    slug: "elvis-song-clips",
    s3Prefix: "Elvis_Clips/",
    level: "Intermediate",
    durationMin: 15,
    tags: ["Rock","Listening"]
  }
];

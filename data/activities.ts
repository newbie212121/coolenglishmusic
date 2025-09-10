export type Activity = {
  id: string;
  title: string;
  cover: string;
  key?: string;        // S3 key for paid content (later)
  publicUrl?: string;  // for free samples
  type: "full" | "clips";
  sub: "pop" | "rock" | "country" | "hiphop";
  free?: boolean;
};

export const ACTIVITIES: Activity[] = [
  // Free samples served from /public for local testing
  { id: "fs1", title: "Sample: Pop Clip - Chorus Match", cover: "/covers/sample1.svg", publicUrl: "/clips/pop/sample-chorus/index.html", type: "clips", sub: "pop", free: true },
  { id: "fs2", title: "Sample: Rock Full - Lyrics Gap",  cover: "/covers/sample2.svg", publicUrl: "/full/rock/sample-lyrics/index.html",  type: "full",  sub: "rock", free: true },

  // Paid examples (will use presign later)
  { id: "p1", title: "Pop Clip: Beat the Hook",     cover: "/covers/pop1.svg",     key: "music/clips/pop/beat-the-hook/index.html",  type: "clips", sub: "pop" },
  { id: "p2", title: "Rock Full: Verse Builder",    cover: "/covers/rock1.svg",    key: "music/full/rock/verse-builder/index.html",  type: "full",  sub: "rock" },
  { id: "p3", title: "Country Full: Story Lines",   cover: "/covers/country1.svg", key: "music/full/country/story-lines/index.html", type: "full",  sub: "country" },
  { id: "p4", title: "Hip-Hop Clips: Rhyme Race",   cover: "/covers/hiphop1.svg",  key: "music/clips/hiphop/rhyme-race/index.html",  type: "clips", sub: "hiphop" },
];

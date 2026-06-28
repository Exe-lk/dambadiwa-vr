import type { Video360LayoutConfig } from "@/lib/detectVideoLayout";

export type VrVideo = {
  id: string;
  title: string;
  description: string;
  src: string;
  layout?: Video360LayoutConfig;
};

export const videoExperiences: VrVideo[] = [
  // {
  //   id: "sacred-journey",
  //   title: "Sacred Journey to Mihintale",
  //   description:
  //     "Walk among devotees at the sacred stupa during Poson — a 360° glimpse of Sri Lanka's spiritual heartland.",
  //   src: "https://vrvesak-cdn.b-cdn.net/The%20Nun%20360%20-%20Valak%20Horror%20Chase%20360%20VR%20Video%20-%20The%20Conjuring%20-%20360%20Video%20Horror%20Annabelle.mp4",
  //   layout: "stereo-top-bottom",
  // },
  // {
  //   id: "roller-coaster",
  //   title: "Sacred Journey in Roller Coaster",
  //   description:
  //     "Rollers coaster experience in 360°.",
  //   src: "https://vrvesak-cdn.b-cdn.net/roller_coater.mp4",
  //   layout: "stereo-top-bottom",
  // },
  // {
  //   id: "dabadiwa-wandana",
  //   title: "Dabadiwa Wandana in Mahabodhi Temple",
  //   description:
  //     "Dabadiwa Wandana in Mahabodhi Temple at Bodh Gaya, India.",
  //   src: "https://vrvesak-cdn.b-cdn.net/Mahabodhi%20Temple%20at%20Bodh%20Gaya%2C%20India.mp4",
  //   layout: "stereo-top-bottom",
  // },

  {
    id: "great-buddha-statue",
    title: "The Great Buddha — 360° Journey",
    description:
      "Stand before one of the world's great Buddha statues and explore the sacred surroundings in immersive 360°.",
    src: "https://vrvesak-cdn.b-cdn.net/Buddha%20statue%20in%20the%20world%20%EF%BD%9C%20the%20great%20buddha%20%23buddha%20%23status%20%23travel_1080p.mp4",
    layout: "mono",
  },

  
  {
    id: "lumbini",
    title: "Lumbini — Birthplace of the Buddha",
    description:
      "Visit the sacred gardens and monuments of Lumbini, Nepal — the birthplace of Siddhartha Gautama — in immersive 360°.",
    src: "https://vrvesak-cdn.b-cdn.net/360VR%20Lumbini%20birthplace%20of%20Buddha%20in%20Nepal22.mp4",
    layout: "mono",
  },


  {
    id: "sanchi-stupa",
    title: "Sanchi Stupa — Buddhist Architecture",
    description:
      "Walk through the ancient Sanchi Stupa complex in India and explore its magnificent Buddhist architecture in immersive 360°.",
    src: "https://vrvesak-cdn.b-cdn.net/Sanchi%20Stupa%20Architecture%20-%20360%C2%B0%20view%20walkthrough%20(Buddhist%20Architecture)_1080p.mp4",
    layout: "mono",
  },

  {
    id: "mahabodhi",
    title: "Journey to Mahabodhi Temple",
    description:
      "Follow the sacred journey to Mahabodhi Temple at Bodh Gaya, India — where the Buddha attained enlightenment — in immersive 360°.",
    src: "https://vrvesak-cdn.b-cdn.net/Journey%20to%20the%20Places%20of%20Buddha.%20Mahabodhi.mp4",
    layout: "mono",
  },
  {
    id: "ayutthaya",
    title: "Ayutthaya — Historic Buddhist Heritage",
    description:
      "Explore the ancient temples and sacred ruins of Ayutthaya in immersive 360°.",
    src: "https://vrvesak-cdn.b-cdn.net/ayutthay.mp4",
    layout: "mono",
  }
];

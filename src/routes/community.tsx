import { createFileRoute } from "@tanstack/react-router";
import { CommunityShell } from "@/components/community/CommunityShell";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community · MockArena" },
      { name: "description", content: "Join exam-focused student communities — JEE, NEET, SSC, Banking, UPSC." },
      { property: "og:title", content: "Student Communities · MockArena" },
      { property: "og:description", content: "Discuss, learn, and prep with thousands of fellow aspirants." },
    ],
  }),
  component: CommunityShell,
});

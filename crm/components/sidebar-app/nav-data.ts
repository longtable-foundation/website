export interface NavItem {
  label: string;
  status: "active" | "unread" | "idle";
  badge?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Pipeline",
    items: [
      { label: "All prospects", status: "active" },
      { label: "P0 this week", status: "unread", badge: "18" },
      { label: "Signed / LOI", status: "idle" },
      { label: "Needs next action", status: "idle" },
    ],
  },
  {
    label: "Coming soon",
    items: [
      { label: "Email ingestion", status: "idle" },
      { label: "Slack updates", status: "idle" },
    ],
  },
];

import { BookMarked, FolderTree, Heart, LayoutDashboard, Library, Tags, UserCircle } from "lucide-react";

/** Single source of truth for the authenticated app navigation. */
export const appNav = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    description: "Activity and totals across your grimoire",
  },
  { label: "Library", to: "/library", icon: Library, description: "Browse the shared collection" },
  { label: "Files", to: "/files", icon: BookMarked, description: "Manage your own entries" },
  {
    label: "Categories",
    to: "/categories",
    icon: FolderTree,
    description: "Your private organisation",
  },
  { label: "Tags", to: "/tags", icon: Tags, description: "Public tags shared by everyone" },
  { label: "Likes", to: "/likes", icon: Heart, description: "Everything you have favourited" },
] as const;

export type NavItem = (typeof appNav)[number];

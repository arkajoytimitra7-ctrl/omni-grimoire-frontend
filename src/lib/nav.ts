import {
  BookMarked,
  Code2,
  FolderTree,
  Heart,
  LayoutDashboard,
  Library,
  Tags,
  UserCircle,
} from "lucide-react";

/** Single source of truth for the authenticated app navigation. */
export const appNav = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    description: "Activity and totals across your grimoire",
  },
  {
    label: "Public Library",
    to: "/library",
    icon: Library,
    description: "Browse the shared public collection",
  },
  {
    label: "My Files",
    to: "/files",
    icon: BookMarked,
    description: "Your own private and public entries",
  },
  {
    label: "My Categories",
    to: "/categories",
    icon: FolderTree,
    description: "Your private organisation",
  },
  { label: "Tags", to: "/tags", icon: Tags, description: "Public tags shared by everyone" },
  { label: "Likes", to: "/likes", icon: Heart, description: "Everything you have favourited" },
  { label: "Profile", to: "/profile", icon: UserCircle, description: "Your account details" },
  { label: "Developer", to: "/developer", icon: Code2, description: "Developer access and docs" },
] as const;

export type NavItem = (typeof appNav)[number];

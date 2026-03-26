import {
  Briefcase,
  Bot,
  BrainCircuit,
  Brush,
  Code,
  Code2,
  Compass,
  Film,
  Globe2,
  GraduationCap,
  ImageIcon,
  LucideIcon,
  Mic,
  Mic2,
  Newspaper,
  Palette,
  Pen,
  PenSquare,
  Search,
  Sparkles,
  Video,
  Workflow
} from "lucide-react";

export const iconMap = {
  Briefcase,
  Bot,
  BrainCircuit,
  Brush,
  Code,
  Code2,
  Compass,
  Film,
  Globe2,
  GraduationCap,
  ImageIcon,
  Mic,
  Mic2,
  Newspaper,
  Palette,
  Pen,
  PenSquare,
  Search,
  Sparkles,
  Video,
  Workflow
};

export type IconName = keyof typeof iconMap;

/**
 * Resolve icon by string name. Falls back to Sparkles for unknown values.
 */
export function getIcon(name: IconName): LucideIcon {
  return iconMap[name] ?? Sparkles;
}

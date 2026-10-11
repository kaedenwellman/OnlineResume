/*
 * lucide-react no longer ships brand logos, so these are simple generic glyphs
 * (camera, chat, briefcase, code, play) rather than trademarked marks.
 */
import { Briefcase, Camera, Code2, MessageCircle, Play } from "lucide-react";

const ICONS = {
  instagram: Camera,
  discord: MessageCircle,
  linkedin: Briefcase,
  github: Code2,
  youtube: Play,
} as const;

export default function SocialIcon({ name }: { name: keyof typeof ICONS }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" size={20} />;
}

import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";

/**
 * Icon registry. Data files reference icons by name so content stays
 * serializable; components resolve them here.
 */
const registry = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const Component = registry[name];
  return <Component className={className} aria-hidden />;
}

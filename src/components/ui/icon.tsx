import {
  Bot,
  Boxes,
  Braces,
  Brain,
  Cloud,
  Code2,
  Compass,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Github,
  Layers,
  LayoutTemplate,
  Linkedin,
  Mail,
  Network,
  PenTool,
  Plug,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Shield,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Central icon registry. Data files reference icons by name so content
 * stays serializable; components resolve them here.
 */
const registry = {
  bot: Bot,
  boxes: Boxes,
  braces: Braces,
  brain: Brain,
  cloud: Cloud,
  code: Code2,
  compass: Compass,
  database: Database,
  file: FileText,
  gauge: Gauge,
  "git-branch": GitBranch,
  github: Github,
  layers: Layers,
  layout: LayoutTemplate,
  linkedin: Linkedin,
  mail: Mail,
  network: Network,
  "pen-tool": PenTool,
  plug: Plug,
  refresh: RefreshCw,
  rocket: Rocket,
  search: Search,
  server: Server,
  shield: Shield,
  sparkles: Sparkles,
  workflow: Workflow,
  zap: Zap,
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

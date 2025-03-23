
export interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  content?: string;
  mascotMood?: 'happy' | 'explaining' | 'thinking' | 'alert' | 'confident' | 'excited';
  mascotMessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
  imageSrc?: string;
}


export interface WizardStep {
  title: string;
  description: string;
  fields: WizardField[];
}

export interface WizardField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  mascotMood: string;
  mascotMessage: string;
  icon: any;
  imageSrc: string;
  features?: string[];
}

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
  title: string;
  description: string;
  image: string;
  alt: string;
  features: string[];
}
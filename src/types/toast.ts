export type ToastVariant = 'default' | 'destructive' | 'success';

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastVariant;
}

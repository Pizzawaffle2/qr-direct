// src/types/global.d.ts
type ExtendedUser = {
  id: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier?: SubscriptionTier;
  emailVerified?: Date | null;
  lastLogin?: Date;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
};

type SafeAny = any; // Use this instead of 'any' when absolutely necessary

// Common response types
type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

// Generic type for async operations
type AsyncOperation<T> = {
  isLoading: boolean;
  error: string | null;
  data: T | null;
};

// Form event types
type FormSubmitHandler<T> = (data: T) => Promise<void> | void;

// API error type
type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

// Auth types
type AuthState = {
  user: ExtendedUser | null;
  isLoading: boolean;
  error: string | null;
};

// QR code types
type QRStyleOptions = {
  foregroundColor: string;
  backgroundColor: string;
  cornerRadius?: number;
  margin?: number;
  size?: number;
};

// Calendar types
type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
};

// Subscription types
type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: Record<string, number>;
};

import { type UserRole, type AccountStatus, type ActivityType } from '@/app/api/auth/[...nextauth]/route';
import { debounce } from '@/lib/utils';

// Types
export interface AuthError {
  code: string;
  message: string;
  timestamp: Date;
}

interface AuthEvent {
  userId: string;
  type: ActivityType;
  metadata?: Record<string, any>;
}

// Auth state validation
export const isValidRole = (role: any): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const isValidStatus = (status: any): status is AccountStatus => {
  return Object.values(AccountStatus).includes(status as AccountStatus);
};

// Session helpers
export const hasRequiredRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.USER]: 0,
    [UserRole.PRO]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.ENTERPRISE]: 3,
  };

  const userRoleLevel = roleHierarchy[userRole];
  return requiredRoles.some(role => userRoleLevel >= roleHierarchy[role]);
};

// Debounced authentication checks
export const debouncedSessionCheck = debounce(
  async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }
      return response.json();
    } catch (error) {
      console.error('Session check error:', error);
      throw error;
    }
  },
  1000,
  { leading: true, maxWait: 5000 }
);

// Error handling
export const parseAuthError = (error: unknown): AuthError => {
  if (error instanceof Error) {
    return {
      code: 'AUTH_ERROR',
      message: error.message,
      timestamp: new Date()
    };
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown authentication error occurred',
    timestamp: new Date()
  };
};

// Activity tracking
export const trackAuthActivity = async (event: AuthEvent): Promise<void> => {
  try {
    const response = await fetch('/api/auth/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to track auth activity');
    }
  } catch (error) {
    console.error('Activity tracking error:', error);
  }
};

// Subscription helpers
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export const getSubscriptionFeatures = (tier: SubscriptionTier) => {
  const features = {
    free: {
      maxQrCodes: 10,
      customization: false,
      analytics: false,
      apiAccess: false,
    },
    pro: {
      maxQrCodes: 100,
      customization: true,
      analytics: true,
      apiAccess: true,
    },
    enterprise: {
      maxQrCodes: Infinity,
      customization: true,
      analytics: true,
      apiAccess: true,
    },
  };

  return features[tier];
};

export const canAccessFeature = (
  userRole: UserRole,
  feature: keyof ReturnType<typeof getSubscriptionFeatures>
): boolean => {
  const subscriptionMap: Record<UserRole, SubscriptionTier> = {
    [UserRole.USER]: 'free',
    [UserRole.PRO]: 'pro',
    [UserRole.ENTERPRISE]: 'enterprise',
    [UserRole.ADMIN]: 'enterprise',
  };

  const tier = subscriptionMap[userRole];
  const features = getSubscriptionFeatures(tier);
  return Boolean(features[feature]);
};

// Hook helpers for components
export const getAuthRedirectUrl = (
  returnTo?: string,
  defaultPath = '/'
): string => {
  if (!returnTo) {
    return defaultPath;
  }

  // Validate the returnTo URL to prevent open redirect vulnerabilities
  try {
    const url = new URL(returnTo, window.location.origin);
    if (url.origin === window.location.origin) {
      return returnTo;
    }
  } catch (e) {
    // If returnTo is a relative path, it's safe to use
    if (returnTo.startsWith('/')) {
      return returnTo;
    }
  }

  return defaultPath;
};
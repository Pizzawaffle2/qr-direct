import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { 
  UserRole, 
  AccountStatus,
  ActivityType 
} from '@/app/api/auth/[...nextauth]/route';
import {
  hasRequiredRole,
  canAccessFeature,
  trackAuthActivity,
  getAuthRedirectUrl,
  type AuthError
} from '@/lib/auth/utils';

interface UseAuthOptions {
  required?: boolean;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { required = false, requiredRoles = [], redirectTo = '/login' } = options;
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle authentication state
  useEffect(() => {
    if (required && status === 'unauthenticated') {
      const returnTo = encodeURIComponent(window.location.pathname);
      router.push(`${redirectTo}?returnTo=${returnTo}`);
    }

    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [required, status, redirectTo, router]);

  // Handle role requirements
  useEffect(() => {
    if (
      session?.user &&
      requiredRoles.length > 0 &&
      !hasRequiredRole(session.user.role, requiredRoles)
    ) {
      router.push('/unauthorized');
    }
  }, [session, requiredRoles, router]);

  // Authentication methods
  const login = useCallback(async (provider: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: getAuthRedirectUrl(window.location.pathname),
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (session?.user) {
        await trackAuthActivity({
          userId: session.user.id,
          type: ActivityType.SIGN_IN,
          metadata: { provider }
        });
      }

      return result;
    } catch (err) {
      setError({
        code: 'SIGNIN_ERROR',
        message: err instanceof Error ? err.message : 'Failed to sign in',
        timestamp: new Date()
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (session?.user) {
        await trackAuthActivity({
          userId: session.user.id,
          type: ActivityType.SIGN_OUT
        });
      }

      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      setError({
        code: 'SIGNOUT_ERROR',
        message: err instanceof Error ? err.message : 'Failed to sign out',
        timestamp: new Date()
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [session, router]);

  // Utility methods
  const checkAccess = useCallback((feature: string) => {
    if (!session?.user) return false;
    return canAccessFeature(session.user.role, feature as any);
  }, [session]);

  const isActive = useCallback(() => {
    return session?.user?.status === AccountStatus.ACTIVE;
  }, [session]);

  return {
    session,
    status,
    isLoading,
    error,
    user: session?.user,
    isAuthenticated: !!session?.user,
    isActive: isActive(),
    login,
    logout,
    checkAccess,
    updateSession: update,
  };
}
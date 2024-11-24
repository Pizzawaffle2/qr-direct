'use client';

import {signIn } from 'next-auth/react';
import {Button } from '@/components/ui/button';
import {motion } from 'framer-motion';
import {Github, Mail, Linkedin, Apple } from 'lucide-react';
import {useState } from 'react';
import {Loader2 } from 'lucide-react';

interface OAuthButtonsProps {
  callbackUrl?: string;
}

export function OAuthButtons({ callbackUrl = '/' }: OAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleOAuthSignIn = async (provider: string) => {
    try {
      setIsLoading((prev) => ({ ...prev, [provider]: true }));
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error('OAuth error:', error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const oauthProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: Mail,
      className: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      className: 'bg-gray-800 hover:bg-gray-900',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      className: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  return (
    <div className="grid gap-3">
      {oauthProviders.map((provider) => (
        <motion.div
          key={provider.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            type="button"
            variant="outline"
            className={`h-11 w-full ${provider.className} border-0 text-white`}
            onClick={() => handleOAuthSignIn(provider.id)}
            disabled={isLoading[provider.id]}
          >
            {isLoading[provider.id] ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <provider.icon className="mr-2 h-5 w-5" />
                Continue with {provider.name}
              </>
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

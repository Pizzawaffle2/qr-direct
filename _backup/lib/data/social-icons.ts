// File: src/lib/data/social-icons.ts
export const socialIcons = [
    {
      name: 'Facebook',
      icon: '/icons/social/facebook.svg',
      color: '#1877F2',
      categories: ['social']
    },
    {
      name: 'Instagram',
      icon: '/icons/social/instagram.svg',
      color: '#E4405F',
      categories: ['social']
    },
    {
      name: 'X (Twitter)',
      icon: '/icons/social/x.svg',
      color: '#000000',
      categories: ['social']
    },
    {
      name: 'LinkedIn',
      icon: '/icons/social/linkedin.svg',
      color: '#0A66C2',
      categories: ['social', 'business']
    },
    {
      name: 'YouTube',
      icon: '/icons/social/youtube.svg',
      color: '#FF0000',
      categories: ['social']
    },
    {
      name: 'TikTok',
      icon: '/icons/social/tiktok.svg',
      color: '#000000',
      categories: ['social']
    },
    {
      name: 'Reddit',
      icon: '/icons/social/reddit.svg',
      color: '#FF4500',
      categories: ['social']
    },
    {
      name: 'GitHub',
      icon: '/icons/social/github.svg',
      color: '#181717',
      categories: ['development', 'business']
    },
    {
      name: 'WhatsApp',
      icon: '/icons/social/whatsapp.svg',
      color: '#25D366',
      categories: ['messaging']
    },
    {
      name: 'Telegram',
      icon: '/icons/social/telegram.svg',
      color: '#26A5E4',
      categories: ['messaging']
    },
    {
      name: 'Discord',
      icon: '/icons/social/discord.svg',
      color: '#5865F2',
      categories: ['messaging']
    },
    {
      name: 'PayPal',
      icon: '/icons/payment/paypal.svg',
      color: '#00457C',
      categories: ['payment']
    },
    {
      name: 'Spotify',
      icon: '/icons/media/spotify.svg',
      color: '#1DB954',
      categories: ['media']
    },
    {
      name: 'Apple Music',
      icon: '/icons/media/apple-music.svg',
      color: '#FA243C',
      categories: ['media']
    },
    {
      name: 'Google Play',
      icon: '/icons/store/google-play.svg',
      color: '#414141',
      categories: ['store']
    },
    {
      name: 'App Store',
      icon: '/icons/store/app-store.svg',
      color: '#0D96F6',
      categories: ['store']
    }
  ]
  
  export type IconCategory = 'social' | 'business' | 'messaging' | 'payment' | 'media' | 'store';
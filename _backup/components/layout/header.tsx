'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  LogIn,
  LogOut,
  Menu,
  Settings,
  User,
  History,
  Github,
  Plus,
  BookOpen,
  Book,
  Bell,
  Crown,
  CreditCard,
  Layout,
  Key,
  FolderHeart,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Add this animation helper
const iconAnimation = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// Add special animations for specific icons
const specialIconAnimations = {
  bell: {
    initial: { rotate: 0 },
    hover: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  },
  create: {
    initial: { rotate: 0 },
    hover: {
      rotate: 90,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  },
  logout: {
    initial: { x: 0 },
    hover: {
      x: 3,
      transition: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 0.3,
      },
    },
  },
};

// Create animated icon wrapper component
function AnimatedIcon({ icon: Icon, animation = 'default', className = '' }) {
  const animationPreset =
    animation === 'default' ? iconAnimation : specialIconAnimations[animation];

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      className="relative inline-flex"
      variants={animationPreset}
    >
      <Icon className={className} />
    </motion.div>
  );
}

// Update navigation items with hover styles
const navigationItems = [
  {
    title: 'Create',
    href: '/create',
    icon: Plus,
    pro: false,
    animation: 'create',
  },
  {
    title: 'Templates',
    href: '/templates',
    icon: FolderHeart,
    pro: false,
    animation: 'default',
  },
  {
    title: 'History',
    href: '/history',
    icon: History,
    pro: false,
    animation: 'default',
  },
  {
    title: 'Docs',
    href: '/docs',
    icon: BookOpen,
    pro: false,
    animation: 'default',
  },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (['/login', '/register', '/verify-email'].includes(pathname)) {
    return null;
  }

  const userNavigation = [
    {
      title: 'Personal',
      items: [
        {
          title: 'Profile',
          href: '/profile',
          icon: User,
        },
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: Layout,
        },
        {
          title: 'Settings',
          href: '/settings',
          icon: Settings,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Upgrade to Pro',
          href: '/pricing',
          icon: Crown,
          badge: 'Pro',
        },
        {
          title: 'Billing',
          href: '/billing',
          icon: CreditCard,
        },
        {
          title: 'API Keys',
          href: '/settings/api-keys',
          icon: Key,
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                QR Direct
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={
                    item.animation === 'create' ? specialIconAnimations.create : iconAnimation
                  }
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4',
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-primary'
                    )}
                  />
                </motion.div>
                <span>{item.title}</span>
                {item.pro && (
                  <Badge variant="secondary" className="ml-1">
                    PRO
                  </Badge>
                )}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-primary"
                    layoutId="activeTab"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="group relative">
                    <motion.div
                      whileHover="hover"
                      variants={specialIconAnimations.bell}
                      className="relative"
                    >
                      <Bell className="h-5 w-5 transition-colors group-hover:text-primary" />
                      <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[60vh] overflow-auto">{/* Notification content */}</div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Avatar>
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback>
                          {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {userNavigation.map((group, index) => (
                    <React.Fragment key={group.title}>
                      {index > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          {group.title}
                        </DropdownMenuLabel>
                        {group.items.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href} className="group cursor-pointer">
                              <motion.div
                                whileHover="hover"
                                variants={iconAnimation}
                                className="mr-2 inline-flex"
                              >
                                <item.icon className="h-4 w-4 group-hover:text-primary" />
                              </motion.div>
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-2">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </React.Fragment>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="group cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut()}
                  >
                    <motion.div
                      whileHover="hover"
                      variants={specialIconAnimations.logout}
                      className="mr-2 inline-flex"
                    >
                      <LogOut className="h-4 w-4 group-hover:text-red-600" />
                    </motion.div>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="ghost" className="group">
                  <Link href="/login" className="flex items-center">
                    <motion.div
                      whileHover="hover"
                      variants={iconAnimation}
                      className="mr-2 inline-flex"
                    >
                      <LogIn className="h-4 w-4 group-hover:text-primary" />
                    </motion.div>
                    Sign In
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild>
                  <Link href="/register">Sign Up Free</Link>
                </Button>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="group">
                <motion.div whileHover="hover" variants={iconAnimation}>
                  <Menu className="h-5 w-5 group-hover:text-primary" />
                </motion.div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navigationItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="group cursor-pointer">
                    <motion.div
                      whileHover="hover"
                      variants={iconAnimation}
                      className="mr-2 inline-flex"
                    >
                      <item.icon className="h-4 w-4 group-hover:text-primary" />
                    </motion.div>
                    <span className="flex-1">{item.title}</span>
                    {item.pro && (
                      <Badge variant="secondary" className="ml-2">
                        PRO
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="https://github.com/yourusername/qr-direct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                >
                  <motion.div
                    whileHover="hover"
                    variants={iconAnimation}
                    className="mr-2 inline-flex"
                  >
                    <Github className="h-4 w-4 group-hover:text-primary" />
                  </motion.div>
                  GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

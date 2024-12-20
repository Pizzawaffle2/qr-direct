'use client';

import Link from 'next/link';
import {User } from 'next-auth';
import {usePathname } from 'next/navigation';
import {useState } from 'react';
import {Button } from '@/components/ui/button';
import {DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {Settings, LogOut, Home, Bell, Menu, X } from 'lucide-react';
import {signOut } from 'next-auth/react';
import {motion } from 'framer-motion';
import {useTheme } from 'next-themes';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header className="header sticky top-0 z-50 w-full border-b bg-white/80 shadow-sm backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            QR Direct
          </Link>
          <nav className="hidden space-x-4 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <item.icon className="mr-1 inline-block h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <motion.h1
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pathname === '/dashboard'
              ? 'Dashboard'
              : (pathname?.split('/').pop()?.replace('-', ' ') ?? &apos;Dashboard&apos;)}
          </motion.h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                  <AvatarFallback>{user.name?.charAt(0) || &apos;U&apos;}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" className="md:hidden">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="bg-white shadow-md dark:bg-gray-900 md:hidden">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <item.icon className="mr-1 inline-block h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/settings"
                className="text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <Settings className="mr-1 inline-block h-5 w-5" />
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center text-red-600 transition-colors duration-200 hover:text-red-800"
              >
                <LogOut className="mr-1 inline-block h-5 w-5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

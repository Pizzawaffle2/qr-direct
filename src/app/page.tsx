// File: src/app/page.tsx
"use client";

import { QRCodeTabs } from "@/components/qr-code-tabs";
import { useHistoryStore } from "@/lib/store/history-store";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { 
  Trash2, 
  Sparkles, 
  Share2, 
  Download, 
  ChevronRight,
  Star,
  Zap,
  Shield,
  Users 
} from "lucide-react";
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import confetti from 'canvas-confetti';
import dynamic from 'next/dynamic';
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const FloatingActions = dynamic(
  () => import('@/components/ui/FloatingActions'),
  { ssr: false }
);

const StatCard = ({ icon: Icon, title, value, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <Icon className="w-8 h-8 text-primary mb-4" />
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <div className="text-4xl font-bold text-primary mb-2">{value}</div>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

export default function Home() {
  const { history, removeFromHistory } = useHistoryStore();
  const { toast } = useToast();
  const { theme } = useTheme();

  const triggerConfetti = () => {
    const colors = theme === 'dark' 
      ? ['#fff', '#3b82f6', '#10b981', '#6366f1']
      : ['#3b82f6', '#10b981', '#6366f1', '#000'];

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true
    });
  };

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700">
        {/* Hero Section */}
        <div className="container max-w-6xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge 
              variant="outline" 
              className="mb-4 px-4 py-1 text-sm animate-pulse"
            >
              ✨ New Features Available
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
              Create Professional QR Codes
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Design, customize, and share QR codes that perfectly match your brand.
              No design skills needed.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Button size="lg" className="group">
                Get Started
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                View Templates
              </Button>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatCard
              icon={Zap}
              title="QR Codes"
              value="10M+"
              description="Generated & counting"
            />
            <StatCard
              icon={Users}
              title="Users"
              value="50K+"
              description="Trust our platform"
            />
            <StatCard
              icon={Star}
              title="Rating"
              value="4.9"
              description="Customer satisfaction"
            />
            <StatCard
              icon={Shield}
              title="Security"
              value="100%"
              description="Data protection"
            />
          </div>

          {/* Main QR Generator */}
          <Parallax translateY={[0, 30]}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative group bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-xl mb-24 border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <QRCodeTabs />
            </motion.div>
          </Parallax>

          {/* Features Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Our QR Generator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "Beautiful Designs",
                  description: "Create stunning QR codes that match your brand identity"
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description: "Your data is protected with enterprise-grade security"
                },
                {
                  icon: Share2,
                  title: "Easy Sharing",
                  description: "Share your QR codes instantly across any platform"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                >
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        {/* Recently Generated QR Codes */}
        {history.length > 0 && (
          <div className="mb-24">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100 animate-fade-in-up">
              Recently Generated QR Codes
            </h2>
            <div className="grid gap-16 md:grid-cols-2">
              {history.slice(0, 4).map((item) => (
                <Parallax key={item.id} translateY={[0, 20]}>
                  <div
                    className="p-10 border rounded-3xl shadow-lg flex flex-col items-center bg-white dark:bg-gray-800 transition-transform hover:shadow-3xl hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transform hover:-translate-y-3 duration-700 ease-in-out animate-slide-in-up neon-border-animated"
                  >
                    <div className="w-44 h-44 mb-6 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-inner hover:shadow-md transition-transform duration-700 hover:scale-110">
                      <img src={item.url} alt={item.title} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Created {format(new Date(item.created), 'PPp')}
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        className="mb-4 w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-lg shadow-xl hover:from-blue-700 hover:to-teal-700 transition-transform duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl neon-glow pulse-animation"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = item.url;
                          link.download = `${item.title}.png`;
                          link.click();
                          triggerConfetti();
                        }}
                      >
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 transition-transform duration-700 ease-in-out transform hover:scale-110"
                        onClick={() => {
                          removeFromHistory(item.id);
                          toast({
                            title: "QR Code Deleted",
                            description: "The QR code has been removed from your history.",
                            variant: "destructive",
                          });
                        }}
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Parallax>
              ))}
            </div>
          </div>
        )}
        
        {/* Floating Action Button (FAB) */}
        </div>
        <FloatingActions />
      </div>
    </ParallaxProvider>
  );
}


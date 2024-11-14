import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <div className="text-center space-y-8">
      <h2 className="text-4xl font-bold text-white">
        Ready to Get Started?
      </h2>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto">
        Join thousands of satisfied customers and start creating professional QR codes today
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild>
          <Link href="/register">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/contact">
            Contact Sales
          </Link>
        </Button>
      </div>
    </div>
  );
}
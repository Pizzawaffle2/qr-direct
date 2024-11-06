"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Card className="w-full max-w-md p-6 space-y-6 bg-slate-900/50 border-slate-800/50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
          <p className="text-muted-foreground">
            Please check your email for a verification link.
          </p>
        </div>

        {email && (
          <div className="text-center">
            <p className="mb-4">Verification email sent to:</p>
            <p className="font-medium">{email}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
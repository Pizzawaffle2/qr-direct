'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function BillingStatus() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscription");
        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }
        const data = await response.json();
        setSubscription(data.subscription);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSubscription();
    }
  }, [session, toast]);

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }

  if (!subscription) {
    return <p>No subscription found.</p>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Subscription Status</h2>
      <p className="text-muted-foreground">
        {subscription.status === "active" ? "Active" : "Inactive"}
      </p>
      <Button variant="outline" onClick={() => console.log("Manage Subscription")}>
        Manage Subscription
      </Button>
    </Card>
  );
}
// File: src/app/profile/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const { data: session } = useSession();
  const [image, setImage] = useState(session?.user.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false); // Add state for dark mode
  const [emailNotifications, setEmailNotifications] = useState(true); // Add state for email notifications

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name || "",
    },
  });

  useEffect(() => {
    if (session) {
      form.setValue("name", session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setImage(e.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.name, image }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDarkModeChange = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would typically update the user's preference in the database or local storage
  };

  const handleEmailNotificationsChange = () => {
    setEmailNotifications(!emailNotifications);
    // Here you would typically update the user's preference in the database or local storage
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <div className="flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={image} alt={form.getValues("name")} />
                    <AvatarFallback>
                      {form.getValues("name")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2 flex justify-center">
                  <Button variant="outline" asChild>
                    <motion.label
                      htmlFor="image"
                      className="cursor-pointer flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center">
                        <label
                          htmlFor="image"
                          className="flex cursor-pointer items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <Image 
                            src="/icons/photo.svg"
                            width={16}
                            height={16}
                            className="mr-2" 
                            alt="Upload photo icon" 
                          />
                          {image ? "Change Photo" : "Upload Photo"}
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                    </motion.label>
                  </Button>
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={session?.user.email || ""}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={handleDarkModeChange}
                  />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={handleEmailNotificationsChange}
                  />
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
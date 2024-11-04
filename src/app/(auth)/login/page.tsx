"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Github, Loader2, Mail, Eye, EyeOff, ArrowRight, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ParticleBackground } from "@/components/ui/particle-background"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type FormData = z.infer<typeof formSchema>

const Header = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-0 left-0 right-0 z-50 p-4"
  >
    <div className="container mx-auto">
      <Link href="/" className="inline-flex items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-morphism rounded-full p-2 text-white hover:text-blue-400 transition-colors"
        >
          <Home className="h-6 w-6" />
        </motion.div>
      </Link>
    </div>
  </motion.div>
)

const FormHeader = () => (
  <div className="relative px-12 pt-16 pb-8 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
        <div className="h-full w-full rounded-full bg-slate-950 p-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
          />
        </div>
      </div>
    </motion.div>
    
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-4xl font-bold tracking-tight text-white"
    >
      Welcome back
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-4 text-lg text-gray-400"
    >
      Sign in to your account to continue
    </motion.p>
  </div>
)

const BackgroundEffects = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 animate-gradient-xy" />
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />
    
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
        opacity: [0.3, 0.2, 0.3],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, -90, 0],
        opacity: [0.3, 0.2, 0.3],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"
    />
  </div>
)

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const callbackUrl = searchParams?.get("callbackUrl") || "/"

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Header />
      <ParticleBackground />
      <BackgroundEffects />

      <div className="container relative z-10 mx-auto flex min-h-screen items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-morphism rounded-3xl overflow-hidden"
          >
            <FormHeader />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <FormControl>
                            <Input
                              placeholder="name@example.com"
                              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                        </motion.div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="h-12 border-white/10 bg-white/5 text-white pr-10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                        </motion.div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={false}
                        animate={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-center"
                      >
                        Sign in
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="px-12 pb-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-950 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <OAuthButtons callbackUrl={callbackUrl} />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="border-t border-white/10 bg-white/5 p-8 text-center"
            >
              <p className="text-base text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ArrowRight, KeyRound, Mail, User as UserIcon, Sparkles } from "lucide-react";
import { setUser } from "@/features/auth/authSlice";
import { authClient, useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImg from "@/assets/IdeaNest-logo.png";
import landingImg from "@/assets/landing.png";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const { data: session } = useSession();

  // Direct asset loading using Vite bundled asset
  const [landingImage] = useState<string>(landingImg);

  // Redirect if session already exists
  useEffect(() => {
    if (session) {
      dispatch(
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image || undefined,
        })
      );
      navigate("/app", { replace: true });
    }
  }, [session, navigate, dispatch]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    try {
      if (isSignUp) {
        if (!values.name?.trim()) {
          setError("name", { type: "manual", message: "Name is required" });
          return;
        }

        const res = await authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
        });

        if (res?.error) {
          toast.error(res.error.message || "Failed to create account");
          return;
        }

        toast.success("Account created successfully!");
        window.location.href = "/app";
      } else {
        const res = await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });

        if (res?.error) {
          toast.error(res.error.message || "Invalid credentials");
          return;
        }

        toast.success("Welcome back!");
        window.location.href = "/app";
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/app",
      });
    } catch (error) {
      toast.error("Failed to connect with Google OAuth.");
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    reset();
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col md:flex-row overflow-hidden relative font-sans">
      {/* Background radial glows on left side */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-radial-accent pointer-events-none z-0 opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.1)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-20 z-0" />

      {/* Left Side: Auth Card Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 relative bg-[#030303]/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px] bg-[#0A0A0A]/85 border border-[#262626] backdrop-blur-md p-8 rounded-none shadow-2xl relative"
        >
          {/* Top subtle glow line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-500/30 to-transparent" />

          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="flex flex-col items-center gap-2 mb-3">
              <img src={logoImg} alt="IdeaNest Logo" className="h-32 w-auto object-contain" />
            </Link>
            <h2 className="text-xl font-bold text-accent-gold tracking-tight">
              {isSignUp ? "Create your brain index" : "Access your Second Brain"}
            </h2>
            <p className="text-xs text-[#737373] mt-1.5 leading-relaxed">
              {isSignUp
                ? "Sign up to start organizing and securing your brainstorms"
                : "Enter credentials to sync and capitalize your mental assets"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-semibold text-[#737373] flex items-center gap-1.5">
                    <UserIcon className="size-3.5" /> Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Jane Doe"
                    className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-neutral-500 rounded-none"
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400 font-medium">{errors.name.message}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#737373] flex items-center gap-1.5">
                <Mail className="size-3.5" /> Email Address
              </label>
              <Input
                type="email"
                placeholder="name@domain.com"
                className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-neutral-500 rounded-none"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-red-400 font-medium">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#737373] flex items-center gap-1.5">
                <KeyRound className="size-3.5" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-neutral-500 rounded-none"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-xs text-red-400 font-medium">{errors.password.message}</span>
              )}
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-gold hover:bg-[#DBC182] text-[#030303] font-semibold h-11 rounded-none mt-6 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-gold/10 border border-transparent transition-all"
            >
              <span>{isSubmitting ? "Authenticating..." : isSignUp ? "Create Account" : "Continue"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Social login separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#262626]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#0A0A0A] px-3 text-[#737373] font-mono tracking-wider">or authenticate with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full border-accent-gold/20 bg-[#111111]/50 hover:bg-accent-gold/5 hover:border-accent-gold/40 text-accent-gold h-11 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="size-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Toggle Switch */}
          <div className="mt-8 text-center text-xs">
            <span className="text-[#737373]">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              onClick={toggleAuthMode}
              className="text-accent-gold font-semibold hover:underline cursor-pointer focus:outline-none"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Professional Hero Visual */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#090909] border-l border-[#262626] overflow-hidden items-center justify-center p-12">
        {/* Soft radial glow on right side */}
        <div className="absolute top-[40%] right-[10%] w-[45vw] h-[45vh] bg-radial-green-accent pointer-events-none z-0 opacity-20" />
        
        {/* Fine vertical glowing grids on right side */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

        {/* Hero image and gradient overlay */}
        {landingImage && (
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={landingImage}
            alt="IdeaNest Platform Overview"
            className="absolute inset-0 size-full object-cover z-0"
          />
        )}
        
        {/* Dark vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-transparent to-transparent z-10" />

        {/* Dynamic Glass Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
          className="relative z-20 w-full max-w-[460px] bg-[#0A0A0A]/40 border border-[#262626]/80 backdrop-blur-md p-6 rounded-none mt-auto ml-0"
        >
          <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-neutral-400 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-neutral-400 to-transparent" />

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold font-mono">
              IdeaNest Vault
            </span>
          </div>
          <p className="text-accent-gold font-semibold text-lg leading-snug mb-3">
            "Your second brain, beautifully secured and structure-refined."
          </p>
          <p className="text-xs text-[#737373] leading-relaxed">
            IdeaNest is designed to capture, organize, and accelerate your digital brainstorms. Connect credentials, sync vaults, and capitalize your mental assets seamlessly.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Brain,
  Sparkles,
  Lightbulb,
  Notebook,
  PencilLine,
  Search,
  FolderTree,
  Target,
  Rocket,
  Archive,
  CheckCircle2,
  BookOpen,
  Clock3,
  Layers3,
  ShieldCheck,
  Compass,
  Sprout,
  Hammer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth";
import PixelSnow from "@/components/ui/PixelSnow";

export default function Landing() {
  const { data: session } = useSession();

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Clean product feature moving row lists
  const techRow1 = [
    { name: "New Idea", icon: Lightbulb },
    { name: "Quick Capture", icon: Sparkles },
    { name: "Brainstorm", icon: Brain },
    { name: "Deep Thinking", icon: Compass },
    { name: "Research", icon: Search },
    { name: "Organize", icon: FolderTree },
    { name: "Smart Notes", icon: Notebook },
    { name: "Focus", icon: Target },
    { name: "Build", icon: Rocket },
    { name: "Progress", icon: Clock3 },
    { name: "Complete", icon: CheckCircle2 },
    { name: "Archive", icon: Archive },
  ];

  const techRow2 = [
    { name: "Second Brain", icon: Brain },
    { name: "Daily Inspiration", icon: Sparkles },
    { name: "Project Planning", icon: Layers3 },
    { name: "Knowledge Base", icon: BookOpen },
    { name: "Personal Growth", icon: Target },
    { name: "Creative Workflow", icon: PencilLine },
    { name: "Idea Evolution", icon: Lightbulb },
    { name: "Productivity", icon: Clock3 },
    { name: "Long-Term Vision", icon: Compass },
    { name: "Never Lose Ideas", icon: ShieldCheck },
    { name: "Private Workspace", icon: Notebook },
    { name: "Always Available", icon: Clock3 },
  ];

  return (
    <div className="relative min-h-screen bg-[#030303] overflow-x-hidden text-[#F5F5F5] font-sans">
      {/* Background Accent Radial Glows (Keep original glows) */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-radial-accent pointer-events-none z-0 opacity-80" />
      <div className="absolute top-[40vh] left-0 w-[50vw] h-[55vh] bg-radial-green-accent pointer-events-none z-0 opacity-30" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.1)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50 z-0" />

      {/* NAVBAR */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-[#262626]/20">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-wider bg-gradient-to-r from-[#F5F5F5] to-[#737373] bg-clip-text text-accent-gold font-mono">
            IdeaNest
          </span>
        </div>

      
        {/* Right Side: Action buttons */}
        <div className="flex items-center gap-3">
          {session ? (
            <Link to="/app" className="flex items-center gap-2 text-xs font-semibold text-[#F5F5F5] transition-all bg-[#111111] border border-[#2A2A2A] px-4.5 py-2 rounded-none hover:bg-[#1A1A1A]">
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs font-semibold text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link to="/login" className="text-xs font-semibold text-[#030303] bg-accent-gold hover:bg-[#DBC182] transition-all px-4 py-2 rounded-none shadow-md shadow-accent-gold/10">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative z-10 w-full pt-12 pb-24 overflow-hidden min-h-[80vh] flex items-center">
        {/* WebGL LineWaves Localized Hero Background - Full Width */}
        {/* WebGL PixelSnow Background - Full Width */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
          <PixelSnow 
            color="#C9A961"
            flakeSize={0.015}
            minFlakeSize={1.25}
            pixelResolution={200}
            speed={1.25}
            density={0.3}
            direction={125}
            brightness={1}
            farPlane={25}
          />
        </div>

        {/* Centered Content Wrapper (Centered Text Layout) */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 w-full min-h-[65vh]">
          {/* Content: Heading, Subheading, CTAs */}
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-accent-gold/40 bg-accent-gold/5 text-accent-gold text-[10px] font-medium tracking-wider uppercase w-fit font-mono"
            >
              <Sparkles className="size-3 text-accent-gold" />
              <span>Personal Second Brain</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F5F5] leading-[1.1] max-w-4xl"
            >
              Capture Every <span className="text-accent-gold">Idea</span> Before It's Gone.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl leading-relaxed font-light"
            >
              IdeaNest is your personal second brain—capture ideas, organize your thoughts, add notes, and turn inspiration into finished projects.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-4 pt-2"
            >
              {session ? (
                <Link to="/app">
                  <Button size="lg" className="bg-accent-gold hover:bg-[#DBC182] text-[#030303] font-semibold h-11 px-6 rounded-none shadow-xl shadow-accent-gold/10 cursor-pointer text-xs">
                    <span>Go to Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-accent-gold hover:bg-[#DBC182] text-[#030303] font-semibold h-11 px-6 rounded-none shadow-xl shadow-accent-gold/10 cursor-pointer text-xs">
                      <span>Get Started</span>
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-accent-gold/30 bg-transparent hover:bg-accent-gold/5 text-accent-gold h-11 px-6 rounded-none cursor-pointer text-xs">
                      <span>Sign In</span>
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY IDEANEST */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 py-28 border-t border-[#262626]/20 bg-[#111111]/10 rounded-none">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#A3A3A3] block border-l-2 border-accent-gold pl-2 w-fit mx-auto">
            Why IdeaNest
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-accent-gold">
            Your Ideas Deserve More Than Sticky Notes
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#A3A3A3] font-light leading-relaxed max-w-2xl mx-auto text-left sm:text-center">
            <p>
              Ideas often disappear before they become something meaningful. IdeaNest provides a dedicated space where every thought can grow from a simple concept into a completed project.
            </p>
            <p>
              Whether it's a startup idea, study note, personal goal, or creative inspiration, IdeaNest keeps everything organized in one place.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: IDEA LIFECYCLE */}
      <section id="lifecycle" className="relative z-10 max-w-7xl mx-auto px-6 py-28 border-t border-[#262626]/20 bg-[#111111]/10 rounded-none">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#A3A3A3] block border-l-2 border-accent-gold pl-2 w-fit mx-auto">
            Workflow stages
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-accent-gold">
            Idea Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A3A3] font-light max-w-xl mx-auto leading-relaxed">
            Every great project starts as a simple thought. Track your ideas through each stage of development, lighting up the path from seed concept to completion.
          </p>
        </div>

        {/* Center Linear Chain with Two Connecting Lines */}
        <div className="relative mt-16 max-w-5xl mx-auto z-10 flex flex-col items-center py-6">
          
          <div className="grid grid-cols-4 gap-4 w-full relative z-10">
            {[
              { name: "Seed", icon: Sprout, desc: "A fresh raw thought captured" },
              { name: "Thinking", icon: Brain, desc: "Refining details & mapping synapses" },
              { name: "Building", icon: Hammer, desc: "Active development & crafting" },
              { name: "Completed", icon: CheckCircle2, desc: "A finished second-brain asset" }
            ].map((stage, idx) => {
              const isActive = activeStage === idx;
              const IconComponent = stage.icon;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center group cursor-pointer"
                  onClick={() => setActiveStage(idx)}
                >
                  {/* Square Stage Box - Equal size: w-32 h-32 (128px) */}
                  <div
                    className={`w-32 h-32 flex flex-col items-center justify-center p-4 bg-[#111111] border transition-all duration-500 ease-out rounded-none relative ${isActive
                        ? "border-accent-gold bg-[#161512] shadow-[0_0_20px_rgba(201,169,97,0.12)] scale-105"
                        : "border-[#262626] hover:border-[#525252] bg-[#0A0A0A]"
                      }`}
                  >
                    {/* Top corner ornaments for active box */}
                    {isActive && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-px bg-accent-gold" />
                        <div className="absolute top-0 left-0 w-px h-2 bg-accent-gold" />
                        <div className="absolute bottom-0 right-0 w-2 h-px bg-accent-gold" />
                        <div className="absolute bottom-0 right-0 w-px h-2 bg-accent-gold" />
                      </>
                    )}

                    <IconComponent className={`size-6 mb-2 transition-colors duration-500 ${isActive ? "text-accent-gold" : "text-[#737373] group-hover:text-[#F5F5F5]"
                      }`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider font-mono transition-colors duration-500 ${isActive ? "text-accent-gold" : "text-[#F5F5F5]"
                      }`}>
                      {stage.name}
                    </span>
                    <span className={`text-[8px] uppercase tracking-widest text-[#737373] font-mono mt-1 ${isActive ? "text-accent-gold/70" : ""}`}>
                      Stage 0{idx + 1}
                    </span>
                  </div>

                  {/* Stage description text underneath */}
                  <p className={`text-[10px] font-light max-w-[120px] leading-normal mt-4 transition-opacity duration-500 ${isActive ? "text-[#F5F5F5] font-normal" : "text-[#737373]"
                    }`}>
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES SECTION */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-28 border-t border-[#262626]/20 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#A3A3A3] block border-l-2 border-accent-gold pl-2 w-fit mx-auto">
            Application features
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-accent-gold">
            Everything Your Ideas Need
          </h2>
          <p className="text-xs text-[#A3A3A3] font-light max-w-md mx-auto leading-relaxed">
            A complete workspace designed to capture, organize, and transform ideas into meaningful projects.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-6 hover:border-neutral-700 transition-all group">
            <Sparkles className="size-6 text-[#A3A3A3] mb-4 group-hover:text-accent-gold transition-colors" />
            <h3 className="text-sm font-semibold text-accent-gold mb-2">Capture Ideas</h3>
            <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
              Quickly save thoughts before they're forgotten.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-6 hover:border-neutral-700 transition-all group">
            <FolderTree className="size-6 text-[#A3A3A3] mb-4 group-hover:text-accent-gold transition-colors" />
            <h3 className="text-sm font-semibold text-accent-gold mb-2">Organize Everything</h3>
            <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
              Keep ideas neatly categorized with notes, tags, and folders.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-6 hover:border-neutral-700 transition-all group">
            <Layers3 className="size-6 text-[#A3A3A3] mb-4 group-hover:text-accent-gold transition-colors" />
            <h3 className="text-sm font-semibold text-accent-gold mb-2">Track Progress</h3>
            <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
              Watch ideas evolve from inspiration to execution.
            </p>
          </div>
          {/* Card 4 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-6 hover:border-neutral-700 transition-all group">
            <Notebook className="size-6 text-[#A3A3A3] mb-4 group-hover:text-accent-gold transition-colors" />
            <h3 className="text-sm font-semibold text-accent-gold mb-2">Rich Notes</h3>
            <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
              Expand every idea with detailed notes and research.
            </p>
          </div>
          {/* Card 5 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-6 hover:border-neutral-700 transition-all group">
            <Search className="size-6 text-[#A3A3A3] mb-4 group-hover:text-accent-gold transition-colors" />
            <h3 className="text-sm font-semibold text-accent-gold mb-2">Search Instantly</h3>
            <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
              Find ideas in seconds using powerful search and filters.
            </p>
          </div>
          {/* Card 6 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-6 hover:border-neutral-700 transition-all group">
            <ShieldCheck className="size-6 text-[#A3A3A3] mb-4 group-hover:text-accent-gold transition-colors" />
            <h3 className="text-sm font-semibold text-accent-gold mb-2">Secure Sync</h3>
            <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
              Your ideas stay private and securely stored in the cloud.
            </p>
          </div>
        </div>

        {/* Customized Moving Marquee Underneath */}
        <div className="pt-8 space-y-6">
          {/* Row 1: Left-to-Right */}
          <div className="marquee-container">
            <div className="animate-marquee-ltr gap-6 pr-6">
              {techRow1.concat(techRow1).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-start w-52 h-11 shrink-0 gap-2.5 px-4.5 rounded-none border border-[#2A2A2A] bg-[#1A1A1A] text-xs font-semibold text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-neutral-500 transition-all font-mono truncate"
                >
                  <item.icon className="size-4 text-neutral-500 shrink-0" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right-to-Left */}
          <div className="marquee-container">
            <div className="animate-marquee-rtl gap-6 pr-6">
              {techRow2.concat(techRow2).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-start w-52 h-11 shrink-0 gap-2.5 px-4.5 rounded-none border border-[#2A2A2A] bg-[#1A1A1A] text-xs font-semibold text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-neutral-500 transition-all font-mono truncate"
                >
                  <item.icon className="size-4 text-neutral-500 shrink-0" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-28 border-t border-[#262626]/20 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#A3A3A3] block border-l-2 border-accent-gold pl-2 w-fit mx-auto">
            Process flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-accent-gold">How It Works</h2>
        </div>

        {/* 3 Simple Cards with connecting layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-8 relative flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="size-8 rounded-none bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-xs font-bold text-accent-gold font-mono mb-4">
                1
              </div>
              <h3 className="text-sm font-semibold text-accent-gold mb-2">Capture</h3>
              <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                Save an idea the moment inspiration strikes.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-8 relative flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="size-8 rounded-none bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-xs font-bold text-accent-gold font-mono mb-4">
                2
              </div>
              <h3 className="text-sm font-semibold text-accent-gold mb-2">Develop</h3>
              <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                Add notes, organize thoughts, and refine your concept.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-none p-8 relative flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="size-8 rounded-none bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-xs font-bold text-accent-gold font-mono mb-4">
                3
              </div>
              <h3 className="text-sm font-semibold text-accent-gold mb-2">Build</h3>
              <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                Track progress until your idea becomes reality.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* SECTION 10: CALL TO ACTION (CTA) SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Faint ambient light glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-accent-gold relative z-10">
            Ready to Build Your Second Brain?
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A3A3] font-light max-w-md mx-auto leading-relaxed relative z-10">
            Capture your first idea today and start turning inspiration into action.
          </p>
          <div className="pt-2 relative z-10">
            {session ? (
              <Link to="/app">
                <Button size="lg" className="bg-accent-gold hover:bg-[#DBC182] text-[#030303] font-semibold h-11 px-8 rounded-none shadow-xl shadow-accent-gold/10 cursor-pointer text-xs">
                  <span>Go to Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="bg-accent-gold hover:bg-[#DBC182] text-[#030303] font-semibold h-11 px-8 rounded-none shadow-xl shadow-accent-gold/10 cursor-pointer text-xs">
                  <span>Get Started</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-[#262626]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-[#A3A3A3] text-xs">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-neutral-500" />
          <span>© 2026 IdeaNest, Inc. All rights reserved.</span>
        </div>

        {/* Footer Nav */}
        <div className="flex items-center gap-6 font-mono text-[10px]">
          <a href="#features" className="hover:text-[#F5F5F5] transition-colors">Features</a>
          <a href="#roadmap" className="hover:text-[#F5F5F5] transition-colors">Roadmap</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5F5] transition-colors">GitHub</a>
          <span className="cursor-pointer hover:text-[#F5F5F5] transition-colors">Privacy</span>
          <span className="cursor-pointer hover:text-[#F5F5F5] transition-colors">Terms</span>
        </div>
      </footer>
    </div>
  );
}

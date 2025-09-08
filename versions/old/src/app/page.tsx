import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Github, Linkedin, Mail, Code, Zap, Brain, Rocket } from "lucide-react";
import { HeroSpotlight } from "@/components/ui/spotlight";
import { GlowCard, SkillCard, ProjectCard } from "@/components/ui/glow-card";
import { TechMarquee } from "@/components/ui/marquee";
import BorderBeam, { BorderBeamCard, ProjectBeamCard } from "@/components/ui/border-beam";
import { KineticText, TypewriterText } from "@/components/ui/kinetic-text";
import { Card3D, FloatingElement, AnimatedCube } from "@/components/ui/3d-card";
import { GlassCard, GlassButton } from "@/components/ui/glassmorphism";
import { ScrollReveal, ParallaxElement, ScrollProgress, MorphingBackground, GlassyBackdrop } from "@/components/ui/scroll-effects";
import { ParticleSystem, FloatingShapes, MorphingBlob } from "@/components/ui/particle-system";
import { MorphingText, NeonText, LiquidText, ShimmerText, Text3D } from "@/components/ui/text-effects";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Advanced Morphing Background */}
      <MorphingBackground />
      <MorphingBlob />
      <ParticleSystem particleCount={30} interactive={true} className="z-5" />
      <FloatingShapes />
        
        {/* Background Spotlight */}
        <HeroSpotlight className="absolute inset-0 pointer-events-none z-10" />
       
       {/* Navigation */}
       <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-slate-900">
              Jeffrey Kerr
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
                About
              </a>
              <a href="#portfolio" className="text-slate-600 hover:text-slate-900 transition-colors">
                Portfolio
              </a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </a>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
       <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-20">
         <div className="max-w-7xl mx-auto">
           <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Available for new opportunities
            </div>
            
            {/* Main Heading - Bold Typography 2025 */}
            <div className="relative mb-8">
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tight mb-4">
                <KineticText 
                  text="Hi, I'm " 
                  className="inline-block text-slate-900/80 font-light"
                  delay={300}
                  staggerDelay={0.08}
                />
                <br className="block sm:hidden" />
                <MorphingText 
                  colors={['#1e40af', '#7c3aed', '#0891b2', '#059669']}
                  className="text-6xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                  duration={6000}
                >
                  Jeffrey Kerr
                </MorphingText>
              </h1>
              {/* Layered Typography Effect */}
              <div className="absolute -top-4 -left-4 text-8xl sm:text-9xl lg:text-[12rem] font-black text-slate-100 -z-10 select-none">
                CREATIVE
              </div>
            </div>
            
            {/* Subtitle - Enhanced Typography */}
            <div className="relative mb-12">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 mb-6 max-w-4xl mx-auto leading-tight">
                <TypewriterText 
                  text="AI-Enhanced Creative Technologist building the future with"
                  delay={1500}
                  speed={30}
                />
                <br className="hidden sm:block" />
                <NeonText color="#1e40af" glowIntensity="medium" className="font-black text-3xl sm:text-4xl lg:text-5xl"> intelligent systems</NeonText> and
                <LiquidText colors={['#7c3aed', '#0891b2']} className="font-black text-3xl sm:text-4xl lg:text-5xl"> innovative solutions</LiquidText>
              </p>
              
              {/* Large Background Text */}
              <div className="absolute top-0 right-0 text-6xl sm:text-8xl lg:text-9xl font-black text-slate-50 -z-10 select-none opacity-50">
                TECH
              </div>
            </div>
            
            {/* Description - Improved Hierarchy */}
            <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Specializing in <span className="font-bold text-slate-800">multi-agent AI systems</span>, 
              <span className="font-bold text-slate-800">advanced automation</span>, and 
              <span className="font-bold text-slate-800">cutting-edge web technologies</span>. 
              <br className="hidden sm:block" />
              Ready to transform your vision into reality.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <GlassButton variant="primary" size="lg" className="px-8 py-3 text-lg">
                <span className="flex items-center">
                  View My Work
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </GlassButton>
              <GlassButton variant="secondary" size="lg" className="px-8 py-3 text-lg">
                <span className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                </span>
              </GlassButton>
            </div>
            
            {/* Floating 3D Elements with Parallax */}
            <ParallaxElement speed={0.5}>
              <div className="absolute top-20 right-10 hidden lg:block">
                <FloatingElement amplitude={15} frequency={3} delay={0.5}>
                  <AnimatedCube size={60} rotationSpeed={15} className="opacity-30" />
                </FloatingElement>
              </div>
            </ParallaxElement>
            <ParallaxElement speed={0.3}>
              <div className="absolute top-40 left-10 hidden lg:block">
                <FloatingElement amplitude={20} frequency={4} delay={1}>
                  <AnimatedCube size={40} rotationSpeed={12} className="opacity-20" />
                </FloatingElement>
              </div>
            </ParallaxElement>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Personal Branding & Storytelling */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative z-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Story */}
            <div className="space-y-8">
              <ScrollReveal>
                <div className="relative">
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-none mb-6">
                    <ShimmerText className="bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      About Me
                    </ShimmerText>
                  </h2>
                  <div className="absolute -top-8 -left-8 text-8xl sm:text-9xl font-black text-slate-100 -z-10 select-none">
                    STORY
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal>
                <div className="space-y-6 text-lg sm:text-xl text-slate-700 leading-relaxed">
                  <p className="font-medium">
                    I'm a <span className="font-bold text-blue-600">Creative Technologist</span> who bridges the gap between 
                    <span className="font-bold text-purple-600">artistic vision</span> and 
                    <span className="font-bold text-green-600">technical innovation</span>.
                  </p>
                  
                  <p>
                    With a background spanning <strong>video production</strong>, <strong>AI development</strong>, and 
                    <strong>full-stack engineering</strong>, I create solutions that are both 
                    <em>technically sophisticated</em> and <em>visually compelling</em>.
                  </p>
                  
                  <p>
                    From building <strong>multi-agent AI systems</strong> to producing 
                    <strong>award-winning video content</strong>, I thrive at the intersection of 
                    <span className="text-blue-600 font-semibold">creativity</span> and 
                    <span className="text-purple-600 font-semibold">code</span>.
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal>
                <div className="flex flex-wrap gap-3">
                  {['AI Systems', 'Video Production', 'Full-Stack Dev', 'Creative Tech', 'Automation'].map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            
            {/* Right Column - Visual Elements */}
            <div className="relative">
              <ScrollReveal>
                <div className="relative">
                  {/* Main Card */}
                  <GlassCard className="p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl font-black text-white">JK</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Jeffrey Kerr</h3>
                        <p className="text-slate-600 font-medium">Creative Technologist</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-black text-blue-600">5+</div>
                          <div className="text-sm text-slate-600">Years Experience</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-black text-purple-600">50+</div>
                          <div className="text-sm text-slate-600">Projects Completed</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-black text-green-600">AI</div>
                          <div className="text-sm text-slate-600">Specialist</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-black text-orange-600">24/7</div>
                          <div className="text-sm text-slate-600">Innovation</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                  
                  {/* Background Elements */}
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-50 -z-10"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-50 -z-10"></div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - Enhanced Typography */}
        <section className="py-24 border-t border-slate-200 overflow-hidden relative z-20 bg-gradient-to-br from-white via-slate-50 to-blue-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <ScrollReveal>
               <div className="relative mb-8">
                 <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-none">
                   <ShimmerText className="bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                     Skills & Expertise
                   </ShimmerText>
                 </h2>
                 <div className="absolute -top-6 -right-6 text-7xl sm:text-8xl lg:text-9xl font-black text-slate-100 -z-10 select-none opacity-60">
                   SKILLS
                 </div>
               </div>
             </ScrollReveal>
             <ScrollReveal>
               <p className="text-xl sm:text-2xl text-slate-600 font-medium max-w-3xl mx-auto mb-8">
                 Cutting-edge technologies and methodologies that power 
                 <span className="font-bold text-blue-600">next-generation solutions</span>
               </p>
             </ScrollReveal>
           </div>
           <TechMarquee />
           
           {/* 3D Skill Cards */}
           <ScrollReveal>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
             <Card3D className="h-full">
               <GlassCard className="p-6 h-full">
                 <div className="flex items-center mb-4">
                   <Brain className="w-8 h-8 text-blue-500 mr-3" />
                   <h3 className="text-lg font-semibold text-slate-800 mb-3">AI & Machine Learning</h3>
                 </div>
                 <p className="text-slate-600">Multi-agent systems, automation, and intelligent solutions</p>
               </GlassCard>
             </Card3D>
             
             <Card3D className="h-full">
               <GlassCard className="p-6 h-full">
                 <div className="flex items-center mb-4">
                   <Code className="w-8 h-8 text-purple-500 mr-3" />
                   <h3 className="text-lg font-semibold text-slate-800 mb-3">Full-Stack Development</h3>
                 </div>
                 <p className="text-slate-600">Modern web technologies and scalable architectures</p>
               </GlassCard>
             </Card3D>
             
             <Card3D className="h-full">
               <GlassCard className="p-6 h-full">
                 <div className="flex items-center mb-4">
                   <Rocket className="w-8 h-8 text-green-500 mr-3" />
                   <h3 className="text-lg font-semibold text-slate-800 mb-3">Creative Technology</h3>
                 </div>
                 <p className="text-slate-600">Video production, AI content generation, and innovation</p>
               </GlassCard>
             </Card3D>
           </div>
           </ScrollReveal>
         </div>
       </section>

       {/* Portfolio Section - Redesigned */}
       <section id="portfolio" className="py-32 px-4 sm:px-6 lg:px-8 relative z-20 bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden">
         <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
             <ScrollReveal>
               <div className="relative mb-12">
                 <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none">
                   <ShimmerText className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                     PORTFOLIO
                   </ShimmerText>
                 </h2>
                 <div className="absolute -top-8 -left-8 text-8xl sm:text-9xl lg:text-[12rem] font-black text-white/5 -z-10 select-none">
                   WORK
                 </div>
               </div>
             </ScrollReveal>
             <ScrollReveal>
               <p className="text-2xl sm:text-3xl text-slate-300 font-light max-w-4xl mx-auto leading-relaxed">
                 Where <span className="font-bold text-blue-400">innovation meets execution</span> — 
                 from traditional craftsmanship to <span className="font-bold text-purple-400">AI-powered creation</span>
               </p>
             </ScrollReveal>
           </div>

           {/* Video Production Section */}
           <div className="mb-24">
             <ScrollReveal>
               <div className="mb-16">
                 <h3 className="text-4xl sm:text-5xl font-black text-white mb-4">
                   VIDEO <span className="text-blue-400">PRODUCTION</span>
                 </h3>
                 <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mb-6"></div>
                 <p className="text-xl text-slate-300 max-w-2xl">
                   Cinematic storytelling with professional-grade production values
                 </p>
               </div>
             </ScrollReveal>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <h4 className="text-2xl font-bold text-white mb-4">Commercial Production</h4>
                     <p className="text-slate-300 mb-6 leading-relaxed">High-quality commercial video production with professional cinematography and post-production workflows.</p>
                     <div className="flex flex-wrap gap-2">
                       {["Cinematography", "Editing", "Color Grading", "Motion Graphics"].map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <h4 className="text-2xl font-bold text-white mb-4">Documentary Work</h4>
                     <p className="text-slate-300 mb-6 leading-relaxed">Compelling documentary storytelling with advanced interview techniques and narrative structure.</p>
                     <div className="flex flex-wrap gap-2">
                       {["Storytelling", "Interviews", "Sound Design", "Final Cut Pro"].map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <h4 className="text-2xl font-bold text-white mb-4">Event Coverage</h4>
                     <p className="text-slate-300 mb-6 leading-relaxed">Dynamic event videography capturing key moments with multi-camera setups and live streaming capabilities.</p>
                     <div className="flex flex-wrap gap-2">
                       {["Multi-cam", "Live Streaming", "Event Production", "Drone Footage"].map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
             </div>
           </div>

           {/* AI Video Generation Section */}
           <div className="mb-24">
             <ScrollReveal>
               <div className="mb-16">
                 <h3 className="text-4xl sm:text-5xl font-black text-white mb-4">
                   AI <span className="text-purple-400">VIDEO GENERATION</span>
                 </h3>
                 <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mb-6"></div>
                 <p className="text-xl text-slate-300 max-w-2xl">
                   Next-generation content creation powered by artificial intelligence
                 </p>
               </div>
             </ScrollReveal>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-10 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <h4 className="text-3xl font-bold text-white mb-6">AI-Powered Content Creation</h4>
                     <p className="text-slate-300 mb-8 text-lg leading-relaxed">Leveraging cutting-edge AI tools for automated video generation, style transfer, and content enhancement.</p>
                     <div className="flex flex-wrap gap-3">
                       {["RunwayML", "Stable Video", "AI Workflows", "Automation"].map((tech) => (
                         <span key={tech} className="px-4 py-2 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-10 hover:border-pink-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <h4 className="text-3xl font-bold text-white mb-6">Synthetic Media Production</h4>
                     <p className="text-slate-300 mb-8 text-lg leading-relaxed">Creating realistic synthetic media using advanced AI models for creative and commercial applications.</p>
                     <div className="flex flex-wrap gap-3">
                       {["Deep Learning", "Neural Networks", "Synthetic Media", "Ethics"].map((tech) => (
                         <span key={tech} className="px-4 py-2 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
             </div>
           </div>

           {/* AI & Coding Projects Section */}
           <div>
             <ScrollReveal>
               <div className="mb-16">
                 <h3 className="text-4xl sm:text-5xl font-black text-white mb-4">
                   AI & <span className="text-green-400">CODING PROJECTS</span>
                 </h3>
                 <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mb-6"></div>
                 <p className="text-xl text-slate-300 max-w-2xl">
                   Intelligent systems and full-stack solutions that push technological boundaries
                 </p>
               </div>
             </ScrollReveal>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <div className="flex items-center mb-6">
                       <Brain className="w-12 h-12 text-green-400 mr-4" />
                       <h4 className="text-2xl font-bold text-white">Multi-Agent AI Systems</h4>
                     </div>
                     <p className="text-slate-300 mb-6 text-lg leading-relaxed">Building sophisticated AI systems with multiple autonomous agents working in coordination.</p>
                     <div className="flex flex-wrap gap-2">
                       {["Python", "TensorFlow", "Multi-Agent", "Coordination"].map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <div className="flex items-center mb-6">
                       <Zap className="w-12 h-12 text-blue-400 mr-4" />
                       <h4 className="text-2xl font-bold text-white">Advanced Automation</h4>
                     </div>
                     <p className="text-slate-300 mb-6 text-lg leading-relaxed">Creating intelligent automation solutions that streamline complex workflows and processes.</p>
                     <div className="flex flex-wrap gap-2">
                       {["Automation", "Workflows", "APIs", "Integration"].map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <div className="flex items-center mb-6">
                       <Code className="w-12 h-12 text-purple-400 mr-4" />
                       <h4 className="text-2xl font-bold text-white">Full-Stack Development</h4>
                     </div>
                     <p className="text-slate-300 mb-6 text-lg leading-relaxed">End-to-end web application development with modern frameworks and cutting-edge technologies.</p>
                     <div className="flex flex-wrap gap-2">
                       {["React", "Next.js", "Node.js", "TypeScript"].map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal>
                 <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <div className="flex items-center mb-6">
                       <Rocket className="w-12 h-12 text-orange-400 mr-4" />
                       <h4 className="text-2xl font-bold text-white">AI Integration</h4>
                     </div>
                     <p className="text-slate-300 mb-6 text-lg leading-relaxed">Seamlessly integrating AI capabilities into existing systems and creating new AI-powered applications.</p>
                     <div className="flex flex-wrap gap-2">
                       {["AI APIs", "Machine Learning", "Integration", "Deployment"].map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               </ScrollReveal>
             </div>
           </div>
         </div>
       </section>

       {/* Contact Section */}
        <section id="contact" className="py-20 relative z-20">
          <GlassyBackdrop className="absolute inset-0">
            <div></div>
          </GlassyBackdrop>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <ScrollReveal>
             <h2 className="text-3xl sm:text-4xl font-bold mb-8">
               <Text3D className="text-slate-900">
                 Let's Create Something Amazing
               </Text3D>
             </h2>
           </ScrollReveal>
           <ScrollReveal>
             <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
               Ready to bring your vision to life? Let's collaborate on your next project.
             </p>
           </ScrollReveal>
           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <GlassButton variant="primary" size="lg" className="px-8 py-3 text-lg">
               <span className="flex items-center">
                 <Mail className="w-5 h-5 mr-2" />
                 Start a Project
               </span>
             </GlassButton>
             <GlassButton variant="secondary" size="lg" className="px-8 py-3 text-lg">
               <span className="flex items-center">
                 <Download className="w-5 h-5 mr-2" />
                 Download Resume
               </span>
             </GlassButton>
           </div>
         </div>
       </section>
     </div>
  );
}

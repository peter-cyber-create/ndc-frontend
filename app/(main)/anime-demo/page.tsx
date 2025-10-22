'use client'

import React, { useState } from 'react'
import { AnimatedInput } from '@/components/ui/animated-input'
import { AnimatedTextarea } from '@/components/ui/animated-textarea'
import { AnimatedButton } from '@/components/ui/animated-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Eye, Cpu, Sparkles, Target, Shield } from 'lucide-react'

export default function AnimeDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-16 px-4">
      {/* HUD Overlay Background */}
      <div className="fixed inset-0 pointer-events-none cyber-grid opacity-20" />
      
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <div className="flex justify-center mb-8">
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-80 animate-energy-pulse" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-up">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cyber-Health
          </span>
          <br />
          <span className="text-3xl md:text-5xl text-gray-300">
            Anime Aesthetic Demo
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
          Experience the future of form interactions with our anime-inspired UI components. 
          Every interaction feels responsive, futuristic, and deliberate.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Demo Form */}
        <Card className="bg-white/10 backdrop-blur-md border-cyan-400/30 shadow-2xl hud-overlay">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap className="h-6 w-6 text-cyan-400 animate-pulse" />
              Interactive Form Demo
            </CardTitle>
            <CardDescription className="text-gray-300">
              Try out the animated form components with glitch effects and floating labels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6">
              <AnimatedInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                label="Full Name *"
                glitchEffect={true}
                typingEffect={true}
                className="text-white"
                placeholder="Enter your full name"
              />

              <AnimatedInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                label="Email Address *"
                glitchEffect={true}
                typingEffect={true}
                className="text-white"
                placeholder="Enter your email address"
              />

              <AnimatedInput
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                glitchEffect={true}
                className="text-white"
                placeholder="Select a category"
              />

              <AnimatedTextarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                label="Message *"
                glitchEffect={true}
                typingEffect={true}
                className="text-white"
                placeholder="Tell us about your experience"
                rows={4}
              />

              <div className="flex gap-4">
                <AnimatedButton
                  variant="energy"
                  size="lg"
                  energyCharge={true}
                  explosionEffect={true}
                  className="flex-1"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Submit with Energy
                </AnimatedButton>
                
                <AnimatedButton
                  variant="cyber"
                  size="lg"
                  energyCharge={true}
                  explosionEffect={true}
                  className="flex-1"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Cyber Submit
                </AnimatedButton>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features Showcase */}
        <div className="space-y-8">
          <Card className="bg-white/10 backdrop-blur-md border-cyan-400/30 shadow-2xl hud-overlay">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Eye className="h-6 w-6 text-cyan-400 animate-pulse" />
                Visual Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="font-medium">Underline Glow Effect</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-150" />
                  <span className="font-medium">Floating Label Animation</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-300" />
                  <span className="font-medium">Glitch & Typing Effects</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-450" />
                  <span className="font-medium">Energy Charge Animation</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-600" />
                  <span className="font-medium">Explosion Effects</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-cyan-400/30 shadow-2xl hud-overlay">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Cpu className="h-6 w-6 text-cyan-400 animate-pulse" />
                Technical Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="font-medium">High Velocity Transitions (150ms)</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-150" />
                  <span className="font-medium">HUD Overlay Elements</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-300" />
                  <span className="font-medium">Focus Lines & Speed Lines</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-450" />
                  <span className="font-medium">Cyber Grid Backgrounds</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-600" />
                  <span className="font-medium">Sci-Fi Glow Effects</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-cyan-400/30 shadow-2xl hud-overlay">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
                Animation Showcase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-400/30 hover:animate-energy-pulse transition-all duration-300">
                  <div className="text-cyan-300 font-medium text-sm">Energy Pulse</div>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-400/30 hover:animate-glitch transition-all duration-300">
                  <div className="text-purple-300 font-medium text-sm">Glitch Effect</div>
                </div>
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30 hover:animate-explosion transition-all duration-300">
                  <div className="text-blue-300 font-medium text-sm">Explosion</div>
                </div>
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-400/30 hover:animate-shake transition-all duration-300">
                  <div className="text-green-300 font-medium text-sm">Shake Effect</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-80 animate-energy-pulse" />
        </div>
        <p className="text-gray-400 text-lg">
          Experience the future of web interactions with our anime-inspired UI components
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <AnimatedButton
            variant="energy"
            size="lg"
            energyCharge={true}
            explosionEffect={true}
            onClick={() => window.history.back()}
          >
            Go Back
          </AnimatedButton>
        </div>
      </div>
    </div>
  )
}


'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/animated-section'
import { useState, useEffect, useLayoutEffect } from 'react'
import { GradientText } from '@/components/gradient-text'
import { HoverCard } from '@/components/hover-card'
import { LoadingScreen } from '@/components/loading-screen'
import { Dashboard } from '@/components/dashboard'
import { Header } from '@/components/Header'
import { useTheme } from "next-themes";



export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false); // State to handle hydration

  const { theme } = useTheme(); 

  // useLayoutEffect for fixing hydration error
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  if (!mounted) return null; // Ensure the content renders after hydration

  return (
    <div className="flex min-h-screen flex-col">
      <LoadingScreen />
      <div
  className="pointer-events-none fixed z-[999] h-3 w-3 rounded-full transition-transform duration-200 ease-out hidden sm:block"
  style={{
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#df1f21'
  }}
/>
<div
  className="pointer-events-none fixed z-[998] h-8 w-8 rounded-full border transition-transform duration-300 ease-out hidden sm:block"
  style={{
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    transform: 'translate(-50%, -50%)',
    borderColor: '#df1f21'
  }}
/>


      {/* Header - Floating style */}
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <AnimatedSection className="relative min-h-[90vh] flex items-center bg-background">
          <div className="container relative z-10 mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl opacity-20 rounded-full" />
                <Image
  src="/aistr.jpeg"
  alt="AI Trading"
  width={530}
  height={530}
  className="relative rounded-3xl"
  priority
  style={
    theme === "dark"
      ? {
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)"
        }
      : {}
  }
/>


              </div>
              <div className="space-y-6">
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-1 flex items-center gap-2 w-fit border-gray-100"
                >
                  <Image
                    src="/daos.png"
                    alt="DAOS"
                    width={14}
                    height={14}
                  />
                  Built on daos.world
                </Badge>
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mt-8">
                  <GradientText>AI-Powered Investment Strategy</GradientText>
                </h1>
                <p className="text-lg text-muted-foreground max-w-[90%] mt-6">
                  AicroStrategy ($AiSTR) revolutionizes investment through autonomous AI agents, delivering unparalleled trading strategies on Base.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    size="lg"
                    className="rounded-full"
                    asChild
                  >
                    <Link
                      href="https://daos.world/fund/0xddc23d34ea2f6920d15995607d00def9478ded6d"
                      target="_blank"
                    >
                      Buy $AiSTR
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full"
                    asChild
                  >
                    <Link
                      href="https://debank.com/profile/0xddc23d34ea2f6920d15995607d00def9478ded6d"
                      target="_blank"
                    >
                      Portfolio
                      <ChevronRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full"
                    asChild
                  >
                    <Link
                      href="https://docs.aicrostrategy.com"
                      target="_blank"
                    >
                      Docs
                      <ChevronRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>


        {/* Features Section */}
        <AnimatedSection className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
              <GradientText>Core Features</GradientText></h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <h3 className="text-xl font-bold">AI-Powered Strategies</h3>
                <p className="mt-2 text-muted-foreground">
                  Advanced AI algorithms to analyze market conditions and determine the optimal strategy.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold">Strategic Accumulation</h3>
                <p className="mt-2 text-muted-foreground">
                  Systematic approach to growing our treasury with cbBTC.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold">Risk Management</h3>
                <p className="mt-2 text-muted-foreground">
                  Multi-layered security protocols and dynamic position sizing to protect our holdings.
                </p>
              </Card>
            </div>
          </div>
        </AnimatedSection>

        {/* Strategy Section */}
        <AnimatedSection className="py-24 border-t">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <GradientText>Our Strategy</GradientText>
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Leveraging advanced AI technology to maximize cbBTC accumulation and optimize Bitcoin yields
            </p>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <Card className="p-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Technical Infrastructure</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Leveraged Bitcoin Strategy</h4>
                      <p className="text-muted-foreground">
                        Utilizing cbBTC on Base for optimized Bitcoin exposure and strategic accumulation
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Accumulation Strategy</h4>
                      <p className="text-muted-foreground">
                        Systematic approach to growing our cbBTC holdings through market-aware positioning
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">AI Infrastructure</h4>
                      <p className="text-muted-foreground">
                        Built on cutting-edge AI infrastructure to optimize trading strategies and market analysis in real-time
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">
                    Key Benefits
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <svg
                          className="h-6 w-6 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">Strategic Accumulation</h4>
                        <p className="text-muted-foreground">
                          Focused approach to maximize cbBTC holdings through market opportunities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <svg
                          className="h-6 w-6 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">Security</h4>
                        <p className="text-muted-foreground">
                          Strong risk management protocols ensuring the safety of our assets
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <svg
                          className="h-6 w-6 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 11V6h4v5h5v4h-5v5h-4v-5h-5v-4h5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">Automation</h4>
                        <p className="text-muted-foreground">
                          24/7 operation with automated execution of strategies to capture real-time market opportunities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </AnimatedSection>

        {/* Community Section */}
        <AnimatedSection className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
              <GradientText>Join the Community</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground">
              Engage with other members of the AicroStrategy community and stay informed about the latest developments in AI-powered investment.
            </p>
          </div>
        </AnimatedSection>

        {/* Call to Action Section */}
        <AnimatedSection className="py-24 pb-36 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Be part of the revolution</h2>
              <Button
                size="lg"
                className="rounded-full"
                asChild
              >
                <Link
                  href="https://daos.world/fund/0xddc23d34ea2f6920d15995607d00def9478ded6d"
                  target="_blank"
                >
                  Get Started
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center text-muted-foreground">
            &copy; 2025 AicroStrategy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

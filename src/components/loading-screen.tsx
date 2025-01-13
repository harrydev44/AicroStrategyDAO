'use client'

import { useState, useEffect, useCallback } from 'react'
import { GradientText } from '@/components/gradient-text'
import { Sparkle } from 'lucide-react'

export function LoadingScreen() {
  const [show, setShow] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSkip = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShow(false)
    }, 800) // Match this with the CSS transition duration
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSkip()
    }, 4000)

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        clearTimeout(timer)
        handleSkip()
      }
    }

    const handleMouseClick = (event: MouseEvent) => {
      clearTimeout(timer)
      handleSkip()
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('click', handleMouseClick)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('click', handleMouseClick)
    }
  }, [handleSkip])

  if (!show) return null

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black transition-opacity duration-800 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-8 relative">
        {/* Animated lines with glow effect */}
        <div className="absolute inset-0 flex justify-around -rotate-12 opacity-20 blur-[0.5px]">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i}
              className="w-[1px] bg-gradient-to-b from-transparent via-[#df1f21] to-transparent"
              style={{
                height: '160%',
                transform: `translateY(${-50 + i * 15}%)`,
                animation: `slideUp ${4 + i * 0.3}s linear infinite`,
                opacity: 0.7 - (i * 0.1)
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center gap-8">
          {/* Logo or text with subtle shadow */}
          <h1 className="relative z-10 text-3xl md:text-5xl font-bold typewriter drop-shadow-sm">
            <GradientText>Vires in Numeris</GradientText>
          </h1>

          {/* Enhanced rotating rings with loader */}
          <div className="rotating-text relative">
            <div className="absolute -inset-12 rounded-full border border-[#df1f21] opacity-20 blur-[0.3px]" />
            <div className="absolute -inset-16 rounded-full border border-[#df1f21] opacity-10 blur-[0.3px]" />
            <div className="absolute -inset-20 rounded-full border border-[#df1f21] opacity-5 blur-[0.3px]" />
            <div className="loader-enhanced" />
          </div>
        </div>
      </div>
    </div>
  )
}

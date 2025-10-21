'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  
  // Only use white text on homepage when not scrolled, black everywhere else by default
  const isHomepage = pathname === '/'
  // Always use a visible background and dark text on homepage for contrast
  const shouldUseWhiteText = false
  const shouldUseBlackText = true

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Agenda', href: '/agenda' },
    { name: 'Partners', href: '/partners' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Exhibitors', href: '/exhibitors' },
    { name: 'Pre-Conference', href: '/pre-conference' },
    { name: 'Register', href: '/register' },
    { name: 'Abstracts', href: '/abstracts' },
    { name: 'Contact', href: '/contact' },
  ]

  // Handle scroll for floating navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      {/* Uganda Flag Stripe */}
      <div className="fixed top-0 left-0 right-0 z-50 h-4 flex flex-col">
        <div className="h-1.5 bg-uganda-black"></div>
        <div className="h-1.5 bg-uganda-yellow"></div>
        <div className="h-1 bg-uganda-red"></div>
      </div>
      
      <nav className={
        `sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 transition-all duration-300 py-3 px-4 sm:px-6`
      }>
      <div className="flex justify-between items-center w-full min-h-[3.5rem] sm:min-h-[4.5rem]">
        <div className="flex items-center flex-shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
              <img 
                src="/images/uganda-coat-of-arms.png" 
                alt="Uganda Coat of Arms" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`font-bold text-xs sm:text-sm lg:text-base xl:text-lg leading-tight transition-colors ${shouldUseWhiteText ? 'text-white' : 'text-gray-900'}`}>
                <span className="block">NACNDC & JASH</span>
                <span className="block">Conference <span className="font-extrabold">2025</span></span>
              </span>
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium transition-colors ${shouldUseWhiteText ? 'text-primary-200' : 'text-gray-600'}`}>
                Ministry of Health Uganda
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Main Navigation Links */}
            {navigation.slice(0, 8).map((item, index) => (
              <React.Fragment key={item.name}>
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105 ring-2 ring-primary-400 font-semibold' 
                      : 'text-gray-900 hover:shadow-md'
                  }`}
                >
                  {item.name}
                </Link>
                {/* Separator after About */}
                {item.name === 'About' && (
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Priority CTAs - Always visible */}
          <div className="hidden lg:flex items-center space-x-3 ml-4">
            <Link
              href="/register"
              className="btn-primary text-sm px-4 py-2 min-h-[40px]"
            >
              Register Now
            </Link>
            <Link
              href="/abstracts"
              className="btn-secondary text-sm px-4 py-2 min-h-[40px]"
            >
              Submit Abstract
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-3 rounded-lg transition-colors touch-target ${
              shouldUseWhiteText ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            {/* Mobile menu */}
            <div className="lg:hidden absolute left-0 right-0 top-full mt-2 mx-2 sm:mx-4 bg-white rounded-xl shadow-2xl z-50 border-2 border-primary-200 max-h-[85vh] overflow-y-auto">
              <div className="p-3 sm:p-4 space-y-1">
                {/* Priority CTAs - Mobile */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2 px-3">
                    Quick Actions
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/register"
                      className="btn-primary text-sm px-4 py-3 min-h-[48px] justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Register Now
                    </Link>
                    <Link
                      href="/abstracts"
                      className="btn-secondary text-sm px-4 py-3 min-h-[48px] justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Submit Abstract
                    </Link>
                  </div>
                </div>

                {/* Main Navigation */}
                <div className="space-y-1 mb-3">
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2 px-3">
                    Navigation
                  </div>
                  {navigation.slice(0, 8).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                        pathname === item.href
                          ? 'bg-primary-600 text-white shadow-lg border-l-4 border-primary-400'
                          : 'bg-primary-50 text-primary-800 hover:bg-primary-100 hover:text-primary-900 border-l-4 border-transparent hover:border-primary-300'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
    </>
  )
}

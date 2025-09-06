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
    { name: 'Abstracts', href: '/abstracts' },
    { name: 'Partners', href: '/partners' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Exhibitors', href: '/exhibitors' },
    { name: 'Contact', href: '/contact' },
  ]

  const formLinks = [
    { name: 'Submit Abstract', href: '/abstracts', type: 'abstract', icon: '📝' },
    { name: 'Become a Sponsor', href: '/sponsors', type: 'sponsor', icon: '🤝' },
    { name: 'Register Now', href: '/register', type: 'payment', icon: '🎫' },
  ]

  const actionItems = [
    { name: 'Become a Sponsor', href: '/sponsors', type: 'sponsor', icon: '🤝' },
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
        `floating-nav bg-white sm:bg-white/80 shadow-md sm:backdrop-blur-md border-b border-primary-200 fixed top-[12px] sm:top-[32px] left-0 sm:left-1/2 sm:-translate-x-1/2 rounded-none sm:rounded-2xl max-w-full sm:max-w-[98vw] lg:max-w-[1600px] w-full mx-auto z-40 transition-all duration-300 py-3 sm:py-2 px-0 sm:px-6`
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
            {/* Main Navigation Links with special separator after About */}
            {navigation.map((item, index) => (
              <React.Fragment key={item.name}>
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105 ring-2 ring-primary-400 font-semibold' 
                      : shouldUseBlackText 
                        ? 'text-gray-900 hover:shadow-md' 
                        : 'text-primary-100'
                  }`}
                >
                  {item.name}
                </Link>
                {/* Special separator after About */}
                {item.name === 'About' && (
                  <div className="h-6 w-px bg-gradient-to-b from-primary-300 to-primary-500 mx-2" />
                )}
                {/* Special separator between Contact and Exhibitors */}
                {item.name === 'Contact' && (
                  <div className="h-6 w-px bg-gradient-to-b from-primary-300 to-primary-500 mx-2" />
                )}
                {/* Regular separators for other nav links except the last one */}
                {item.name !== 'About' && item.name !== 'Contact' && index < navigation.length - 1 && (
                  <div className="h-6 w-px bg-primary-300 mx-1" />
                )}
              </React.Fragment>
            ))}
            
            {/* Main Separator before Form Links */}
            <div className="h-6 w-px bg-gradient-to-b from-primary-400 to-primary-600 mx-3" />
            
            {/* Form Links - compact styling */}
            <div className="flex items-center space-x-2 pr-2">
              {formLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 text-xs shadow-lg hover:shadow-xl min-w-[110px] h-10 text-center ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white ring-2 ring-primary-400 shadow-xl scale-105' 
                      : 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 hover:from-primary-200 hover:to-primary-300 border border-primary-300 hover:border-primary-400 focus:ring-primary-400'
                  }`}
                >
                  <span className="text-xs font-semibold">{item.name}</span>
                </Link>
              ))}
            </div>
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
                {/* Main Navigation */}
                <div className="space-y-1 mb-3">
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2 px-3">
                    Navigation
                  </div>
                  {navigation.map((item) => (
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

                {/* Form Links */}
                <div className="space-y-2 pt-3 border-t border-primary-200">
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2 px-3">
                    Quick Actions
                  </div>
                  {formLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative block px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 text-sm shadow-lg border h-12 flex items-center justify-center ${
                        pathname === item.href
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white border-primary-600 shadow-xl'
                          : 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 hover:from-primary-200 hover:to-primary-300 border-primary-300 hover:border-primary-400'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-sm font-semibold">{item.name}</span>
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

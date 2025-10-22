'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { User, Award, Building, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const speakers = [
  {
    id: 1,
    name: "Prof. Francis Omaswa",
    title: "Guest of Honor",
    organization: "NACNDC & JASH Conference 2025",
    image: "/images/speakers/Prof Omaswa 2.jpg"
  },
  {
    id: 2,
    name: "Dr. Jane Ruth Aceng Ocero",
    title: "Minister of Health",
    organization: "Ministry of Health Uganda",
    image: "/images/speakers/ruth.jpeg"
  },
  {
    id: 3,
    name: "Dr. Diana Atwine",
    title: "Permanent Secretary",
    organization: "Ministry of Health Uganda",
    image: "/images/speakers/diana.jpeg"
  },
  {
    id: 4,
    name: "Dr. Charles Olaro",
    title: "Director General",
    organization: "Ministry of Health Uganda",
    image: "/images/speakers/charles.jpeg"
  },
  {
    id: 5,
    name: "Dr. Queen Dube",
    title: "Keynote Speaker - Opening Ceremony",
    organization: "NACNDC & JASH Conference 2025",
    image: "/images/speakers/Dr. Queen Dube .jpeg"
  },
  {
    id: 6,
    name: "Dr. Alex Riolexus Ario",
    title: "Associate Professor of Infectious Disease Epidemiology",
    organization: "Uganda National Institute of Public Health",
    image: "/images/speakers/Dr. Alex Riolexus Ario.jpg"
  },
  {
    id: 7,
    name: "Dr. Kazoora Wilson",
    title: "Clinical Mentor & Quality Improvement Manager",
    organization: "AIDS Healthcare Foundation (AHF) Uganda Cares",
    image: "/images/speakers/Dr. Kazoora Wilson.jpeg"
  }
]

export default function SpeakersSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % speakers.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + speakers.length) % speakers.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % speakers.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Slideshow Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {speakers.map((speaker) => (
            <div key={speaker.id} className="w-full flex-shrink-0">
              <div className="flex flex-col md:flex-row items-center p-8">
                {/* Speaker Image */}
                <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="relative">
                    {speaker.image ? (
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-blue-200 shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-200 shadow-xl">
                        <User className="h-16 w-16 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Speaker Info */}
                <div className="w-full md:w-2/3 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                  <p className="text-blue-600 font-semibold text-lg mb-2">{speaker.title}</p>
                  <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                    <Building className="h-5 w-5 mr-2" />
                    <span className="text-sm">{speaker.organization}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                    {speaker.title.includes('Keynote') && 'Distinguished keynote speaker for the opening ceremony of the NACNDC & JASH Conference 2025.'}
                    {speaker.title.includes('Guest Speaker') && 'Renowned guest speaker presenting on the final day of the conference.'}
                    {speaker.title.includes('Session Chair') && 'Session Chair for Track Health Policy, Financing and Partnerships.'}
                    {speaker.title.includes('Minister') && 'Leading Uganda\'s health sector transformation with focus on universal health coverage.'}
                    {speaker.title.includes('Permanent Secretary') && 'Championing health policy reforms and healthcare delivery improvements in Uganda.'}
                    {speaker.title.includes('Director General') && 'Leading public health initiatives and health system strengthening across Uganda.'}
                    {speaker.title.includes('Associate Professor') && 'Medical Doctor and Public Health Specialist with extensive experience in infectious disease epidemiology.'}
                    {speaker.title.includes('Clinical Mentor') && 'Medical Doctor with extensive experience in HIV prevention, care, and treatment.'}
                    {!speaker.title.includes('Keynote') && !speaker.title.includes('Guest Speaker') && !speaker.title.includes('Session Chair') && !speaker.title.includes('Minister') && !speaker.title.includes('Permanent Secretary') && !speaker.title.includes('Director General') && !speaker.title.includes('Associate Professor') && !speaker.title.includes('Clinical Mentor') && 'Distinguished speaker bringing expertise and insights to the NACNDC & JASH Conference 2025.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          size="sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          size="sm"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {speakers.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}


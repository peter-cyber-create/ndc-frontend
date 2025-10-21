'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { User, Award, Building, ExternalLink, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

const speakers = [
  {
    id: 1,
    name: "Dr. Charles Olaro",
    title: "Minister of Health",
    organization: "Ministry of Health Uganda",
    bio: "Leading Uganda's health sector transformation with focus on universal health coverage and health system strengthening.",
    image: "/images/charles.jpeg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 2,
    name: "Dr. Diana Atwine",
    title: "Permanent Secretary",
    organization: "Ministry of Health Uganda",
    bio: "Championing health policy reforms and healthcare delivery improvements in Uganda.",
    image: "/images/diana.jpeg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 3,
    name: "Dr. Jane Ruth Aceng Ocero",
    title: "Director General",
    organization: "Ministry of Health Uganda",
    bio: "Leading public health initiatives and health system strengthening across Uganda's healthcare facilities.",
    image: "/images/ruth.jpeg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 4,
    name: "Prof. Moses Kamya",
    title: "Principal",
    organization: "Makerere University College of Health Sciences",
    bio: "Leading researcher in infectious diseases and advocate for evidence-based health interventions in Uganda.",
    image: "/images/speakers/prof-moses-kamya.jpg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 5,
    name: "Dr. Christine Munduru",
    title: "Director General",
    organization: "Uganda National Health Laboratory Services",
    bio: "Pioneer in laboratory systems strengthening and quality assurance for health diagnostics in Uganda.",
    image: "/images/speakers/dr-christine-munduru.jpg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 6,
    name: "Dr. Sarah Opendi",
    title: "Former State Minister",
    organization: "Ministry of Health Uganda",
    bio: "Experienced health policy maker and advocate for women's health and reproductive rights in Uganda.",
    image: "/images/speakers/dr-sarah-opendi.jpg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 7,
    name: "Prof. Pontiano Kaleebu",
    title: "Director",
    organization: "Uganda Virus Research Institute",
    bio: "Leading virologist and researcher in infectious diseases, particularly HIV/AIDS and emerging viral threats.",
    image: "/images/speakers/prof-pontiano-kaleebu.jpg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 8,
    name: "Dr. Rhoda Wanyenze",
    title: "Dean",
    organization: "Makerere University School of Public Health",
    bio: "Public health expert and advocate for health equity and gender-responsive health systems in Uganda.",
    image: "/images/speakers/dr-rhoda-wanyenze.jpg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  }
]

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conference Speakers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the distinguished speakers and thought leaders who will share their expertise and insights at the NACNDC & JASH Conference 2025.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {speakers.map((speaker, index) => (
            <ScrollReveal key={speaker.id} delay={index * 150} direction="up">
              <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden hover:border-blue-200">
                <CardContent className="p-0">
                  {/* Speaker Image */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-500">
                    {speaker.image && !speaker.image.includes('speakers/') ? (
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                          <Award className="h-3 w-3" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg group-hover:bg-blue-300 transition-colors duration-500">
                        <User className="h-16 w-16 text-blue-600 group-hover:text-blue-700 transition-colors duration-500" />
                      </div>
                    )}
                  </div>

                  {/* Speaker Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{speaker.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm mb-2">{speaker.title}</p>
                    <div className="flex items-center justify-center text-gray-600 mb-4">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="text-sm">{speaker.organization}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-white border-0 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Want to be a Speaker?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're always looking for passionate health professionals to share their knowledge and experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/abstracts">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Submit Abstract
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Link href="/contact">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
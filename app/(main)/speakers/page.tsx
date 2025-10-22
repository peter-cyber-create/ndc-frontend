'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { User, Award, Building, ExternalLink, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

const speakers = [
  {
    id: 2,
    name: "Dr. Jane Ruth Aceng Ocero",
    title: "Minister of Health",
    organization: "Ministry of Health Uganda",
    bio: "Leading Uganda's health sector transformation with focus on universal health coverage and health system strengthening. Dr. Aceng has been instrumental in driving health policy reforms and improving healthcare delivery across Uganda.",
    image: "/images/speakers/ruth.jpeg"
  },
  {
    id: 3,
    name: "Dr. Diana Atwine",
    title: "Permanent Secretary",
    organization: "Ministry of Health Uganda",
    bio: "Championing health policy reforms and healthcare delivery improvements in Uganda. Dr. Atwine plays a crucial role in implementing health sector strategies and ensuring effective health service delivery.",
    image: "/images/speakers/diana.jpeg"
  },
  {
    id: 4,
    name: "Dr. Charles Olaro",
    title: "Director General",
    organization: "Ministry of Health Uganda",
    bio: "Leading public health initiatives and health system strengthening across Uganda's healthcare facilities. Dr. Olaro oversees the implementation of public health programs and health system reforms.",
    image: "/images/speakers/charles.jpeg"
  },
  {
    id: 5,
    name: "Dr. Queen Dube",
    title: "Keynote Speaker - Opening Ceremony",
    organization: "NACNDC & JASH Conference 2025",
    bio: "Distinguished keynote speaker for the opening ceremony of the NACNDC & JASH Conference 2025. Dr. Dube brings extensive expertise in health policy and will set the tone for the conference proceedings.",
    image: "/images/speakers/Dr. Queen Dube .jpeg"
  },
  {
    id: 1,
    name: "Prof. Francis Omaswa",
    title: "Guest of Honor",
    organization: "NACNDC & JASH Conference 2025",
    bio: "Distinguished Guest of Honor for the NACNDC & JASH Conference 2025. Prof. Omaswa is a renowned health professional with extensive experience in global health and health systems strengthening.",
    image: "/images/speakers/Prof Omaswa 2.jpg"
  },
  {
    id: 6,
    name: "Dr. Alex Riolexus Ario",
    title: "Associate Professor of Infectious Disease Epidemiology",
    organization: "Uganda National Institute of Public Health",
    bio: "Medical Doctor and Public Health Specialist who has worked in various capacities in Uganda government and agencies including as Hospital Superintendent and District Health Officer as well as Health Advisor, Health Sector Support Program, Ministry of Health. He also worked as Care and Treatment Manager in the Uganda Ministry of Health, STD/AIDS Control Programme. Served/serves as a member in numerous Continental, Regional and National Technical Working Groups, Steering Committees and Boards. Member, Tripartite One Health Field Epidemiology Technical Advisory Group, FAO/WOAH/WHO; Member, Scientific Advisory Committee on Malaria Epidemics, Uganda; Board Member, Africa CDC's Journal of Public Health in Africa; Member, Africa Continental Mortality Surveillance Task Force; Chair, East Africa Mortality Surveillance Task Force; Member, Africa COVID-19 Surveillance Task Force; Deputy Chair, Uganda National COVID-19 Inter-Agency Technical Task Force; Member, Advisory Committee, Koffi Annan Global Health Leadership Program; Member, Pandemics: Emergence, Spread and Response Advisory Committee, London School of Tropical Hygiene and Medicine; Member, Technical Advisory Group, African Epidemic Service; Member, IANPHI Integrated Disease Surveillance Technical Committee; Member, Policy Advisory Stakeholders Group (PAS-G) – EPSILON Initiative, Science for Africa Foundation and Pandemic Science Institute; Chair Eastern Africa Regional Technical Advisory Committee (ReTAC), Africa CDC; Chair, International Association of National Public Health Institutes, Africa Network. Dr. Ario is currently the Program Director of the Uganda Public Health Fellowship Program and Director, Uganda National Institute of Public Health.",
    image: "/images/speakers/Dr. Alex Riolexus Ario.jpg"
  },
  {
    id: 7,
    name: "Dr. Kazoora Wilson",
    title: "Clinical Mentor & Quality Improvement Manager",
    organization: "AIDS Healthcare Foundation (AHF) Uganda Cares",
    bio: "Medical Doctor with AIDS Healthcare Foundation (AHF) Uganda Cares, serving as a Clinical Mentor and Quality Improvement manager. He holds an MBChB from Mbarara University of Science and Technology and has over eight years of experience in HIV prevention, care, and treatment. Dr. Kazoora provides national mentorship in integrated service delivery, focusing on HIV, NCD, STIs and TB.",
    image: "/images/speakers/Dr. Kazoora Wilson.jpeg"
  },
  {
    id: 8,
    name: "Henry Magala",
    title: "Session Chair - Track Health Policy, Financing and Partnerships",
    organization: "Monday, 3rd November 2025",
    bio: "Session Chair for Track Health Policy, Financing and Partnerships on Monday, 3rd November 2025. Henry brings extensive experience in health policy development and health financing strategies.",
    image: null
  },
  {
    id: 9,
    name: "Dr. Rhoda Wanyenze",
    title: "Dean",
    organization: "Makerere University School of Public Health",
    bio: "Public health expert and advocate for health equity and gender-responsive health systems in Uganda. Dr. Wanyenze leads the School of Public Health in advancing public health education and research.",
    image: null
  }
]

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 py-16">
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
                    {speaker.image ? (
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        />
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
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                      {speaker.bio}
                    </p>
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
'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Globe, Users, Award, Target, Heart, Shield } from 'lucide-react'

const partners = [
  {
    name: 'Centers for Disease Control and Prevention (CDC)',
    logo: '/images/partners/CDC.png',
    description: 'Leading public health agency providing technical assistance and support for health programs worldwide.',
    category: 'Government Agency'
  },
  {
    name: 'Infectious Diseases Institute (IDI)',
    logo: '/images/partners/IDI MAK Logo - Copy.png',
    description: 'Premier research and training institution focused on infectious diseases and public health in Africa.',
    category: 'Research Institution'
  },
  {
    name: 'International Development Research Centre (IDRC)',
    logo: '/images/partners/IDRC-Logo-480.png',
    description: 'Canadian Crown corporation that funds research and innovation in developing countries.',
    category: 'Funding Organization'
  },
  {
    name: 'Makerere University College of Health Sciences',
    logo: '/images/partners/Logo-with-Text.png',
    description: 'Leading medical and health sciences education institution in Uganda and East Africa.',
    category: 'Academic Institution'
  },
  {
    name: 'PEPFAR Uganda',
    logo: '/images/partners/PEPFAR-Uganda-tagline (1).jpg',
    description: 'U.S. President\'s Emergency Plan for AIDS Relief providing comprehensive HIV/AIDS support.',
    category: 'International Program'
  },
  {
    name: 'The Global Fund',
    logo: '/images/partners/The Global Fund_Logo_Artwork_Stacked_Colour.png',
    description: 'International financing organization fighting AIDS, tuberculosis, and malaria.',
    category: 'International Organization'
  }
]

const categories = [
  {
    name: 'Government Agencies',
    icon: Building,
    color: 'blue',
    partners: partners.filter(p => p.category === 'Government Agency')
  },
  {
    name: 'Research Institutions',
    icon: Award,
    color: 'green',
    partners: partners.filter(p => p.category === 'Research Institution')
  },
  {
    name: 'Academic Institutions',
    icon: Users,
    color: 'purple',
    partners: partners.filter(p => p.category === 'Academic Institution')
  },
  {
    name: 'International Organizations',
    icon: Globe,
    color: 'orange',
    partners: partners.filter(p => p.category === 'International Organization' || p.category === 'International Program')
  },
  {
    name: 'Funding Organizations',
    icon: Target,
    color: 'indigo',
    partners: partners.filter(p => p.category === 'Funding Organization')
  }
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are proud to collaborate with leading organizations in public health, research, and development to advance digital health solutions in Uganda and beyond.
          </p>
        </div>

        {/* Partners by Category */}
        <div className="space-y-16">
          {categories.map((category) => {
            const IconComponent = category.icon
            if (category.partners.length === 0) return null
            
            return (
              <div key={category.name} className="space-y-8">
                <div className="flex items-center justify-center mb-8">
                  <div className={`w-16 h-16 bg-${category.color}-500 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-800 mx-auto mt-2 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.partners.map((partner, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white">
                      <CardHeader className="text-center pb-4">
                        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-50 rounded-xl p-4">
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="text-gray-400 text-sm">Logo</div>`;
                              }
                            }}
                          />
                        </div>
                        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                          {partner.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {partner.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-800`}>
                            {partner.category}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Partnership Benefits */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Benefits</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our partnerships create synergies that amplify impact and drive innovation in digital health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-50 to-primary-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Expertise</h3>
                <p className="text-gray-600 text-sm">
                  Access to world-class technical knowledge and best practices in digital health implementation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resource Mobilization</h3>
                <p className="text-gray-600 text-sm">
                  Collaborative funding opportunities and resource sharing for sustainable health programs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Capacity Building</h3>
                <p className="text-gray-600 text-sm">
                  Training programs and knowledge transfer to strengthen local health systems and workforce.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Joint research initiatives and pilot projects to test and scale innovative health solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join us in advancing digital health solutions and making a lasting impact on healthcare delivery in Uganda and across Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/sponsors"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Become a Sponsor
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
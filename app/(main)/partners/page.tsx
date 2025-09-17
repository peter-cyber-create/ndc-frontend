'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Globe, Users, Award, Target, Heart, Shield, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const partners = [
  {
    name: 'Makerere University School of Public Health (MakSPH)',
    logo: '/images/makCHS-logo-1.png',
    description: 'Makerere University School of Public Health (MakSPH) is a premier institution in Sub-Saharan Africa, renowned for public health training, research, and community engagement. Established in 1954, MakSPH pioneered postgraduate public health education in the region and has grown into a stand-alone school as of 2025, reflecting its outstanding impact and leadership in advancing health in Uganda and beyond.',
    website: '#'
  },
  {
    name: 'Infectious Diseases Institute (IDI)',
    logo: '/images/partners/IDI MAK Logo - Copy.png',
    description: 'The Infectious Diseases Institute (IDI) is a leading non-profit national organisation entirely owned by Makerere University. Founded in 2002, IDI is committed to strengthening health systems through research and capacity building to free Africa from the burden of infectious diseases and other emerging and re-emerging health challenges.',
    website: '#'
  },
  {
    name: 'PEPFAR Uganda',
    logo: '/images/partners/PEPFAR-Uganda-tagline (1).jpg',
    description: 'President\'s Emergency Plan for AIDS Relief in Uganda, supporting HIV/AIDS prevention and treatment programs.',
    website: '#'
  },
  {
    name: 'The Global Fund',
    logo: '/images/partners/The Global Fund_Logo_Artwork_Stacked_Colour.png',
    description: 'International financing organization dedicated to fighting AIDS, tuberculosis, and malaria worldwide.',
    website: '#'
  },
  {
    name: 'Centers for Disease Control and Prevention (CDC)',
    logo: '/images/partners/CDC.png',
    description: 'U.S. national public health institute, working to protect public health and safety through disease control and prevention.',
    website: '#'
  },
  {
    name: 'Infectious Diseases Research Organisation',
    logo: '/images/partners/IDRC-Logo-480.png',
    description: 'Canadian Crown corporation supporting research in developing countries to create lasting change.',
    website: '#'
  }
]

const sponsorshipPackages = [
  {
    name: 'Platinum Sponsor/Exhibitor',
    price: 10000,
    idealFor: 'Major healthcare firms, pharmaceutical companies, diagnostic labs, beverage firms & banking institutions',
    features: [
      'Prime booth location (largest size)',
      'Speaking slot (plenary or breakout)',
      'Logo on all promotional materials',
      '6 complimentary conference passes',
      'Feature in post-conference report',
      'Social media spotlight'
    ]
  },
  {
    name: 'Gold Sponsor/Exhibitor',
    price: 7000,
    idealFor: 'Medical tech companies, NGOs, research institutions',
    features: [
      'Premium booth location',
      'Panel participation opportunity',
      'Logo on website & program booklet',
      '4 complimentary passes',
      'Branded banner at venue'
    ]
  },
  {
    name: 'Silver Exhibitor',
    price: 5000,
    idealFor: 'Health startups, regional health agencies, universities',
    features: [
      'Standard booth',
      'Logo in program booklet',
      '2 complimentary passes',
      'Mention during opening/closing remarks'
    ]
  },
  {
    name: 'Bronze Exhibitor',
    price: 4000,
    idealFor: 'Small businesses, advocacy groups, student-led health initiatives',
    features: [
      'Basic booth',
      '1 complimentary pass',
      'Name listed in program booklet'
    ]
  },
  {
    name: 'Non-Profit/Academic Table',
    price: 2500,
    idealFor: 'Non-profits, student groups, academic researchers',
    features: [
      'Table display space only (shared zone)',
      'No promotional branding',
      '1 access badge',
      'Listing in non-profit section of booklet'
    ]
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
            Organizations working with us to strengthen health systems in Uganda
          </p>
        </div>

        {/* Partners Grid */}
                {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {partner.logo ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{partner.name}</h3>
                {partner.website && partner.website !== '#' && (
                  <Button variant="outline" size="sm" className="mt-2">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Opportunities */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us in advancing health innovation and research in Uganda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {sponsorshipPackages.map((pkg, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary-600 mb-2">${pkg.price.toLocaleString()}</div>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Ideal for:</strong> {pkg.idealFor}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    Choose This Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Partner With Us */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unlock unique opportunities to make a lasting impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-50 to-primary-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Network Access</h3>
                <p className="text-gray-600 text-sm">
                  Connect with 500+ health professionals, researchers, and policymakers
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Targeted Audience</h3>
                <p className="text-gray-600 text-sm">
                  Reach decision-makers in healthcare, government, and academia
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Brand Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Enhance your brand visibility among key stakeholders
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Social Impact</h3>
                <p className="text-gray-600 text-sm">
                  Support initiatives that improve health outcomes in Uganda
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join our mission to advance health innovation and research in Uganda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-primary-600 hover:bg-gray-100">
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  <a href="/sponsors">Register as Sponsor</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
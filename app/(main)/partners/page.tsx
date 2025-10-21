import React from 'react'
import { Building, Globe, Users, Award, Target, Heart, Shield, ExternalLink } from 'lucide-react'

const partners = [
  {
    name: 'GAVI, The Vaccine Alliance',
    logo: '/images/partners/gavi-logo.jpeg',
    description: 'GAVI is an international organization that helps vaccinate children in the world\'s poorest countries against deadly and debilitating infectious diseases.',
    website: 'https://www.gavi.org'
  },
  {
    name: 'The Global Fund',
    logo: '/images/partners/global-fund-logo.jpeg',
    description: 'International financing organization dedicated to fighting AIDS, tuberculosis, and malaria worldwide.',
    website: 'https://www.theglobalfund.org'
  },
  {
    name: 'Infectious Diseases Institute (IDI)',
    logo: '/images/partners/idi-logo.jpeg',
    description: 'The Infectious Diseases Institute (IDI) is a leading non-profit national organisation entirely owned by Makerere University. Founded in 2002, IDI is committed to strengthening health systems through research and capacity building to free Africa from the burden of infectious diseases and other emerging and re-emerging health challenges.',
    website: 'https://www.idi-makerere.com'
  },
  {
    name: 'Makerere University',
    logo: '/images/partners/mfu-logo.jpeg',
    description: 'Makerere University is Uganda\'s largest and oldest institution of higher learning, committed to providing quality education and research.',
    website: 'https://www.mak.ac.ug'
  },
  {
    name: 'Medical Research Council (MRC)',
    logo: '/images/partners/mrc-logo.jpeg',
    description: 'The Medical Research Council is a UK government agency responsible for co-ordinating and funding medical research.',
    website: 'https://www.ukri.org/councils/mrc'
  },
  {
    name: 'TASO Uganda',
    logo: '/images/partners/taso-logo.jpeg',
    description: 'The AIDS Support Organisation (TASO) is a leading provider of HIV/AIDS prevention, care, and treatment services in Uganda.',
    website: 'https://www.tasouganda.org'
  },
  {
    name: 'Uganda AIDS Commission (UAC)',
    logo: '/images/partners/uac-logo.jpeg',
    description: 'The Uganda AIDS Commission is the national coordinating body for HIV/AIDS activities in Uganda.',
    website: 'https://www.aidsuganda.org'
  },
  {
    name: 'UNICEF',
    logo: '/images/partners/unicef-logo.png',
    description: 'The United Nations Children\'s Fund works to protect the rights of every child, especially the most disadvantaged.',
    website: 'https://www.unicef.org'
  },
  {
    name: 'World Health Organization (WHO)',
    logo: '/images/partners/who-logo.jpeg',
    description: 'The World Health Organization is the directing and coordinating authority on international health work within the United Nations system.',
    website: 'https://www.who.int'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
              <p className="text-sm text-gray-600 mb-3">{partner.description}</p>
              {partner.website && partner.website !== '#' && (
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Website
                </a>
              )}
            </div>
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
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6">
                <div className="text-center pb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">${pkg.price.toLocaleString()}</div>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Ideal for:</strong> {pkg.idealFor}
                  </p>
                </div>
                <div className="pt-0">
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Choose This Package
                  </button>
                </div>
              </div>
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg text-center p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Network Access</h3>
              <p className="text-gray-600 text-sm">
                Connect with 500+ health professionals, researchers, and policymakers
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg text-center p-8">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Targeted Audience</h3>
              <p className="text-gray-600 text-sm">
                Reach decision-makers in healthcare, government, and academia
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg text-center p-8">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Brand Recognition</h3>
              <p className="text-gray-600 text-sm">
                Enhance your brand visibility among key stakeholders
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg text-center p-8">
              <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Social Impact</h3>
              <p className="text-gray-600 text-sm">
                Support initiatives that improve health outcomes in Uganda
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our mission to advance health innovation and research in Uganda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="/sponsors" 
                className="border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Register as Sponsor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
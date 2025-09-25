import Link from 'next/link'
import { User, Award, Building, Mail, Twitter, Linkedin, ExternalLink } from 'lucide-react'

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
  }
]

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conference Speakers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the distinguished speakers and thought leaders who will share their expertise and insights at the NACNDC & JASHConference 2025.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              {/* Speaker Image */}
              <div className="relative h-80 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                {['/images/charles.jpeg','/images/diana.jpeg','/images/ruth.jpeg'].includes(speaker.image) ? (
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-56 h-56 object-cover rounded-full border-4 border-primary-400 shadow-2xl z-10 bg-white"
                    />
                    <span className="absolute bottom-2 right-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full shadow">Keynote</span>
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-primary-200 rounded-full flex items-center justify-center border-2 border-primary-100">
                    <User className="h-20 w-20 text-primary-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
              </div>

              {/* Speaker Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                <p className="text-primary-600 font-semibold mb-1">{speaker.title}</p>
                <div className="flex items-center text-gray-600 mb-3">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="text-sm">{speaker.organization}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{speaker.bio}</p>

                {/* Social Links */}
                <div className="flex items-center space-x-3">
                  <a
                    href={speaker.social.twitter}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href={speaker.social.linkedin}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={`mailto:${speaker.name.toLowerCase().replace(/\s+/g, '.')}@moh.go.ug`}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want to be a Speaker?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always looking for passionate health professionals to share their knowledge and experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/abstracts"
                className="btn-primary"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Submit Abstract
              </Link>
              <Link
                href="/contact"
                className="btn-outline"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



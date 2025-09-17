import Link from 'next/link'
import Image from 'next/image'
import { User, Award, Building, Mail, Twitter, Linkedin, ExternalLink } from 'lucide-react'

const speakers = [
  {
    id: 1,
    name: "Dr. Charles Olaro",
    title: "Minister of Health",
    organization: "Ministry of Health Uganda",
    bio: "Leading Uganda's health sector transformation with focus on health integration and universal health coverage.",
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
    bio: "Championing health policy reforms and health initiatives to improve healthcare delivery in Uganda.",
    image: "/images/diana.jpeg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 3,
    name: "Dr. Richard Mugahi",
    title: "Assistant Commissioner",
    organization: "Ministry of Health Uganda",
    bio: "Expert in health information systems and health implementation across Uganda's health facilities.",
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
    image: null, // Will use placeholder icon
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
    image: null, // Will use placeholder icon
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
            Meet the distinguished speakers and thought leaders who will share their expertise and insights at the upcoming conference.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              {/* Speaker Image */}
              <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                {speaker.image ? (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <Image
                        src={speaker.image}
                        alt={speaker.name}
                        fill
                        className="object-cover object-center transition-transform duration-300 hover:scale-110"
                        sizes="(max-width: 768px) 192px, 192px"
                        priority={speaker.id <= 3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-48 h-48 bg-primary-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                      <User className="h-20 w-20 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <Award className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{speaker.name}</h3>
                  <p className="text-white/90 font-medium drop-shadow-md">{speaker.title}</p>
                </div>
              </div>

              {/* Speaker Info */}
              <div className="p-6">
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



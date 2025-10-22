import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative hud-overlay cyber-grid">
      {/* HUD Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-hud-scan" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-hud-scan animation-delay-500" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-hud-scan animation-delay-1000" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-hud-scan animation-delay-1500" />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/images/uganda-coat-of-arms.png" 
                  alt="Uganda Coat of Arms" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-sm sm:text-base lg:text-lg leading-tight block">
                <span className="block">NACNDC & JASH</span>
                <span className="block">Conference <span className="font-extrabold">2025</span></span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES. Bringing together Uganda's healthcare professionals and leaders at Speke Resort Munyonyo for integrated health systems and technology-driven solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">About Conference</Link></li>
              <li><Link href="/agenda" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">Agenda</Link></li>
              <li><Link href="/speakers" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">Speakers</Link></li>
              <li><Link href="/partners" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">Partners</Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">Register</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-velocity hover:glow-cyan">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 NACNDC & JASHConference 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

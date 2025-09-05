# National Digital Health Conference 2025

A modern, responsive web application for the National Annual Communicable and Non-Communicable Diseases (NACNDC) and 19th Joint Scientific Health (JASH) Conference 2025.

## 🚀 Features

- **Conference Registration**: Complete registration system with payment proof upload
- **Abstract Submission**: Research abstract submission with file upload support
- **Sponsorship Applications**: Multiple sponsorship packages with application forms
- **Admin Dashboard**: Comprehensive admin panel for managing all submissions
- **Contact System**: Contact form with inquiry type categorization
- **Countdown Timer**: Real-time countdown to conference date
- **Responsive Design**: Mobile-first, responsive design for all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: MySQL/MariaDB
- **File Uploads**: Next.js API Routes with multipart/form-data
- **Deployment**: PM2, Nginx

## 📁 Project Structure

```
ndc-frontend/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Public pages
│   │   ├── page.tsx             # Homepage
│   │   ├── about/               # About page
│   │   ├── abstracts/           # Abstract submission
│   │   ├── contact/             # Contact form
│   │   ├── register/            # Registration form
│   │   └── sponsors/            # Sponsorship application
│   ├── admin/                    # Admin panel
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── registrations/       # Manage registrations
│   │   ├── abstracts/           # Manage abstracts
│   │   ├── contacts/            # Manage contacts
│   │   ├── sponsorships/        # Manage sponsorships
│   │   └── login/               # Admin login
│   └── api/                      # API routes
│       ├── registrations/        # Registration API
│       ├── abstracts/            # Abstract API
│       ├── contacts/             # Contact API
│       ├── sponsorships/         # Sponsorship API
│       └── admin/                # Admin API endpoints
├── components/                    # Reusable components
│   ├── Navbar.tsx               # Navigation component
│   ├── Footer.tsx               # Footer component
│   ├── HomeSlideshow.tsx        # Homepage slideshow
│   ├── CountdownTimer.tsx       # Conference countdown
│   ├── Toast.tsx                # Toast notifications
│   └── ToastContainer.tsx       # Toast container
├── hooks/                        # Custom React hooks
│   └── useToast.ts              # Toast notification hook
├── database/                     # Database files
│   └── schema.sql               # Database schema
├── public/                       # Static assets
│   └── images/                  # Images and media
├── config/                       # Configuration files
│   └── ntlp-conference.conf     # Nginx configuration
├── ecosystem.config.js          # PM2 configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL/MariaDB
- PM2 (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/peter-cyber-create/ndc-frontend.git
   cd ndc-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=conference_db
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   mysql -u your_user -p < database/schema.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The application uses MySQL/MariaDB. Run the schema file to set up the database:

```bash
mysql -u your_user -p < database/schema.sql
```

### Database Tables

- **registrations**: Conference registrations with payment proof
- **abstracts**: Research abstract submissions
- **contacts**: Contact form submissions
- **sponsorships**: Sponsorship applications

## 🚀 Deployment

### Production Setup

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```

3. **Configure Nginx** (see `config/ntlp-conference.conf`)

### Environment Variables

Set these environment variables in production:

```env
NODE_ENV=production
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## 📱 Features Overview

### Public Features
- **Homepage**: Conference information with countdown timer
- **Registration**: Complete registration with payment proof upload
- **Abstract Submission**: Research abstract submission with file upload
- **Sponsorship**: Multiple sponsorship packages
- **Contact**: Contact form with inquiry categorization

### Admin Features
- **Dashboard**: Overview of all submissions and statistics
- **Registration Management**: View, approve, reject, delete registrations
- **Abstract Management**: Review and manage abstract submissions
- **Contact Management**: Handle contact inquiries
- **Sponsorship Management**: Manage sponsorship applications
- **File Downloads**: Download payment proofs and abstract files

## 🎨 Design System

The application uses a consistent design system with:
- **Primary Colors**: Blue gradient theme
- **Typography**: Clean, readable fonts
- **Components**: Reusable, accessible components
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant components

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **Pages**: Located in `app/` directory using Next.js App Router
- **Components**: Reusable components in `components/`
- **API Routes**: Server-side logic in `app/api/`
- **Styling**: Tailwind CSS with custom configuration
- **Types**: TypeScript interfaces and types

## 📄 License

This project is proprietary software developed for the National Digital Health Conference 2025.

## 🤝 Support

For support and questions, please contact the development team.

---

**Conference Details:**
- **Date**: November 3-7, 2025
- **Venue**: Speke Resort Munyonyo, Uganda
- **Theme**: "Unified Action against Communicable and Non-Communicable Diseases"
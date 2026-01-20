# 🚀 Shubhsanket Sharma - Developer Portfolio

A minimalistic, modern portfolio website showcasing AI/ML and full-stack development projects. Built with Next.js, TypeScript, MongoDB, and Resend email integration.

## ✨ Features

### 🎨 Design
- **Dual Theme**: Dark/Light mode toggle with smooth transitions
- **Modern Animations**: Framer Motion powered smooth animations
- **Glassmorphism**: Beautiful glass-effect cards with gradient overlays
- **Brutalist Elements**: Clean, bold typography and layout
- **Responsive**: Fully responsive design for all devices

### 🔧 Technical Features
- **Real Backend**: Full REST API with MongoDB integration
- **Admin Panel**: CRUD operations for project management
- **Contact Form**: Submissions stored in MongoDB
- **Email Integration**: Resend API for instant email notifications
- **Type-Safe**: Built with TypeScript for reliability
- **Performance**: Optimized with Next.js 14

### 📋 Sections
1. **Hero**: Animated introduction with gradient text and floating elements
2. **About**: Personal bio highlighting expertise in AI, blockchain, and web development
3. **Experience**: UI/UX design experience (3 years)
4. **Skills**: Interactive skill bars with progress animations
5. **Projects**: Detailed showcase of AI/ML and blockchain projects
6. **Contact**: Working contact form with email notifications

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful UI components
- **Framer Motion**: Advanced animations
- **Lucide Icons**: Modern icon library

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **MongoDB**: Database for projects and contacts
- **Resend**: Email service integration
- **UUID**: Unique identifiers for records

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB running on localhost:27017
- Yarn package manager

### Setup

1. **Clone and Install**
```bash
cd /app
yarn install
```

2. **Environment Variables**
Already configured in `.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
RESEND_API_KEY=your_resend_api_key
ADMIN_PASSWORD=admin123
FROM_EMAIL=onboarding@resend.dev
TO_EMAIL=designershubh1208@gmail.com
```

3. **Seed Initial Projects**
```bash
node scripts/seed-projects.js
```

4. **Start Development Server**
```bash
yarn dev
# or using supervisor
sudo supervisorctl restart nextjs
```

5. **Access Portfolio**
- Frontend: http://localhost:3000
- Production: https://dev-ai-showcase.preview.emergentagent.com

## 🎯 Usage

### Public Features
- **View Portfolio**: Browse projects, skills, and experience
- **Theme Toggle**: Switch between dark and light themes
- **Contact Form**: Send messages (stored in DB + email notification)

### Admin Features
- **Login**: Click "Admin" button, enter password: `admin123`
- **Add Projects**: Create new projects with full details
- **Edit Projects**: Update existing project information
- **Delete Projects**: Remove projects from portfolio
- **View Contacts**: Access submitted contact forms

## 📡 API Endpoints

### Projects
- `GET /api/projects` - Fetch all projects
- `GET /api/projects/:id` - Fetch single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - View all contacts (admin only)

### Stats
- `GET /api/stats` - Get portfolio statistics

## 🔐 Admin Access

**Password**: `admin123`

Admin features:
- Add, edit, and delete projects
- Mark projects as featured
- View contact form submissions
- Manage project categories and tech stacks

## 📧 Email Notifications

Contact form submissions automatically send emails via Resend to:
- **Recipient**: designershubh1208@gmail.com
- **Format**: Professional HTML email with submission details
- **Fallback**: Submissions still saved to database if email fails

## 🎨 Customization

### Theme Colors
Modify gradient colors in `app/page.js`:
```javascript
// Current: purple, pink, blue, cyan
// Change gradient classes: from-purple-500 to-pink-500
```

### Projects
Add/edit projects through:
1. **Admin Panel**: Use UI after logging in
2. **Database**: Direct MongoDB insertion
3. **Seed Script**: Modify `scripts/seed-projects.js`

### Skills
Edit skills array in `app/page.js`:
```javascript
const skills = [
  { name: 'React', level: 95 },
  // Add more skills...
];
```

## 📊 Database Schema

### Projects Collection
```javascript
{
  id: "uuid",
  title: "string",
  description: "string",
  features: ["array of strings"],
  techStack: ["array of strings"],
  category: "string",
  link: "string (optional)",
  featured: boolean,
  createdAt: "ISO date string"
}
```

### Contacts Collection
```javascript
{
  id: "uuid",
  name: "string",
  email: "string",
  message: "string",
  createdAt: "ISO date string"
}
```

## 🚀 Deployment

The application is configured for production deployment:
- **URL**: https://dev-ai-showcase.preview.emergentagent.com
- **MongoDB**: Connected via MONGO_URL environment variable
- **Services**: Managed via supervisor
- **Hot Reload**: Enabled for development

## 🔧 Development

### Project Structure
```
/app/
├── app/
│   ├── api/[[...path]]/route.js  # API routes
│   ├── page.js                    # Main portfolio page
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── components/ui/                 # shadcn components
├── scripts/
│   └── seed-projects.js          # Database seeding
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

### Key Files
- **Frontend**: `/app/app/page.js`
- **Backend**: `/app/app/api/[[...path]]/route.js`
- **Styles**: `/app/app/globals.css`
- **Config**: `/app/.env`

## 🌟 Features Showcase

### Animation Effects
- Smooth scroll animations
- Card hover effects
- Gradient text animations
- Loading transitions
- Theme toggle animation

### Contact Form
- Real-time validation
- Success/error toasts
- Email notifications via Resend
- MongoDB storage
- Responsive design

### Admin Panel
- Secure password protection
- Full CRUD operations
- Modal-based editing
- Rich project details
- Featured project toggle

## 📝 Future Enhancements

Potential features to add:
- Blog section with MDX
- Project detail pages
- Image upload for projects
- Analytics dashboard
- Search and filter projects
- Social media feed integration

## 🤝 Contact

**Shubhsanket Sharma**
- Email: designershubh1208@gmail.com
- GitHub: [@designershubh1208-pixel](https://github.com/designershubh1208-pixel)
- Instagram: [@webtech_shubh](https://www.instagram.com/webtech_shubh/)

## 📄 License

This project is personal portfolio of Shubhsanket Sharma.

---

Built with ❤️ using Next.js, MongoDB, and Resend

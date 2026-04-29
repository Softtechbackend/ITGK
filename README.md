# PMSURYAGHAR ROOFTOP SOLAR SCHEME - Full Stack Application

A comprehensive full-stack application for managing solar installation services in India with user roles, form workflows, PDF generation, analytics, and referral tracking.

## 🚀 Features

- **Multi-Role Access Control**: SuperAdmin, Admin, Employee, and Partner roles
- **Partner Registration & Management**: Comprehensive registration with personal, business, and property details
- **Form Workflows**: Flexible workflow for Quotations, Agreements, Certificates, and Invoices
- **PDF Generation**: Generate PDFs from Word templates automatically
- **Document Versioning**: Track all document versions with full audit trail
- **Referral System**: Track Partner-to-Partner and Partner-to-Customer referrals
- **Analytics Dashboard**: Comprehensive metrics and reporting by role
- **RESTful API**: Fully documented API for all operations

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 with TypeScript, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (RESTful)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **PDF Generation**: docx, mammoth, pdfkit
- **Styling**: Tailwind CSS with custom design tokens

## 📋 Prerequisites

- Node.js 18+ (use pnpm as package manager)
- Supabase account and project
- GitHub account (for deployment)

## ⚙️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Database Setup

The database schema is created automatically through the migration script. To run it:

```bash
pnpm install
node --env-file-if-exists=.env.local scripts/run_migration.js
```

This creates all necessary tables:
- `users` - System users
- `partners` - Partner extended information
- `applications` - Service applications
- `registration_forms` - Partner registration data
- `quotations` - Generated quotations
- `vendor_agreements` - Partnership agreements
- `work_completion_certificates` - Project completion records
- `invoices` - Billing records
- `documents` - Document version history
- `referrals` - Referral tracking
- `templates` - Uploaded Word document templates

### 3. Word Template Setup

1. Login as Admin
2. Navigate to Admin Panel → Templates
3. Upload Word (.docx) files for:
   - Quotation template
   - Vendor Agreement template
   - Work Completion Certificate template
   - Invoice template

### 4. Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register        - Register new user
POST /api/auth/signin          - Login user
POST /api/auth/signout         - Logout user
GET  /api/users/profile        - Get current user profile
```

### Applications Endpoints

```
POST /api/applications         - Create new application
GET  /api/applications         - List applications (role-based)
GET  /api/applications/[id]    - Get application details
PUT  /api/applications/[id]    - Update application status
```

### Form & Document Endpoints

```
POST /api/documents/generate-pdf    - Generate PDF from template
GET  /api/certificates             - Get completion certificates
POST /api/certificates             - Create certificate
GET  /api/invoices                 - Get invoices
POST /api/invoices                 - Create invoice
```

### Referral Endpoints

```
GET  /api/referrals            - Get user's referral data
POST /api/referrals            - Create referral
GET  /api/referrals/stats      - Get referral statistics
```

### Analytics Endpoints

```
GET  /api/analytics/dashboard  - Get dashboard analytics
```

## 👥 User Roles

### SuperAdmin
- System-wide access and management
- User role assignment
- System configuration
- Full analytics access

### Admin
- Partner management and approval
- Template upload and management
- System-wide analytics
- User monitoring

### Employee
- Review and manage assigned applications
- Generate documents
- Approve/reject applications
- Document certification

### Partner
- Register for services
- View own applications
- Generate quotations, agreements, certificates
- Track referrals and commissions
- Manage referral network

## 🔄 Application Workflow

1. **Registration**: Partner completes registration form (personal, business, property details)
2. **Quotation**: Employee/Partner generates quotation PDF from template
3. **Agreement**: Vendor agreement is created and must be signed
4. **Work Completion**: Employee marks work as completed and generates certificate
5. **Invoice**: Invoice is generated based on quotation and issued to customer

## 📊 Analytics Dashboard

- **Applications Metrics**: Total, by status, completion rates
- **Partner Performance**: Active partners, referral network, commissions
- **Revenue Analytics**: Total revenue, invoices, payments
- **System Overview**: User statistics, template usage, document count

## 🔐 Security

- Supabase Row-Level Security (RLS) for data isolation
- JWT authentication for all API endpoints
- Input validation with Zod schemas
- Password hashing via Supabase Auth
- CORS protection
- Rate limiting on API endpoints

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (below 768px)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy automatically on push to main branch

```bash
# Create a PR for preview deployment
git checkout -b feature/solar-scheme
git add .
git commit -m "feat: initial solar scheme implementation"
git push origin feature/solar-scheme
```

## 📝 Project Structure

```
src/
├── app/
│   ├── api/              # RESTful API routes
│   ├── auth/             # Authentication pages
│   ├── applications/     # Application management
│   ├── dashboard/        # Role-based dashboards
│   ├── analytics/        # Analytics pages
│   ├── referrals/        # Referral management
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn/ui components
│   └── forms/            # Form components
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Auth utilities
│   ├── utils.ts          # Helper functions
│   └── types.ts          # TypeScript types
└── styles/
    └── globals.css       # Global styles
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📞 Support

For issues and questions, please create an issue in the GitHub repository.

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: Active Development

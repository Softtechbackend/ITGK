# PM SURYAGHAR - Deployment Guide

## Overview

This guide covers deploying the PM SURYAGHAR application to Vercel with Supabase database integration.

## Prerequisites

1. **GitHub Repository**: Connected and pushed (Softtechbackend/ITGK)
2. **Supabase Account**: Project created with PostgreSQL database
3. **Vercel Account**: Connected to GitHub
4. **Environment Variables**: All configured in Vercel project settings

## Step 1: Prepare Supabase

### Create Tables

Run the migration script to create all required tables:

```bash
# Locally (for development)
node scripts/run_migration.js

# Or manually execute the SQL in Supabase SQL Editor:
# scripts/01_create_schema.sql
```

### Enable Row Level Security (RLS)

In Supabase dashboard:
1. Go to Authentication → Policies
2. Enable RLS on all tables
3. Configure policies for role-based access:

```sql
-- Example: Users can only see their own data
CREATE POLICY "Users can see own data" 
ON applications 
FOR SELECT 
USING (user_id = auth.uid());

-- Example: Admins can see all data
CREATE POLICY "Admins can see all applications" 
ON applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('ADMIN', 'SUPERADMIN')
  )
);
```

## Step 2: Configure Vercel

### Environment Variables

Add these to Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
```

### Build Settings

- **Framework**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### Domains

1. Add custom domain in Vercel
2. Configure DNS records as shown in Vercel dashboard
3. Enable HTTPS (automatic with Vercel)

## Step 3: Deploy

### From GitHub (Recommended)

```bash
# Push code to GitHub
git add .
git commit -m "feat: initial PM SURYAGHAR deployment"
git push origin main

# Vercel will automatically deploy on push to main branch
```

### From Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel --prod
```

## Step 4: Post-Deployment

### Initial Setup

1. **Create SuperAdmin User**
   ```sql
   INSERT INTO users (id, email, name, role, created_at) 
   VALUES (
     gen_random_uuid(), 
     'admin@pmsuryaghar.com', 
     'System Administrator', 
     'SUPERADMIN', 
     now()
   );
   ```

2. **Upload Document Templates**
   - Login as SuperAdmin
   - Go to Admin Dashboard
   - Upload Word templates for:
     - Quotation
     - Vendor Agreement
     - Work Completion Certificate
     - Invoice

3. **Configure Storage**
   - Enable Supabase Storage bucket for templates
   - Set public/private access as needed

### Test Key Features

1. **Authentication**
   - Register new user
   - Login/Logout
   - Profile view

2. **Applications**
   - Create new application
   - Submit quotation
   - Generate PDFs

3. **Dashboard**
   - View applications list
   - Check analytics
   - View referrals

## Monitoring & Maintenance

### Logs

- **Vercel Logs**: `vercel logs` command
- **Application Logs**: Check Vercel deployment logs
- **Database Logs**: Monitor in Supabase dashboard

### Performance

- Monitor Core Web Vitals in Vercel Analytics
- Check database query performance in Supabase dashboard
- Optimize images and assets as needed

### Backups

- Enable automatic backups in Supabase
- Schedule weekly database exports
- Keep local backup of Word templates

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: Database URL not found
   ```
   → Check SUPABASE_URL and SUPABASE_KEY in environment variables

2. **Authentication Failed**
   ```
   Error: Unauthorized access
   ```
   → Verify Supabase Auth configuration and JWT settings

3. **PDF Generation Failed**
   ```
   Error: Failed to process template
   ```
   → Check template file format (.docx) and placeholder syntax ({{KEY}})

4. **Storage Upload Failed**
   ```
   Error: Access denied to storage bucket
   ```
   → Enable storage bucket and configure RLS policies

### Debug Mode

Set environment variable for verbose logging:

```
DEBUG=pmsuryaghar:*
NEXT_DEBUG=true
```

## Security Checklist

- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Configure CORS properly
- [ ] Enable rate limiting on API routes
- [ ] Use environment variables for all secrets
- [ ] Enable Supabase RLS on all tables
- [ ] Configure audit logging
- [ ] Regular security updates
- [ ] Monitor for suspicious activity

## Scaling

### Database Scaling

- Monitor Supabase resource usage
- Upgrade plan if needed
- Add indexes for frequently queried columns
- Archive old data if necessary

### Application Scaling

- Enable Vercel Edge Cache
- Use CDN for static assets
- Optimize database queries
- Consider caching layer (Redis)

## Rollback

If deployment fails:

```bash
# Rollback to previous deployment
vercel rollback

# Or redeploy specific commit
vercel --prod --commit-sha=<commit-sha>
```

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project README**: See README.md

---

**Last Updated**: April 2026
**Version**: 1.0.0

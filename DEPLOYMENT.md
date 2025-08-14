# 🚀 Deployment Guide

This guide will help you deploy Log Copilot to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account (for repository hosting)
- Vercel account (for deployment)

## 🎯 Quick Deploy to Vercel (Recommended)

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard)

1. Click the "Deploy with Vercel" button above
2. Sign in with your GitHub account
3. Vercel will automatically:
   - Clone the repository
   - Install dependencies
   - Build the project
   - Deploy to a live URL

### Option 2: Manual Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🌐 Deploy to GitHub Pages

### Step 1: Prepare Repository

```bash
# Clone the repository
git clone https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard.git
cd Log-Copilot-SOC-Analyst-Dashboard

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 2: Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/docs" folder
5. Click "Save"

### Step 3: Deploy

```bash
# Create docs directory and copy build files
mkdir docs
cp -r dist/* docs/

# Commit and push
git add docs/
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 🐳 Deploy with Docker

### Create Dockerfile

```dockerfile
# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build and Run

```bash
# Build Docker image
docker build -t log-copilot .

# Run container
docker run -p 3000:3000 log-copilot
```

## 🔧 Environment Variables

Create a `.env` file for production:

```env
# Production settings
NODE_ENV=production
VITE_APP_TITLE=Log Copilot
VITE_APP_DESCRIPTION=SOC Analyst Dashboard
```

## 📊 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize for production
npm run build -- --mode production
```

### Vercel Configuration

The `vercel.json` file includes:
- Security headers
- Optimized build settings
- Proper routing

## 🔒 Security Considerations

### Headers Configuration

The deployment includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Content Security Policy

Add to your deployment:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 🚀 Continuous Deployment

### GitHub Actions

The `.github/workflows/deploy.yml` file enables automatic deployment:

1. Push to main branch
2. GitHub Actions builds the project
3. Automatically deploys to Vercel

### Required Secrets

Set these in your GitHub repository settings:

- `VERCEL_TOKEN`: Your Vercel API token
- `ORG_ID`: Your Vercel organization ID
- `PROJECT_ID`: Your Vercel project ID

## 📱 Mobile Deployment

### PWA Configuration

The app is configured as a Progressive Web App:

```json
{
  "name": "Log Copilot",
  "short_name": "LogCopilot",
  "description": "SOC Analyst Dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6"
}
```

## 🔍 Monitoring and Analytics

### Vercel Analytics

Enable Vercel Analytics in your dashboard for:
- Performance monitoring
- Error tracking
- User analytics

### Custom Analytics

Add your preferred analytics service:

```javascript
// Example: Google Analytics
gtag('config', 'GA_MEASUREMENT_ID');
```

## 🛠️ Troubleshooting Deployment

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables**
   - Ensure all required env vars are set
   - Check Vercel dashboard for missing variables

3. **Domain Issues**
   - Verify DNS settings
   - Check SSL certificate status

### Debug Commands

```bash
# Check build locally
npm run build
npm run preview

# Test production build
npx serve dist

# Analyze bundle
npm run build -- --analyze
```

## 📞 Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [GitHub Actions Docs](https://docs.github.com/en/actions)
- Open an issue in the repository

## 🎉 Success!

Once deployed, your Log Copilot will be available at:
- **Vercel**: `https://your-project.vercel.app`
- **GitHub Pages**: `https://your-username.github.io/Log-Copilot-SOC-Analyst-Dashboard`

Share the link with your team and start analyzing logs!

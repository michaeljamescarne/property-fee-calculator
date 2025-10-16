# Development Scripts

This directory contains automated scripts to help with development and maintenance of the Australian Property Investment Calculator.

## 🚀 Quick Start

To begin a productive coding session, run:

```bash
./scripts/start-night-work.sh
```

This master script will:
- Run a health check on your site
- Show current git status
- Display available tasks
- Help you choose what to work on
- Start the development server if needed

## 📋 Available Scripts

### Core Scripts

#### `start-night-work.sh`
**Master script for productive coding sessions**
- Comprehensive health check
- Task management
- Development environment setup
- Interactive session planning

#### `setup-dev-environment.sh`
**Quick development environment setup**
- Install dependencies
- Check environment configuration
- Start development server

#### `quick-test.sh`
**Rapid functionality testing**
- Test local and production sites
- Provide manual testing checklist
- Performance testing guidance

#### `automated-health-check.js`
**Automated system health monitoring**
- Check production site status
- Verify local development server
- Test build process
- Run code quality checks

### Documentation

#### `night-work-plan.md`
**Comprehensive planning document**
- Priority task breakdown
- Time estimates
- Success metrics
- Session planning templates

#### `deploy-checklist.md`
**Pre-deployment verification**
- Code quality checks
- Feature testing
- Performance requirements
- Rollback procedures

## 🎯 Usage Examples

### Starting a New Session
```bash
# Full setup with interactive planning
./scripts/start-night-work.sh

# Quick development setup
./scripts/setup-dev-environment.sh

# Just run tests
./scripts/quick-test.sh
```

### Health Monitoring
```bash
# Check system health
node scripts/automated-health-check.js

# Test specific functionality
curl -I https://aupropertyinvestmentmc.vercel.app
```

### Development Workflow
```bash
# 1. Start session
./scripts/start-night-work.sh

# 2. Make changes
# ... edit code ...

# 3. Test changes
./scripts/quick-test.sh

# 4. Deploy (if ready)
vercel --prod
```

## 📊 Current Project Status

### ✅ Completed Features
- FIRB Calculator with wizard
- Investment Analytics platform
- FAQ system (85+ questions)
- Professional design
- Mobile responsiveness
- Multi-language support
- PDF download
- Email results

### 🎯 Priority Tasks
1. **Enhanced PDF Reports** (12 hours)
2. **Complete Translations** (8 hours)
3. **Mobile Optimization** (4 hours)
4. **User Accounts System** (20 hours)
5. **SEO Optimization** (6 hours)

### 🌐 Production URL
https://aupropertyinvestmentmc.vercel.app

## 🛠️ Development Commands

### Essential Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality
npm start           # Start production server locally
```

### Testing Commands
```bash
./scripts/quick-test.sh                    # Manual testing checklist
node scripts/automated-health-check.js     # Automated health check
curl -I https://aupropertyinvestmentmc.vercel.app  # Production status
```

### Deployment Commands
```bash
vercel --prod       # Deploy to production
vercel ls           # List deployments
vercel logs         # View deployment logs
```

## 📱 Testing Strategy

### Manual Testing
1. Visit production URL
2. Complete FIRB calculation
3. Test investment analytics
4. Verify PDF download
5. Test mobile responsiveness
6. Check FAQ functionality

### Automated Testing
- Health check script monitors key metrics
- Build process validates code quality
- Linting ensures code standards

### Performance Testing
- Lighthouse audits (target: 90+ scores)
- Page load time monitoring
- Mobile usability verification

## 🎯 Session Planning

### Typical Session (2-4 hours)
1. **Start**: Run `./scripts/start-night-work.sh`
2. **Choose Focus**: Pick from priority tasks
3. **Develop**: Make incremental changes
4. **Test**: Verify functionality frequently
5. **Document**: Update progress and next steps

### Success Metrics
- **Technical**: Zero errors, 90+ Lighthouse scores
- **User Experience**: All features working smoothly
- **Business**: Improved user engagement

## 🔧 Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Check if port 3000 is in use
lsof -ti:3000

# Kill process if needed
kill -9 $(lsof -ti:3000)

# Restart
npm run dev
```

#### Build Failures
```bash
# Check for TypeScript errors
npm run build

# Fix linting issues
npm run lint --fix

# Clear cache and rebuild
rm -rf .next && npm run build
```

#### Production Issues
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Rollback if needed (via Vercel dashboard)
```

## 📚 Additional Resources

### Project Documentation
- `docs/` - Comprehensive project documentation
- `README.md` - Main project readme
- `package.json` - Dependencies and scripts

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🎊 Success Tips

### For Productive Sessions
1. **Start with health check** - Ensure everything is working
2. **Choose one focus area** - Don't try to do everything
3. **Test frequently** - Catch issues early
4. **Document progress** - Keep track of what's done
5. **Take breaks** - Maintain focus and energy

### For Long-term Success
1. **Polish before adding** - Complete current features well
2. **User feedback** - Test with real users regularly
3. **Performance monitoring** - Keep site fast and responsive
4. **SEO optimization** - Build organic traffic
5. **Iterate based on data** - Make data-driven decisions

---

**Remember**: You've built something amazing! These scripts help you maintain and grow it effectively. Focus on user value and quality over quantity.


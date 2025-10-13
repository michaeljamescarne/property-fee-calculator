'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calculator, Shield, FileText, CheckCircle, Clock, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import SampleReportModal from '@/components/SampleReportModal';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const [showSampleReport, setShowSampleReport] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-blue-100/20 [mask-image:radial-gradient(white,transparent_80%)]"></div>
        
        <div className="container mx-auto px-4 py-32 md:py-40 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                Trusted by 10,000+ foreign investors
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Calculate Your Australian Property Investment Costs
              </h1>
              <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
                Instant FIRB fee calculations, eligibility checks, and comprehensive investment analytics for foreign property buyers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Link href={`/${locale}/firb-calculator`}>
                    Start Free Calculation <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 rounded-xl"
                  onClick={() => setShowSampleReport(true)}
                >
                  View Sample Report
                </Button>
              </div>
              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Free to use
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Results in 30 seconds
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  No signup required
                </div>
              </div>
            </div>
            
            {/* Right: Product screenshot placeholder */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-white">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Calculator className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Calculator Interface Preview</p>
                    <p className="text-sm text-muted-foreground mt-2">(Screenshot to be added)</p>
                  </div>
                </div>
              </div>
              {/* Floating card showing key feature */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-lg shadow-lg p-4 animate-float hidden md:block">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Eligibility: Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Product Showcase */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Everything You Need to Invest with Confidence
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools and insights for foreign property investors in Australia
            </p>
          </div>

          {/* Feature 1: Instant Eligibility Check */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Feature 01
              </div>
              <h3 className="text-4xl font-bold mb-6">
                Know Your Eligibility Instantly
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Get immediate feedback on whether FIRB approval is required based on your citizenship status, visa type, and property details. No guesswork, just clear answers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Instant eligibility determination</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Clear explanations for all requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Identifies potential restrictions</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image 
                src="/images/eligibility-screenshot.png" 
                alt="Eligibility check result showing approval"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl border border-border hover-lift"
              />
            </div>
          </div>

          {/* Feature 2: Comprehensive Cost Breakdown */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1 relative">
              <Image 
                src="/images/cost-breakdown-screenshot.png" 
                alt="Detailed cost breakdown with charts"
                width={800}
                height={500}
                className="rounded-2xl shadow-2xl border border-border hover-lift"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Feature 02
              </div>
              <h3 className="text-4xl font-bold mb-6">
                Complete Cost Transparency
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                See every fee, tax, and cost associated with your property purchase. From FIRB application fees to stamp duty, ongoing costs, and more.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>FIRB fees calculated by property value</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>State-specific stamp duty & surcharges</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Ongoing costs like land tax & insurance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3: Investment Analytics */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Feature 03
              </div>
              <h3 className="text-4xl font-bold mb-6">
                Smart Investment Analytics
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Understand your investment potential with detailed ROI projections, cash flow analysis, and equity growth forecasts over 10+ years.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>10-year ROI & cash flow projections</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Equity growth & appreciation analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Risk assessment & sensitivity analysis</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image 
                src="/images/analytics-screenshot.png" 
                alt="Investment analytics with charts and projections"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl border border-border hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('howItWorks.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.step1')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step1Desc')}</p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.step2')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step2Desc')}</p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.step3')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fees Required Section */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            {t('feesRequired.title')}
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
            {t('feesRequired.subtitle')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* FIRB Fees Required */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-orange-800">{t('feesRequired.required.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.raw('feesRequired.required.items').map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="bg-orange-200 rounded-full p-1 mt-0.5">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                      <span className="text-orange-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Fees NOT Required */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-800">{t('feesRequired.notRequired.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.raw('feesRequired.notRequired.items').map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FIRB Approval Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            {t('firbApproval.title')}
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
            {t('firbApproval.subtitle')}
          </p>

          {/* What is FIRB */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-800">{t('firbApproval.whatIs.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 text-lg leading-relaxed">
                  {t('firbApproval.whatIs.content')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">{t('firbApproval.timeline.title')}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center border-green-200 bg-green-50/50">
                <CardContent className="pt-6">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Standard</h4>
                  <p className="text-green-700 text-sm">{t('firbApproval.timeline.standard')}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-orange-200 bg-orange-50/50">
                <CardContent className="pt-6">
                  <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-orange-800 mb-2">Expedited</h4>
                  <p className="text-orange-700 text-sm">{t('firbApproval.timeline.expedited')}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-800 mb-2">Complex</h4>
                  <p className="text-red-700 text-sm">{t('firbApproval.timeline.complex')}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Process Steps */}
          <div className="max-w-5xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">{t('firbApproval.process.title')}</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {t.raw('firbApproval.process.steps').map((step: { step: string; title: string; description: string }, index: number) => (
                <div key={index} className="text-center">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements and Penalties */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Key Requirements */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-800">{t('firbApproval.requirements.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.raw('firbApproval.requirements.items').map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Penalties */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-red-800">{t('firbApproval.penalties.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 font-medium mb-4">{t('firbApproval.penalties.warning')}</p>
                <ul className="space-y-3">
                  {t.raw('firbApproval.penalties.items').map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="bg-red-200 rounded-full p-1 mt-0.5">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      </div>
                      <span className="text-red-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary via-accent to-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_70%)]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>
          <Link href={`/${locale}/firb-calculator`}>
            <Button size="lg" variant="secondary" className="text-lg px-10 py-7 h-auto rounded-xl font-semibold shadow-2xl hover:scale-105 transition-transform">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Sample Report Modal */}
      <SampleReportModal isOpen={showSampleReport} onClose={() => setShowSampleReport(false)} />
    </main>
  );
}

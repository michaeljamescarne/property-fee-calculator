'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calculator, TrendingUp, Shield, FileText, CheckCircle, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t('description')}
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href={`/${locale}/firb-calculator`}>
              {t('cta.button')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">{t('learnMore')}</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calculator className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>{t('features.accurate')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('features.accurateDesc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>{t('features.fast')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('features.fastDesc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>{t('features.transparent')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('features.transparentDesc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
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
      <section className="bg-muted/50 py-20">
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
      <section className="py-20">
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link href={`/${locale}/calculator`}>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

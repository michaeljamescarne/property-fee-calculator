import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calculator, TrendingUp, Shield } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('HomePage');

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
            <Link href="/calculator">
              {t('cta')} <ArrowRight className="ml-2 h-4 w-4" />
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
    </main>
  );
}

import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Property Fee Calculator',
  description: 'Important disclaimer about the accuracy and limitations of our property investment calculator.',
};

export default function DisclaimerPage() {
  const t = useTranslations('Footer');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Important Notice</h2>
          <p className="text-yellow-700">
            {t('disclaimer.text')}
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Calculator Limitations</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>All calculations are estimates based on current rates and regulations</li>
              <li>FIRB fees, stamp duty rates, and foreign surcharges may change without notice</li>
              <li>Property-specific factors may affect actual costs</li>
              <li>Investment analytics are based on historical data and assumptions</li>
              <li>Market conditions and regulations are subject to change</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Professional Advice Required</h2>
            <p className="mb-4">
              This calculator is not a substitute for professional advice. We strongly recommend consulting with:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Licensed immigration lawyers for visa and FIRB matters</li>
              <li>Tax advisors for investment and tax implications</li>
              <li>Licensed conveyancers for property transactions</li>
              <li>Financial advisors for investment strategies</li>
              <li>Real estate agents for market-specific advice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Accuracy and Updates</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>We strive to keep information current but cannot guarantee accuracy</li>
              <li>Regulations and fees are updated regularly by government bodies</li>
              <li>Users should verify current requirements before making decisions</li>
              <li>Past performance does not guarantee future results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              Property Fee Calculator and its operators:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Are not affiliated with FIRB or any Australian government agency</li>
              <li>Do not provide financial, legal, or investment advice</li>
              <li>Are not liable for decisions made based on calculator results</li>
              <li>Cannot be held responsible for changes in regulations or fees</li>
              <li>Provide this service on an &quot;as is&quot; basis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have questions about this disclaimer or need clarification about our services, 
              please contact us at{' '}
              <a href="mailto:info@propertyfeecalculator.com" className="text-blue-600 hover:underline">
                info@propertyfeecalculator.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

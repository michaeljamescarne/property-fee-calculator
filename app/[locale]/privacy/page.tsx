import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Property Fee Calculator',
  description: 'Our privacy policy explaining how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  const t = useTranslations('Footer');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-700">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, such as:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Email address (for sending calculation results)</li>
              <li>Name (optional, for personalizing communications)</li>
              <li>Property details (for calculation purposes)</li>
              <li>Investment preferences and assumptions</li>
              <li>Authentication data (magic codes for login)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate property investment calculations</li>
              <li>Send calculation results via email</li>
              <li>Save your calculations for future reference</li>
              <li>Authenticate your account securely</li>
              <li>Improve our calculator and services</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To trusted service providers who assist in operating our website</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">We implement appropriate security measures to protect your personal information:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication using magic codes</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information</li>
              <li>Secure hosting infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="mb-4">We retain your information for as long as necessary to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our services</li>
            </ul>
            <p className="mt-4">
              You can request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt out of email communications</li>
              <li>Data portability</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Maintain your session and preferences</li>
              <li>Analyze website usage and performance</li>
              <li>Provide personalized experiences</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
            <p className="mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">We use third-party services that may collect information:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Resend:</strong> For sending emails (subject to their privacy policy)</li>
              <li><strong>Supabase:</strong> For data storage and authentication (subject to their privacy policy)</li>
              <li><strong>Vercel:</strong> For hosting and analytics (subject to their privacy policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">International Users</h2>
            <p className="mb-4">
              Our services are hosted in Australia and may involve data transfer to other countries. 
              By using our services, you consent to such transfers and processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, please contact us at{' '}
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

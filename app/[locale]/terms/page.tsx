import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Property Fee Calculator',
  description: 'Terms and conditions for using our property investment calculator service.',
};

export default function TermsPage() {

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-700">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using the Property Fee Calculator website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
            <p className="mb-4">Property Fee Calculator provides:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Online calculators for property investment cost estimation</li>
              <li>FIRB fee calculations and eligibility assessments</li>
              <li>Investment analytics and projections</li>
              <li>Email delivery of calculation results</li>
              <li>Account services for saving calculations</li>
            </ul>
            <p className="mt-4">
              These services are provided for informational purposes only and do not constitute financial, legal, or investment advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="mb-4">By using our service, you agree to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate and truthful information</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not use the service to violate any laws or regulations</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Account Services</h2>
            <p className="mb-4">Our account services include:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Passwordless authentication using magic codes</li>
              <li>Calculation saving and retrieval</li>
              <li>Personal dashboard for managing saved calculations</li>
              <li>Email notifications and updates</li>
            </ul>
            <p className="mt-4">
              You are responsible for maintaining the security of your account and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="mb-4">All content, features, and functionality of the service are owned by Property Fee Calculator and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
            <p>You may not reproduce, distribute, modify, or create derivative works of our content without express written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
            <p className="mb-4">You may not use our service:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p className="mb-4">We strive to provide continuous service availability, but we cannot guarantee:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Uninterrupted access to the service</li>
              <li>Error-free operation of all features</li>
              <li>Availability during maintenance periods</li>
              <li>Protection against all security threats</li>
            </ul>
            <p className="mt-4">
              We reserve the right to modify, suspend, or discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">To the fullest extent permitted by law, Property Fee Calculator shall not be liable for:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Damages resulting from use or inability to use the service</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Third-party conduct or content</li>
              <li>Investment decisions made based on our calculations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
            <p className="mb-4">The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We disclaim all warranties, express or implied, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
              <li>Warranties that the service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Property Fee Calculator, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising from your use of the service or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="mb-4">We may terminate or suspend your account and access to the service:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Immediately, without prior notice, for breach of these terms</li>
              <li>At our sole discretion, with reasonable notice</li>
              <li>Upon request from you</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the service will cease immediately, and we may delete your account and data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Australia, without regard to conflict of law principles. Any disputes arising from these terms or your use of the service shall be subject to the exclusive jurisdiction of the courts of Australia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have questions about these terms of service, please contact us at{' '}
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

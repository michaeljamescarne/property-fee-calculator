import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Property Fee Calculator",
  description:
    "Our privacy policy explaining how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-700">
            <strong>Effective Date:</strong> 2/12/2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Introduction and Commitment */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction and Commitment</h2>
            <p className="mb-4">
              Property Costs Pty Ltd or its operating entity (&quot;The Service,&quot;
              &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your
              personal information in compliance with the Privacy Act 1988 (Cth) and the Australian
              Privacy Principles (APPs). This policy sets out how we collect, use, store, and
              disclose your personal information.
            </p>
            <p>
              By using the PropertyCosts.com.au website or subscribing to our updates, you consent
              to the collection and use of your personal information as described in this policy.
            </p>
          </section>

          {/* Section 2: Collection of Personal Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Collection of Personal Information</h2>
            <p className="mb-4">
              We collect personal information that is reasonably necessary for the operation of our
              Service, specifically for providing general property cost estimations and distributing
              informational content.
            </p>

            <div className="space-y-4">
              {/* 2.1 Information You Provide Directly */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  2.1. Information You Provide Directly:
                </h3>
                <p className="mb-3">
                  This includes information you actively provide to us, such as:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Contact Information:</strong> Your email address, voluntarily provided
                    when you subscribe to &quot;Stay Updated on Property Investment Insights&quot;.
                  </li>
                  <li>
                    <strong>Correspondence:</strong> Records of any correspondence with us (e.g.,
                    through email or contact forms).
                  </li>
                </ul>
              </div>

              {/* 2.2 Information Collected Automatically */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  2.2. Information Collected Automatically (Non-Personal):
                </h3>
                <p className="mb-3">
                  When you use our website and calculator tools, we collect technical and analytical
                  information which is generally non-personal. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Calculator Inputs:</strong> Property location (e.g., postcode), property
                    value, loan terms, and other factual parameters entered into our calculation
                    tools. This data is typically aggregated and used for analytical purposes only,
                    and is not linked to your identity.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> IP addresses, browser types, device identifiers,
                    time spent on the Platform, and pages visited, collected via cookies and
                    analytics tools. This data is used to improve the functionality and performance
                    of the Service.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Purpose of Collection and Use */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Purpose of Collection and Use</h2>
            <p className="mb-4">
              We collect your personal information primarily for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>Service Delivery:</strong> To manage and fulfill your subscription request
                to receive &quot;Investment Insights&quot; and updates on &quot;FIRB updates, rate
                shifts, and new analytics tools&quot;.
              </li>
              <li>
                <strong>Communication:</strong> To respond to your inquiries and correspondence.
              </li>
              <li>
                <strong>Service Improvement:</strong> To analyze user interaction with our Platform,
                troubleshoot technical issues, and enhance calculator accuracy and site features.
              </li>
              <li>
                <strong>Compliance:</strong> To comply with our legal obligations, prevent fraud,
                and enforce our Terms of Service.
              </li>
            </ul>
          </section>

          {/* Section 4: Disclosure to Third Parties and Marketing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Disclosure to Third Parties and Marketing
            </h2>
            <p className="mb-4">
              We will not sell, trade, or rent your personal information to third parties without
              your explicit consent, except as required by law or as strictly necessary to fulfill
              the purposes outlined below.
            </p>

            <div className="space-y-4">
              {/* 4.1 Disclosure for Marketing and Referrals */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  4.1. Disclosure for Marketing and Referrals
                </h3>
                <p className="mb-3">
                  We are an unlicensed provider of general information, not an Australian Financial
                  Services (AFS) or Credit Licence (ACL) holder.
                </p>
                <p>
                  If The Service decides to enter into partnerships with third-party providers—such
                  as licensed financial advisers, mortgage brokers, or credit providers—for the
                  purpose of marketing or referring users who may benefit from professional advice,
                  we will only share your personal information (e.g., email address) if we obtain
                  your explicit, affirmative consent prior to the disclosure.
                </p>
              </div>

              {/* 4.2 Disclosure to Service Providers */}
              <div>
                <h3 className="text-xl font-semibold mb-3">4.2. Disclosure to Service Providers</h3>
                <p>
                  We may disclose aggregated, de-identified usage data (such as calculator inputs)
                  to third-party service providers (e.g., cloud hosting, IT support, analytics
                  providers) who assist us in operating the Platform and conducting our business.
                  These third parties are prohibited from using your personal information for any
                  purpose other than those directed by us.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Data Security and Storage */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security and Storage</h2>
            <p className="mb-4">
              We take reasonable steps to protect the personal information we hold from misuse,
              interference, and loss, as well as from unauthorized access, modification, or
              disclosure. We use a variety of security technologies and procedures to help protect
              your personal information, including security measures for the electronic storage of
              data, such as access controls and encryption.
            </p>
            <p>
              Your personal information is stored within Australia where possible. We retain your
              personal information only for as long as is necessary to fulfill the purposes outlined
              in this policy or to meet legal and regulatory requirements.
            </p>
          </section>

          {/* Section 6: Access, Correction, and Complaint Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Access, Correction, and Complaint Rights
            </h2>

            <div className="space-y-4">
              {/* 6.1 Access and Correction */}
              <div>
                <h3 className="text-xl font-semibold mb-3">6.1. Access and Correction</h3>
                <p>
                  You have the right to request access to the personal information we hold about you
                  and to request that we correct any inaccurate, incomplete, or outdated
                  information. To make such a request, please contact our Privacy Officer using the
                  details provided below.
                </p>
              </div>

              {/* 6.2 Unsubscribe */}
              <div>
                <h3 className="text-xl font-semibold mb-3">6.2. Unsubscribe</h3>
                <p>
                  You may unsubscribe from our email subscription list at any time using the
                  &quot;unsubscribe&quot; link provided in every email communication.
                </p>
              </div>

              {/* 6.3 Complaints */}
              <div>
                <h3 className="text-xl font-semibold mb-3">6.3. Complaints</h3>
                <p>
                  If you believe we have breached the Australian Privacy Principles, you have the
                  right to make a complaint. Please contact our Privacy Officer in the first
                  instance. We will investigate your complaint and attempt to resolve it within a
                  reasonable timeframe. If you are not satisfied with our response, you may refer
                  your complaint to the Office of the Australian Information Commissioner (OAIC).
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Contact Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Details</h2>
            <p className="mb-4">
              If you have any questions or concerns regarding this Privacy Policy or wish to make a
              complaint, please contact our Privacy Officer:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="mb-2">
                <strong>Privacy Officer</strong>
              </p>
              <p className="mb-2">Property Costs Pty Ltd</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@propertycosts.com.au"
                  className="text-blue-600 hover:underline"
                >
                  info@propertycosts.com.au
                </a>
              </p>
            </div>
          </section>

          {/* Section 8: Changes to this Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or legal obligations. We will post the revised policy on this page and
              update the &quot;Effective Date.&quot; We encourage you to review this policy
              periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

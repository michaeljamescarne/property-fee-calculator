import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Property Fee Calculator",
  description: "Terms and conditions for using our property investment calculator service.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-700">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement
              between you (the &quot;User&quot;) and Property Costs Pty Ltd or its operating entity
              (&quot;The Service,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              concerning your access to and use of the PropertyCosts.com.au website and any
              affiliated content, tools, calculators, or data (collectively, the
              &quot;Platform&quot;).
            </p>
            <p>
              By accessing, browsing, downloading, or using the Platform, you acknowledge that you
              have read, understood, and agree to be bound by all of these Terms. If you do not
              agree with all of these Terms, you are expressly prohibited from using the Platform
              and must discontinue use immediately.
            </p>
          </section>

          {/* Section 2: Critical Legal & Regulatory Disclaimers */}
          <section>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-red-800">
                2. Critical Legal &amp; Regulatory Disclaimers
              </h2>
              <p className="text-red-700 font-semibold text-lg mb-4">
                THIS SECTION CONTAINS MANDATORY STATUTORY WARNINGS. YOUR ATTENTION IS DIRECTLY DRAWN
                TO THESE LIMITATIONS.
              </p>
            </div>

            <div className="space-y-6">
              {/* 2.1 General Advice Warning */}
              <div>
                <h3 className="text-xl font-semibold mb-3">2.1. General Advice Warning (GAW)</h3>
                <p className="mb-3">
                  The information, estimates, and calculations provided on the Platform are for
                  general informational, educational, and illustrative purposes only and constitute
                  General Advice.
                </p>
                <p className="mb-3">
                  The General Advice provided has been prepared without taking into account your
                  personal objectives, financial situation, or needs.
                </p>
                <p>
                  Before acting on any information or making any investment, financial, credit, or
                  legal decisions, you must consider the appropriateness of the information having
                  regard to your own personal objectives, financial situation, and needs. You should
                  seek independent professional advice from a licensed financial planner, mortgage
                  broker, tax professional, or solicitor.
                </p>
              </div>

              {/* 2.2 No Financial or Credit Licence */}
              <div>
                <h3 className="text-xl font-semibold mb-3">2.2. No Financial or Credit Licence</h3>
                <p className="mb-3">
                  The Service and its operators do not hold an Australian Financial Services (AFS)
                  Licence issued by the Australian Securities and Investments Commission (ASIC).
                </p>
                <p>
                  The Service and its operators do not hold an Australian Credit Licence (ACL)
                  issued by ASIC under the National Consumer Credit Protection Act 2009 (Cth)
                  (NCCPA).
                </p>
              </div>

              {/* 2.3 Exclusion of Personal Advice and Credit Assistance */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  2.3. Exclusion of Personal Advice and Credit Assistance
                </h3>
                <p className="mb-3">
                  <strong>No Personal Advice:</strong> We do not provide Personal Financial Product
                  Advice as defined under section 766B(3) of the Corporations Act 2001 (Cth). We
                  have not considered, nor should a reasonable person expect us to have considered,
                  any aspect of your personal objectives, financial situation, or needs in providing
                  this Service. The data inputs requested by our tools are strictly limited to
                  generic, objective, and hypothetical parameters.
                </p>
                <p>
                  <strong>No Credit Assistance:</strong> The Service does not provide regulated
                  credit assistance under the NCCPA. This includes, but is not limited to,
                  suggesting that you apply for a particular credit contract with a particular
                  credit provider, or assisting you to apply for such a contract. Any content
                  concerning lending structures or interest rates is purely general and
                  informational.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Use of Calculation Tools and Data */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Use of Calculation Tools and Data</h2>

            <div className="space-y-4">
              {/* 3.1 Hypothetical Nature */}
              <div>
                <h3 className="text-xl font-semibold mb-3">3.1. Hypothetical Nature</h3>
                <p>
                  All results, calculations, projections, and outputs generated by the
                  Platform&apos;s tools are purely hypothetical, illustrative estimates, and
                  simulations. They are based on generic, average, assumed, or user-defined input
                  values and market data. They are not guaranteed and may not reflect actual costs
                  or outcomes.
                </p>
              </div>

              {/* 3.2 Valuation Disclaimer */}
              <div>
                <h3 className="text-xl font-semibold mb-3">3.2. Valuation Disclaimer</h3>
                <p>
                  Any property valuation estimates (e.g., Automated Valuation Models, or AVMs)
                  provided by the Platform are automated, approximate estimates only. These
                  estimates must not be relied upon as a professional property valuation or an
                  accurate representation of the market sale or rental value of the subject
                  property.
                </p>
              </div>

              {/* 3.3 External Data Reliance */}
              <div>
                <h3 className="text-xl font-semibold mb-3">3.3. External Data Reliance</h3>
                <p>
                  The Service may incorporate data, statistics, and information sourced from third
                  parties, including government agencies (such as the ATO or FIRB) or commercial
                  data providers. The Service provides no warranties as to the accuracy,
                  reliability, completeness, currency, or suitability of this third-party data. You
                  use such data entirely at your own risk.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: User Obligations and Prohibitions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Obligations and Prohibitions</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>Accuracy of Information:</strong> You agree to provide accurate and truthful
                information when using the Platform, including when registering for subscriptions or
                using calculators.
              </li>
              <li>
                <strong>Unlicensed Activity:</strong> You acknowledge that the content and estimates
                are not a substitute for professional legal, financial, or tax advice, and you agree
                not to represent or market the Service&apos;s outputs as such to any third party.
              </li>
              <li>
                <strong>Prohibited Use:</strong> You may not use the Platform for any unlawful
                purpose, or in any way that violates any applicable local, state, federal, or
                international laws (including consumer protection laws, financial services
                legislation, and privacy laws).
              </li>
            </ul>
          </section>

          {/* Section 5: Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
            <p className="mb-4">
              All content on the Platform, including all text, code, calculator logic, graphics,
              data compilations, and software, is the property of The Service and is protected by
              Australian and international copyright and trademark laws.
            </p>
            <p>
              You are granted a non-exclusive, non-transferable, revocable licence to access and use
              the Platform strictly in accordance with these Terms. You are prohibited from copying,
              reproducing, redistributing, or selling any content, data, or output generated by the
              Platform, except for reasonable personal, non-commercial use.
            </p>
          </section>

          {/* Section 6: Limitation of Liability and Indemnity */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Limitation of Liability and Indemnity
            </h2>

            <div className="space-y-4">
              {/* 6.1 Exclusion of Liability */}
              <div>
                <h3 className="text-xl font-semibold mb-3">6.1. Exclusion of Liability</h3>
                <p className="mb-3">
                  To the maximum extent permitted by law, The Service excludes all liability for any
                  loss, damage, or cost, howsoever arising (including without limitation, liability
                  in negligence), incurred by any person or entity in connection with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    The use of, or reliance upon, the estimates, calculations, or content provided
                    by the Platform.
                  </li>
                  <li>
                    Any investment, finance, or credit decision made in reliance on the
                    Platform&apos;s outputs.
                  </li>
                  <li>
                    Any errors, inaccuracies, delays, or omissions in the Platform&apos;s operation
                    or its external data feeds.
                  </li>
                </ul>
              </div>

              {/* 6.2 Australian Consumer Law */}
              <div>
                <h3 className="text-xl font-semibold mb-3">6.2. Australian Consumer Law (ACL)</h3>
                <p>
                  Nothing in these Terms excludes, restricts, or modifies any right or remedy, or
                  any guarantee, warranty, or other term or condition implied or imposed by the
                  Australian Consumer Law or any other Australian legislation which cannot lawfully
                  be excluded or limited. If a term is implied by law, The Service&apos;s liability
                  for breach is limited, at its option, to the resupply of the services or the cost
                  of resupplying the services.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: General Provisions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. General Provisions</h2>

            <div className="space-y-4">
              {/* Governing Law */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Governing Law</h3>
                <p>
                  These Terms are governed by the laws of the State of Victoria, Australia, and you
                  irrevocably and unconditionally submit to the non-exclusive jurisdiction of the
                  courts of Victoria.
                </p>
              </div>

              {/* Severability */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Severability</h3>
                <p>
                  If any part of these Terms is found to be void, invalid, or unenforceable by a
                  court of competent jurisdiction, that part shall be read down to the extent
                  necessary to make it valid and enforceable, and the remainder of the Terms shall
                  remain in full force and effect.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Changes to Terms</h3>
                <p>
                  We reserve the right to revise these Terms at any time. Any changes will be posted
                  on this page with an updated &quot;Effective Date.&quot; Your continued use of the
                  Platform after the effective date of the revised Terms constitutes your acceptance
                  of the new Terms.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

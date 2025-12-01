import { useTranslations } from "next-intl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Property Fee Calculator",
  description:
    "Important disclaimer about the accuracy and limitations of our property investment calculator.",
};

export default function DisclaimerPage() {
  const t = useTranslations("Footer");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Important Notice</h2>
          <p className="text-yellow-700">{t("disclaimerText")}</p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Scope of Service */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Scope of Service: Factual Information &amp; General Advice Warning
            </h2>
            <p className="mb-4">
              This platform, PropertyCosts.com.au (The Service), provides cost estimates,
              calculations, general information, and data regarding property ownership, acquisition,
              and holding costs in Australia.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">A. General Advice Warning (GAW)</h3>
                <p className="mb-3">
                  The information, estimates, and calculations provided by The Service constitute
                  General Advice only. It is intended for general informational, educational, and
                  illustrative purposes.
                </p>
                <p className="mb-3">
                  The information is prepared without taking into account your personal objectives,
                  financial situation, or needs.
                </p>
                <p className="mb-3">
                  Before making any investment, financial, credit, or legal decisions based on the
                  information provided by The Service, you must consider the appropriateness of the
                  information having regard to your own personal objectives, financial situation,
                  and needs. You should also seek independent professional advice from a qualified
                  financial adviser, tax consultant, or legal practitioner.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">B. Non-Financial Product Advice</h3>
                <p className="mb-3">
                  The Service does not provide Personal Financial Product Advice as defined under
                  the Corporations Act 2001 (Cth). We have not considered, nor should a reasonable
                  person expect us to have considered, any aspect of your personal objectives,
                  financial situation, or needs in providing this information or these calculations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Licensing Status */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Licensing Status and Credit Assistance Disclaimer
            </h2>
            <p className="mb-4">The Service and its operators:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Do not hold an Australian Financial Services (AFS) Licence issued by the Australian
                Securities and Investments Commission (ASIC).
              </li>
              <li>
                Are not authorised to provide, and do not provide, regulated financial product
                advice concerning securities, derivatives, superannuation, insurance, or any other
                financial product regulated under the Corporations Act.
              </li>
              <li>
                Do not hold an Australian Credit Licence (ACL) issued by ASIC under the National
                Consumer Credit Protection Act 2009 (Cth) (NCCPA).
              </li>
              <li>
                Do not provide regulated credit assistance. This includes, but is not limited to,
                suggesting that you apply for a particular credit contract with a particular credit
                provider, or assisting you to apply for a particular credit contract. Any reference
                to interest rates, loan repayments, or lending structures are generic, hypothetical
                market data points only.
              </li>
            </ul>
          </section>

          {/* Section 3: Calculator Limitations */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Calculator and Data Accuracy Limitations
            </h2>
            <p className="mb-4">
              All numerical calculations, forecasts, and estimates provided by the tools within The
              Service are provided for illustrative purposes only.
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>Hypothetical Basis:</strong> Results are based on generic, user-entered, or
                assumed inputs, and market averages, and are not specific to any actual property or
                loan product.
              </li>
              <li>
                <strong>Not a Valuation:</strong> Any estimation of property value, rental yield, or
                market price is an automated valuation model (AVM) estimate and must not be relied
                upon as a professional valuation or an accurate representation of the market sale or
                rental value of the subject property.
              </li>
              <li>
                <strong>External Data:</strong> We may rely on external or third-party data,
                including data from government sources, which we do not verify independently. The
                Service provides no warranties as to the accuracy, reliability, completeness,
                currency, or suitability of this third-party data.
              </li>
            </ul>
          </section>

          {/* Section 4: General Exclusion of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. General Exclusion of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, The Service (including its employees, agents,
              and related entities) excludes all liability for any loss, damage, or cost, howsoever
              arising (including without limitation, liability in negligence), incurred by any
              person or entity.
            </p>
            <p className="mb-4">
              This exclusion of liability applies whether the loss is suffered as a result of:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Reliance on the accuracy, currency, or completeness of the information or
                calculation results provided by The Service.
              </li>
              <li>
                Decisions made in relation to any financial product or credit contract based on the
                information provided by The Service.
              </li>
            </ul>
            <p className="font-semibold">Your use of The Service is entirely at your own risk.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

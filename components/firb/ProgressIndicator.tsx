/**
 * Progress Indicator Component
 * Shows the current step in the FIRB calculator wizard
 */

"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export type Step = "citizenship" | "property" | "financial" | "review" | "results";

interface ProgressIndicatorProps {
  currentStep: Step;
  completedSteps: Step[];
}

const steps: Step[] = ["citizenship", "property", "financial", "review", "results"];

export default function ProgressIndicator({ currentStep, completedSteps }: ProgressIndicatorProps) {
  const t = useTranslations("FIRBCalculator.progress");

  const getStepIndex = (step: Step) => steps.indexOf(step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between px-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = step === currentStep;
            const isPast = index < currentIndex;

            return (
              <div key={step} className="flex flex-1 items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all shadow-sm
                      ${isCurrent ? "border-blue-600 bg-blue-600 text-white scale-110" : ""}
                      ${isPast || isCompleted ? "border-blue-600 bg-blue-600 text-white" : ""}
                      ${!isCurrent && !isPast && !isCompleted ? "border-gray-200 bg-gray-100 text-gray-500" : ""}
                    `}
                  >
                    {isPast || isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-medium
                      ${isCurrent ? "text-blue-600" : ""}
                      ${isPast || isCompleted ? "text-blue-600" : ""}
                      ${!isCurrent && !isPast && !isCompleted ? "text-gray-500" : ""}
                    `}
                  >
                    {t(step)}
                  </span>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 mt-[-2rem]">
                    <div
                      className={`
                        h-full transition-all
                        ${isPast || isCompleted ? "bg-blue-600" : "bg-gray-200"}
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

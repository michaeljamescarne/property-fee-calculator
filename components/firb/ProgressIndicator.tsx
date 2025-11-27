/**
 * Progress Indicator Component
 * Shows the current step in the FIRB calculator wizard
 */

'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type Step = 'citizenship' | 'property' | 'financial' | 'review' | 'results';

interface ProgressIndicatorProps {
  currentStep: Step;
  completedSteps: Step[];
}

const steps: Step[] = ['citizenship', 'property', 'financial', 'review', 'results'];

export default function ProgressIndicator({ currentStep, completedSteps }: ProgressIndicatorProps) {
  const t = useTranslations('FIRBCalculator.progress');

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
                      ${isCurrent ? 'border-primary bg-primary text-primary-foreground scale-110' : ''}
                      ${isPast || isCompleted ? 'border-primary bg-primary text-primary-foreground' : ''}
                      ${!isCurrent && !isPast && !isCompleted ? 'border-border bg-muted text-muted-foreground' : ''}
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
                      ${isCurrent ? 'text-primary' : ''}
                      ${isPast || isCompleted ? 'text-primary' : ''}
                      ${!isCurrent && !isPast && !isCompleted ? 'text-muted-foreground' : ''}
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
                        ${isPast || isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'}
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


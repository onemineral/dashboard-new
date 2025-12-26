import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  /**
   * Total number of steps in the onboarding process
   */
  totalSteps: number;
  /**
   * Current step (1-indexed)
   */
  currentStep: number;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Height of each progress bar
   */
  barHeight?: number;
  /**
   * Gap between bars (in pixels)
   */
  gap?: number;
}

/**
 * OnboardingProgress Component
 * 
 * A multi-bar progress indicator for onboarding flows.
 * Displays a series of horizontal bars that fill as steps are completed.
 * 
 * @example
 * ```tsx
 * <OnboardingProgress totalSteps={5} currentStep={2} />
 * ```
 */
export const OnboardingProgress: React.FC<ProgressProps> = ({
  totalSteps,
  currentStep,
  className,
  barHeight = 4,
  gap = 8,
}) => {
  // Ensure currentStep is within valid range
  const normalizedStep = Math.max(0, Math.min(currentStep, totalSteps));

  return (
    <div
      className={cn("flex w-full items-center", className)}
      style={{ gap: `${gap}px` }}
      role="progressbar"
      aria-valuenow={normalizedStep}
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-label={`Step ${normalizedStep} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber <= normalizedStep;

        return (
          <div
            key={stepNumber}
            className={cn(
              "flex-1 rounded-full transition-all duration-300 ease-in-out",
              isCompleted
                ? "bg-foreground"
                : "bg-foreground/10"
            )}
            style={{ height: `${barHeight}px` }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

export default OnboardingProgress;
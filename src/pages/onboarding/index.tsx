import MasonryImages from "@/pages/onboarding/components/masonry-images.tsx";
import {useState, useRef, useEffect, useContext} from "react";
import {OnboardingSteps} from "@/pages/onboarding/types.ts";
import {AppContext} from "@/contexts/app-context.tsx";

export type OnboardingStepProps = {
    onSave: () => void;
    onBack: () => void;
    currentStep: number;
    totalSteps: number;
}

export function Onboarding() {
    const { onboarding } = useContext(AppContext);
    const [currentStep, setCurrentStep] = useState(OnboardingSteps.findIndex((o) => !onboarding[o.key]));
    const [direction, setDirection] = useState<'enter' | 'exit'>('enter');
    const contentRef = useRef<HTMLDivElement>(null);

    const Step = OnboardingSteps[currentStep].component;

    const handleStepChange = () => {
        setDirection('exit');
        setTimeout(() => {
            setCurrentStep(currentStep + 1);
            contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
            setDirection('enter');
        }, 300);
    };

    const handleBack = () => {
        setDirection('exit');
        setTimeout(() => {
            setCurrentStep(currentStep - 1);
            contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
            setDirection('enter');
        }, 300);
    };

    useEffect(() => {
        // Trigger enter animation after step change
        if (direction === 'enter') {
            // Small delay to ensure DOM has updated
            requestAnimationFrame(() => {
                setDirection('enter');
            });
        }
    }, [currentStep]);

    const animationClasses =
        direction === 'exit'
            ? 'opacity-0'
            : 'opacity-100';

    return <div className={'bg-background h-dvh max-h-dvh grid grid-cols-1 lg:grid-cols-2 items-center'}>
        <div ref={contentRef} className={'max-h-dvh overflow-y-auto flex justify-center scrollbar-thin'}>
            <div className={'max-w-xl items-start flex flex-col w-full px-4 py-10'}>
                <img src="/logo.svg" alt="RentalWise" className="h-6 mb-6"/>
                <div
                    key={currentStep}
                    className={`w-full transition-all duration-300 ${animationClasses}`}
                    style={{ transitionProperty: 'opacity, transform' }}
                >
                    <Step onSave={handleStepChange} currentStep={currentStep + 1} totalSteps={5} onBack={handleBack} />
                </div>
                <div className={'h-10'}>&nbsp;</div>
            </div>


        </div>
        <MasonryImages />
    </div>;
}
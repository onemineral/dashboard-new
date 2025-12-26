import { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useMutation } from "@tanstack/react-query";
import OnboardingProgress from "@/pages/onboarding/components/progress.tsx";
import { Button } from "@/components/ui/button.tsx";
import { OnboardingStepProps } from "@/pages/onboarding/index.tsx";
import api from "@/lib/api.ts";
import {Airbnb} from "@sdk/generated";
import AirbnbConnectPrompt from "@/pages/onboarding/components/airbnb-connect-prompt.tsx";
import AirbnbPropertiesList from "@/pages/onboarding/components/airbnb-properties-list.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function OnboardingAirbnbConnect(props: OnboardingStepProps) {
  const [channel, setChannel] = useState<Airbnb|undefined>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Check connection status
  const checkConnection = useMutation({
    mutationFn: async () => {
      const channel: Airbnb|undefined = (await api.channel.query({
          where: {
              conditions: [
                  {field: 'status', in: ['enabled']},
                  {field: 'provider', eq: 'airbnb'}
              ]
          }
      })).response.data?.[0];

      setChannel(channel);
      setIsInitialLoad(false);
      
      return channel;
    },
    onError: (error) => {
      console.error('Failed to check Airbnb connection:', error);
      setIsInitialLoad(false);
    },
  });

  // Check connection on mount (handles page refresh)
  useEffect(() => {
    checkConnection.mutate();
  }, []);

  const handleSkip = () => {
    props.onSave();
  };

  return (
    <>
      <h1 className="text-xl flex-1 font-medium text-balance">
        <FormattedMessage
          defaultMessage="Connect to Airbnb"
          description="Airbnb connection page title"
        />
      </h1>
      <p className="text-muted-foreground">
        <FormattedMessage
          defaultMessage="Link your Airbnb account to sync your properties and reservations automatically."
          description="Airbnb connection page description"
        />
      </p>

      <OnboardingProgress currentStep={props.currentStep} totalSteps={props.totalSteps} className="my-8" />

      {isInitialLoad && checkConnection.isPending ? (
        <div className="w-full space-y-6 p-10 rounded-lg animate-in fade-in duration-500">
          {/* Airbnb Logo Area Skeleton */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-[42px] w-[120px]" />
            
            <div className="space-y-2 w-full max-w-md">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
            </div>
          </div>

          {/* Benefits List Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-5 shrink-0 mt-0.5 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>

          {/* Connect Button Skeleton */}
          <Skeleton className="h-11 w-full rounded-md" />

          {/* Help Text Skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-3 w-full mx-auto" />
            <Skeleton className="h-3 w-4/5 mx-auto" />
          </div>
        </div>
      ) : channel ? (
        <AirbnbPropertiesList channel={channel} onSave={props.onSave} />
      ) : (
        <AirbnbConnectPrompt
          isPending={checkConnection.isPending}
          onConnected={() => checkConnection.mutate()}
        />
      )}

        {/* Action Buttons - Only show Skip button when no channel is connected */}
        {!channel && (
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-6">
                <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={handleSkip}
                    disabled={checkConnection.isPending}
                >
                    <FormattedMessage
                        defaultMessage="Skip for now"
                        description="Skip button label"
                    />
                </Button>
            </div>
        )}
    </>
  );
}
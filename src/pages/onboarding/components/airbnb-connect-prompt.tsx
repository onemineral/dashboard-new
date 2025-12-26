import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@/components/ui/button.tsx";
import { Check, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { config } from "@/config.ts";

// Popup window dimensions
const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 600;

interface ConnectionStatus {
  isConnected: boolean;
  message?: string;
}

interface AirbnbConnectPromptProps {
  isPending: boolean;
  onConnected: () => void;
}

export default function AirbnbConnectPrompt({
  isPending,
  onConnected,
}: AirbnbConnectPromptProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);

  // Open OAuth popup
  const handleConnectClick = () => {
    // Calculate popup position (centered)
    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;

    const oauthUrl = config.appUrl + "/rest/airbnb/redirect";

    // Open popup window
    const popup = window.open(
      oauthUrl,
      "airbnb-oauth",
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    if (popup) {
      setIsPopupOpen(true);
      
      // Poll to detect when popup closes
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          setIsPopupOpen(false);
          // Trigger the onConnected callback to check connection status
          onConnected();
        }
      }, 200);
    } else {
      // Popup was blocked
      setConnectionStatus({
        isConnected: false,
        message: "Popup was blocked. Please allow popups for this site and try again."
      });
    }
  };
  return (
    <div className="w-full space-y-6 bg-accent p-10 rounded-lg">
      {/* Airbnb Logo/Icon Area */}
      <div className="flex flex-col items-center text-center space-y-4">
        <img src={'https://app.rentalwise.io/public/images/channels/airbnb/logo.svg'} width={120} alt="Airbnb" />

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground max-w-md">
            <FormattedMessage
              defaultMessage="Connect your Airbnb account to automatically import properties, sync calendars, and manage bookings in one place."
              description="Airbnb integration explanation"
            />
          </p>
        </div>
      </div>

      {/* Benefits List */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Check className="size-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm">
            <FormattedMessage
              defaultMessage="Automatically sync property listings and details"
              description="Benefit of syncing property listings"
            />
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="size-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm">
            <FormattedMessage
              defaultMessage="Real-time availability and rates synchronization"
              description="Benefit of calendar sync"
            />
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="size-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm">
            <FormattedMessage
              defaultMessage="Import and manage reservations seamlessly"
              description="Benefit of reservation management"
            />
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="size-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm">
            <FormattedMessage
              defaultMessage="Manage messaging, inquiries, pre-approvals and special offers"
              description="Benefit of messaging and inquiries management"
            />
          </span>
        </div>
      </div>

      {/* Connection Status */}
      {connectionStatus && (
        <div
          className={cn(
            "rounded-lg p-4 flex items-start gap-3",
            connectionStatus.isConnected
              ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
              : "bg-destructive/10 border border-destructive/20"
          )}
        >
          {connectionStatus.isConnected ? (
            <Check className="size-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          )}
          <p
            className={cn(
              "text-sm",
              connectionStatus.isConnected
                ? "text-green-700 dark:text-green-400"
                : "text-destructive"
            )}
          >
            {connectionStatus.message}
          </p>
        </div>
      )}

      {/* Connect Button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleConnectClick}
        disabled={isPopupOpen || isPending}
      >
        {isPopupOpen ? (
          <FormattedMessage
            defaultMessage="Waiting for authorization..."
            description="Waiting for OAuth authorization"
          />
        ) : isPending ? (
          <FormattedMessage
            defaultMessage="Verifying connection..."
            description="Verifying connection status"
          />
        ) : (
          <>
            <ExternalLink className="size-4 mr-2" />
            <FormattedMessage
              defaultMessage="Connect to Airbnb"
              description="Connect button label"
            />
          </>
        )}
      </Button>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        <FormattedMessage
          defaultMessage="By connecting, you authorize this application to access your Airbnb account data. You can disconnect at any time from settings."
          description="Authorization disclaimer"
        />
      </p>
    </div>
  );
}
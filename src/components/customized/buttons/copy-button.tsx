"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import React from "react";

/**
 * CopyButton Component
 *
 * Renders a styled button with a value and a copy-to-clipboard action.
 * When the button is clicked, the provided value is copied to the user's clipboard.
 * Displays a checkmark icon for a short duration after copying to indicate success.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.value - The string value to display and copy. (Required)
 *
 * @example
 * // Basic usage
 * <CopyButton value="my-secret-token" />
 *
 * @notes
 * - The component uses the browser's Clipboard API; it will not work in environments where `navigator.clipboard` is unavailable.
 * - The value is truncated visually if too long, but the full value is copied.
 * - The copy feedback duration can be customized by modifying the `timeout` in the `useCopyToClipboard` hook.
 * - For accessibility, consider providing additional context or aria-labels if used in complex UIs.
 */
const CopyButton = ({value}: {value: string}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="flex items-center border rounded-full overflow-hidden p-1">
      <p className="pl-4 pr-2 max-w-[25ch] text-ellipsis overflow-hidden whitespace-nowrap text-sm">
        {value}
      </p>
      <Button
        size="icon"
        className="rounded-full"
        onClick={() => copyToClipboard(value)}
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

// @hooks/use-copy-to-clipboard.tsx
/**
 * useCopyToClipboard Hook
 *
 * Provides clipboard copy functionality with feedback state.
 *
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.timeout=2000] - Duration in ms to show the "copied" state.
 * @param {() => void} [options.onCopy] - Optional callback invoked after a successful copy.
 * @returns {{ isCopied: boolean, copyToClipboard: (value: string) => void }}
 *
 * @example
 * const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
 * // ...
 * <button onClick={() => copyToClipboard('text')}>{isCopied ? 'Copied!' : 'Copy'}</button>
 *
 * @notes
 * - Returns `isCopied` (boolean) and `copyToClipboard` (function).
 * - Handles clipboard API errors gracefully.
 * - Designed for use in client-side React components.
 */
function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: {
  timeout?: number;
  onCopy?: () => void;
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      if (onCopy) {
        onCopy();
      }

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }, console.error);
  };

  return { isCopied, copyToClipboard };
}

export default CopyButton;

import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { ReactNode, useState } from "react";
import { FormItem } from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { useFilter } from "@/components/application/filters/hooks/use-filter";
import { Plus } from "lucide-react";
import { FilterRemoveButton } from "@/components/application/filters/filters";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { FormattedMessage } from "react-intl";

type BooleanRadioFilterProps = {
  field: string;
  trueLabel?: string | ReactNode;
  falseLabel?: string | ReactNode;
};

const BooleanRadioFilter = ({
  field,
  trueLabel = <FormattedMessage defaultMessage="Yes" description="Boolean filter true label" />,
  falseLabel = <FormattedMessage defaultMessage="No" description="Boolean filter false label" />,
}: BooleanRadioFilterProps) => {
  const { remove, settings, set, selection } = useFilter();
  // The value is expected to be a boolean or undefined
  const value = selection?.value;
  // Internal value is a string: "true", "false", or undefined
  const [internalValue, setInternalValue] = useState<boolean|undefined>(value);
  const [open, setOpen] = useState<boolean>(!settings.featured && selection?.value === null);

  const updateValue = () => {
    if (internalValue !== undefined) {
      set(internalValue, {
        where: {
          conditions: [
            {
              field,
              eq: internalValue,
            },
          ],
        },
      });
    } else {
      remove();
    }
  };

  return (
    <div
      className={cn(
        "transition-all bg-background flex items-center group border shadow-xs border-input rounded-lg hover:bg-accent",
        {
          "border-dashed": selection?.value === undefined,
        }
      )}
    >
      <Popover
        open={open}
        defaultOpen={open}
        modal
        onOpenChange={(o) => {
          setOpen(!open);
          if (o) return;
          updateValue();
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "border-0 rounded-xl group-hover:bg-accent h-8 pr-0 focus-visible:ring-0",
              {
                "text-gray-700": !selection?.body,
              }
            )}
          >
            <span className={"flex items-center gap-2"}>
              {settings.label}
              {typeof value === "boolean" ? (
                <>
                  <Separator orientation="vertical" className="h-4!" />
                  <Badge variant="default" className="lg:hidden">
                    1
                  </Badge>
                  <div className="hidden gap-1 lg:flex text-emerald-700">
                    {value === true ? trueLabel : falseLabel}
                  </div>
                </>
              ) : (
                <Plus className={"mr-3 size-3"} />
              )}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn({
            "ml-5": typeof value === "boolean",
          })}
        >
          <FormItem>
            <RadioGroup
              value={internalValue !== undefined ? (internalValue ? 'true' : 'false') : undefined }
              onValueChange={(value: string) => setInternalValue(value === 'true')}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id={`radio-${field}-true`} />
                <label htmlFor={`radio-${field}-true`} className="cursor-pointer select-none">
                  {trueLabel}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id={`radio-${field}-false`} />
                <label htmlFor={`radio-${field}-false`} className="cursor-pointer select-none">
                  {falseLabel}
                </label>
              </div>
            </RadioGroup>
          </FormItem>

          <Button
            variant={"default"}
            className={"w-full mt-4"}
            onClick={() => {
              updateValue();
              setOpen(!open);
            }}
          >
            <FormattedMessage defaultMessage="Apply" description="Button to apply the boolean filter selection" />
          </Button>
        </PopoverContent>
      </Popover>
      <FilterRemoveButton onClick={remove} />
    </div>
  );
};

export default BooleanRadioFilter;
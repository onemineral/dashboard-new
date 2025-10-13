import {Button} from "@/components/ui/button.tsx";
import {useForm, Controller} from "react-hook-form";
import {Form} from "@/components/ui/form.tsx";
import {Page, PageContent, PageDescription, PageFooter, PageHeader, PageTitle} from "@/components/application/page";
import {InputWrapper} from "@/components/application/inputs/input-wrapper.tsx";
import {DateRangePicker, DateRangeValue} from "@/components/application/inputs/daterange-picker.tsx";
import useWobbleAnimate from "@/hooks/use-wobble-animate.ts";
import { toast } from "sonner";
import {useNavigateBack} from "@/hooks/use-navigate-back.ts";
import {useState} from "react";

export default function UpdatePropertyCalendar() {
    const {ref, wobble} = useWobbleAnimate();
    const back = useNavigateBack('/pms/properties');

    const form = useForm<{
        daterange: DateRangeValue | null;
    }>({
        defaultValues: {
            daterange: null
        }
    });

    const { isDirty } = form.formState;

    const [isSaving, setIsSaving] = useState(false);

    function onSubmit(data: any) {
        toast.success("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-foreground p-4">
          <code className="text-background">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        });
    }


    return <Page modal size="md" validateClose={() => {
        if(isDirty) {
            wobble();
            return false;
        }
        return true;
    }}>
        <PageHeader>
                <PageTitle>
                    Are you absolutely sure?
                </PageTitle>
                <PageDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </PageDescription>
        </PageHeader>

        <PageContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className={'pt-6'}>
                        <Controller
                            control={form.control}
                            name="daterange"
                            rules={{
                                required: "Date range is required"
                            }}
                            render={({field, fieldState}) => (
                                <InputWrapper
                                    label="Date Range"
                                    required
                                    description="Select the start and end dates for the calendar update."
                                    error={fieldState.error?.message}
                                >
                                    <DateRangePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        minDate={new Date()}
                                        placeholder="Select date range"
                                        error={!!fieldState.error}
                                        errorMessage={fieldState.error?.message}
                                        numberOfMonths={2}
                                    />
                                </InputWrapper>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </PageContent>

        <PageFooter>
            <div className={'flex items-center justify-end space-x-4'}>
                <Button variant={'ghost'} onClick={back}>Cancel</Button>
                <Button variant={'default'} size={'lg'} disabled={isSaving} ref={ref} onClick={() => {
                    setIsSaving(true);
                    setTimeout(() => {
                        setIsSaving(false);
                        back();
                    }, 2000);
                }}>{isSaving ? 'Saving...' : 'Save'}</Button>
            </div>
        </PageFooter>
    </Page>
}
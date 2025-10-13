import { useForm, Controller } from "react-hook-form";
import { ResourceInput } from "@/components/application/inputs/resource-input";
import {
  Page,
  PageContent,
  PageHeader,
  PageHeaderContainer,
  PageTitle,
  PageDescription,
} from "@/components/application/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Test fields for the property resource
 */
const TEST_FIELDS = ["name", "internal_name", 'description', "headline", "bedrooms", 'status', 'bathroom_shared', 'bathrooms', 'toilets'];

/**
 * Form data interface
 */
interface PropertyFormData {
  name: string;
  internal_name: string;
  headline: string;
  bedrooms: number | "";
}

/**
 * ResourceInputs Test Page
 *
 * Demonstrates the ResourceInput component with react-hook-form integration
 */
export default function ResourceInputsPage() {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: {
      name: "",
      internal_name: "",
      headline: "",
      bedrooms: "",
    },
  });

  // Watch all form values for debug display
  const formData = watch();

  // Handle form submission
  const onSubmit = (data: PropertyFormData) => {
    alert("Form is valid! Data: " + JSON.stringify(data, null, 2));
  };

  return (
    <Page>
      <PageHeaderContainer>
        <PageHeader>
          <PageTitle>Resource Input Component Test</PageTitle>
          <PageDescription>
            Testing the ResourceInput component with react-hook-form integration
          </PageDescription>
        </PageHeader>
      </PageHeaderContainer>

      <PageContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 max-w-2xl">
            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle>Property Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {TEST_FIELDS.map((field) => (
                  <Controller
                    key={field}
                    name={field as keyof PropertyFormData}
                    control={control}
                    rules={{
                      required: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")} is required`,
                      ...(field === "bedrooms" && {
                        validate: (value) =>
                          (typeof value === "number" && value > 0) ||
                          "Number of bedrooms must be greater than 0",
                      }),
                    }}
                    render={({ field: controllerField, fieldState }) => (
                      <ResourceInput
                        resource="property"
                        field={field}
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        onBlur={controllerField.onBlur}
                        error={fieldState.error?.message}
                        data-testid={`property-${field}`}
                      />
                    )}
                  />
                ))}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit">Validate</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Debug Card */}
            <Card>
              <CardHeader>
                <CardTitle>Form State (Debug)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
                  {JSON.stringify(
                    {
                      formData,
                      errors: Object.keys(errors).reduce(
                        (acc, key) => ({
                          ...acc,
                          [key]: errors[key as keyof PropertyFormData]?.message,
                        }),
                        {}
                      ),
                    },
                    null,
                    2
                  )}
                </pre>
              </CardContent>
            </Card>
          </div>
        </form>
      </PageContent>
    </Page>
  );
}
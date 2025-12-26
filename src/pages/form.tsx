import { useForm, Controller } from "react-hook-form";
import { Page, PageHeader, PageTitle, PageContent, PageHeaderContainer, PageDescription } from "@/components/application/page";
import { MultiLanguageTextarea } from "@/components/application/inputs/multi-language-textarea";
import { MultiLanguageInput } from "@/components/application/inputs/multi-language-input";
import { InputField } from "@/components/application/inputs/input-field.tsx";
import { DateRangePicker, DateRangeValue } from "@/components/application/inputs/daterange-picker";
import { AccountSelect } from "@/components/application/inputs/account-select";
import { PropertySelect } from "@/components/application/inputs/property-select";
import { PercentageInput } from "@/components/application/inputs/percentage-input";
import { PhoneInput } from "@/components/application/inputs/phone";
import { Textarea } from "@/components/application/inputs/textarea";
import { TextareaTiptap } from "@/components/application/inputs/textarea-tiptap";
import { TimePicker, TimeValue } from "@/components/application/inputs/time";
import { GeoLocationInput, CoordinateValue } from "@/components/application/inputs/geolocation-input";
import { ColorPicker } from "@/components/application/inputs/color-picker";
import { FileUpload } from "@/components/application/inputs/upload/file-upload";
import { MultiFileUpload } from "@/components/application/inputs/upload/multi-file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Account, Booking, Property} from "@onemineral/pms-js-sdk";
import {MultiLanguageValue} from "@/components/application/inputs/language-tabs.tsx";

interface FormData {
  // Text inputs
  email: string;
  firstName: string;
  lastName: string;

  notes: string|null;
  
  // Multi-language
  productName: MultiLanguageValue;
  description: MultiLanguageValue;
  
  // Date/Time
  dateRange: DateRangeValue | null;
  appointmentTime: TimeValue | null;
  
  // Select inputs
  account: Account | null;
  property: Property | null;
  booking: Booking | null;
  
  // Percentage
  commission: number | null;
  
  // Phone
  phone: string | null;
  
  // Textarea
  bio: string;
  
  // Geolocation
  location: CoordinateValue | null;
  
  // Color
  brandColor: string;
  
  // File upload
  document: File | null;
  profileImage: File | null;
  attachments: File[];
}

export default function FormPage() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      productName: { en: "Modern Laptop", es: "Portátil Moderno" },
      description: { en: "Product description in English", es: null },
      notes: null,
      dateRange: null,
      appointmentTime: null,
      account: null,
      booking: null,
      property: null,
      location: null,
      commission: 15,
      phone: null,
      bio: "",
      brandColor: "#3b82f6",
      document: null,
      profileImage: null,
      attachments: [],
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert(JSON.stringify({
      ...data,
      document: data.document ? { name: data.document.name, size: data.document.size } : null,
      profileImage: data.profileImage ? { name: data.profileImage.name, size: data.profileImage.size } : null,
      attachments: data.attachments.map(file => ({ name: file.name, size: file.size })),
    }, null, 2));
  };

  // Mock upload handler
  const handleUpload = async (file: File) => {
    // Simulate upload progress
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Simulate successful upload
    console.log("File uploaded:", file.name);
  };

  return (
    <Page>
      <PageHeaderContainer>
        <PageHeader>
          <PageTitle>Form Example</PageTitle>
          <PageDescription>
            Complete form with React Hook Form validation
          </PageDescription>
        </PageHeader>
      </PageHeaderContainer>
      
      <PageContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              description={'Alabala'}
              required
              error={errors.firstName?.message}
              orientation={'responsive'}
            >
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="John"
                  />
                )}
              />
            </InputField>

            <InputField
              label="Last Name"
              required
              error={errors.lastName?.message}
            >
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Doe"
                  />
                )}
              />
            </InputField>
          </div>

          <InputField
            label="Email"
            required
            error={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="john@example.com"
                />
              )}
            />
          </InputField>

          <Controller
            name="productName"
            control={control}
            rules={{
              validate: (value) => {
                if (!value?.en) {
                  return "English product name is required";
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <InputField
                label="Product Name"
                required
                error={fieldState.error?.message}
                description="Provide product names in multiple languages"
              >
                <MultiLanguageInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  placeholder="Enter product name..."
                  maxCharacters={100}
                />
              </InputField>
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone is required" }}
            render={({ field, fieldState }) => (
              <InputField
                label="Phone Number"
                required
                error={fieldState.error?.message}
              >
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  defaultCountry="US"
                />
              </InputField>
            )}
          />

          <Controller
            name="dateRange"
            control={control}
            rules={{ required: "Date range is required" }}
            render={({ field, fieldState }) => (
              <InputField
                label="Booking Dates"
                required
                error={fieldState.error?.message}
              >
                <DateRangePicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  enablePresets
                  minDate={new Date()}
                />
              </InputField>
            )}
          />

          <Controller
            name="appointmentTime"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Appointment Time"
                optional
                error={fieldState.error?.message}
              >
                <TimePicker
                  value={field.value ? `${String(field.value.hours).padStart(2, '0')}:${String(field.value.minutes).padStart(2, '0')}` : null}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                />
              </InputField>
            )}
          />

          <Controller
            name="account"
            control={control}
            rules={{ required: "Account is required" }}
            render={({ field, fieldState }) => (
              <InputField
                label="Guest Account"
                required
                error={fieldState.error?.message}
              >
                <AccountSelect
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  resource_type="guest"
                />
              </InputField>
            )}
          />

          <Controller
            name="property"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Property"
                optional
                error={fieldState.error?.message}
              >
                <PropertySelect
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                />
              </InputField>
            )}
          />

          <Controller
            name="commission"
            control={control}
            rules={{ required: "Commission is required", min: 0, max: 50 }}
            render={({ field, fieldState }) => (
              <InputField
                label="Commission Rate"
                required
                error={fieldState.error?.message}
                description="Percentage charged for the service"
              >
                <PercentageInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  max={50}
                />
              </InputField>
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{
              validate: (value) => {
                if (!value?.en) {
                  return "English description is required";
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <InputField
                label="Product Description"
                required
                error={fieldState.error?.message}
              >
                <MultiLanguageTextarea
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  placeholder="Enter product description..."
                  maxCharacters={20}
                  minCharacters={10}
                  minHeight={120}
                />
              </InputField>
            )}
          />

          <Controller
            name="bio"
            control={control}
            rules={{ maxLength: { value: 200, message: "Bio must be less than 200 characters" } }}
            render={({ field, fieldState }) => (
              <InputField
                label="Biography"
                description="Tell us about yourself"
                error={fieldState.error?.message}
              >
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Write your bio..."
                  rows={4}
                  maxCharacters={200}
                />
              </InputField>
            )}
          />

          <Controller
            name="notes"
            control={control}
            rules={{
              maxLength: {
                value: 5000,
                message: "Notes must be less than 5000 characters"
              }
            }}
            render={({ field, fieldState }) => (
              <InputField
                label="Additional Notes"
                description="Rich text editor with formatting options"
                error={fieldState.error?.message}
                optional
              >
                <TextareaTiptap
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  error={!!fieldState.error}
                  placeholder="Write your notes with rich text formatting..."
                  maxCharacters={5000}
                  minHeight="200px"
                  maxHeight="400px"
                />
              </InputField>
            )}
          />

          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field, fieldState }) => (
              <InputField
                label="Property Location"
                required
                error={fieldState.error?.message}
                description="Search for an address or drag the marker to set the exact location"
              >
                <GeoLocationInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  mapHeight={400}
                  defaultZoom={10}
                />
              </InputField>
            )}
          />

          <Controller
            name="brandColor"
            control={control}
            rules={{
              required: "Brand color is required",
              pattern: {
                value: /^#[0-9A-F]{6}$/i,
                message: "Invalid color format (use hex format)",
              },
            }}
            render={({ field, fieldState }) => (
              <InputField
                label="Brand Color"
                required
                error={fieldState.error?.message}
                description="Choose your brand's primary color"
              >
                <ColorPicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </InputField>
            )}
          />

          <Controller
            name="document"
            control={control}
            rules={{ required: "Document is required" }}
            render={({ field, fieldState }) => (
              <InputField
                label="Upload Document"
                required
                error={fieldState.error?.message}
                description="Upload a PDF, Word document, or image file (max 5MB)"
              >
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onUpload={handleUpload}
                  accept=".pdf,.doc,.docx,image/*"
                  maxSize={5 * 1024 * 1024}
                  error={!!fieldState.error}
                />
              </InputField>
            )}
          />

          <Controller
            name="profileImage"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Profile Image"
                optional
                error={fieldState.error?.message}
                description="Upload your profile picture (auto-uploads on selection)"
              >
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onUpload={handleUpload}
                  accept="image/*"
                  maxSize={2 * 1024 * 1024}
                  autoUpload
                  error={!!fieldState.error}
                />
              </InputField>
            )}
          />

          <Controller
            name="attachments"
            control={control}
            rules={{
              validate: (value) =>
                value.length > 0 || "At least one attachment is required",
            }}
            render={({ field, fieldState }) => (
              <InputField
                label="Multiple Attachments"
                required
                error={fieldState.error?.message}
              >
                <MultiFileUpload
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onUpload={handleUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  maxSize={5 * 1024 * 1024}
                  maxFiles={10}
                  autoUpload
                  error={!!fieldState.error}
                />
              </InputField>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">Submit Form</Button>
            <Button type="button" variant="outline" onClick={() => console.log(control._formValues)}>
              Log Values
            </Button>
          </div>
        </form>
      </PageContent>
    </Page>
  );
}
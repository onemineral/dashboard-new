# InputWrapper Component

A universal, production-ready wrapper component for form inputs that provides consistent layout, validation states, error handling, and accessibility features across all form elements.

## Features

✅ **Universal Compatibility** - Works with any input component (text, select, textarea, custom components)  
✅ **Full TypeScript Support** - Comprehensive types and interfaces  
✅ **React Hook Form Integration** - Seamless integration with Controller and field state  
✅ **WCAG 2.1 AA Compliance** - Proper ARIA attributes, contrast ratios, keyboard navigation  
✅ **Multiple Validation States** - Error, success, warning, and default states  
✅ **Flexible Layouts** - Stacked (vertical) and inline (horizontal) layouts  
✅ **Rich Features** - Labels, descriptions, tooltips, character counts, prefix/suffix slots  
✅ **Error Handling** - Built-in error display with custom rendering support  
✅ **Mobile Responsive** - Touch-friendly with proper spacing and sizing  
✅ **Consistent Styling** - Follows project design system with Tailwind CSS  
✅ **Performance Optimized** - React.memo for efficient rendering  
✅ **Customizable** - Extensive className overrides for all sections  

## Installation

The component is part of your project's input components and uses existing UI primitives.

## Basic Usage

```tsx
import { InputWrapper } from "@/components/application/inputs/input-wrapper";
import { Input } from "@/components/ui/input";

function MyForm() {
  return (
    <InputWrapper
      label="Email Address"
      required
      description="We'll never share your email"
    >
      <Input type="email" placeholder="john@example.com" />
    </InputWrapper>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | Auto-generated | Unique identifier for the input field |
| `label` | `ReactNode` | - | Label text for the input |
| `description` | `ReactNode` | - | Helper text displayed below the input |
| `error` | `string \| boolean` | - | Error message to display |
| `renderError` | `(error: string) => ReactNode` | - | Custom error renderer function |
| `successMessage` | `string` | - | Success message to display |
| `warningMessage` | `string` | - | Warning message to display |
| `required` | `boolean` | `false` | Whether the field is required |
| `optional` | `boolean` | `false` | Whether the field is optional (shows badge) |
| `disabled` | `boolean` | `false` | Whether the field is disabled |
| `layout` | `"stacked" \| "inline"` | `"stacked"` | Layout orientation |
| `state` | `"default" \| "error" \| "success" \| "warning"` | - | Validation state |
| `infoTooltip` | `ReactNode` | - | Info tooltip content |
| `prefix` | `ReactNode` | - | Prefix content (icons, text) |
| `suffix` | `ReactNode` | - | Suffix content (icons, buttons) |
| `className` | `string` | - | Additional className for the wrapper |
| `labelClassName` | `string` | - | Additional className for the label |
| `inputContainerClassName` | `string` | - | Additional className for the input container |
| `errorClassName` | `string` | - | Additional className for the error message |
| `descriptionClassName` | `string` | - | Additional className for the description |
| `children` | `ReactNode` | - | Input component |
| `disableErrorAnimation` | `boolean` | `false` | Hide error animation |
| `data-testid` | `string` | - | Test ID for testing |

## Examples

### Basic Text Input with Error

```tsx
const [email, setEmail] = useState("");
const [error, setError] = useState("");

<InputWrapper
  label="Email Address"
  required
  error={error}
  description="We'll never share your email"
>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</InputWrapper>
```

### DateRangePicker Integration

```tsx
const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

<InputWrapper
  label="Booking Period"
  required
  description="Select check-in and check-out dates"
  infoTooltip="Prices may vary based on dates"
>
  <DateRangePicker
    value={dateRange}
    onChange={setDateRange}
    minDate={new Date()}
  />
</InputWrapper>
```

### AccountSelect Integration

```tsx
const [account, setAccount] = useState(null);

<InputWrapper
  label="Guest Account"
  required
  description="Search and select a guest"
>
  <AccountSelect
    value={account}
    onChange={setAccount}
    placeholder="Search for a guest..."
    type="guest"
  />
</InputWrapper>
```

### Input with Prefix and Suffix

```tsx
<InputWrapper
  label="Website URL"
  prefix={<Globe className="size-4" />}
  suffix={<Button size="sm">Verify</Button>}
>
  <Input type="url" placeholder="https://example.com" />
</InputWrapper>
```

### Validation States

```tsx
// Error State
<InputWrapper
  label="Username"
  state="error"
  error="Username is already taken"
>
  <Input value="john123" />
</InputWrapper>

// Success State
<InputWrapper
  label="Email"
  state="success"
  successMessage="Email is available"
>
  <Input value="john@example.com" />
</InputWrapper>

// Warning State
<InputWrapper
  label="Password"
  state="warning"
  warningMessage="Password is weak"
>
  <Input type="password" value="password" />
</InputWrapper>
```

### Inline Layout

```tsx
<InputWrapper label="First Name" layout="inline" required>
  <Input placeholder="John" />
</InputWrapper>

<InputWrapper label="Last Name" layout="inline" required>
  <Input placeholder="Doe" />
</InputWrapper>
```

### Custom Error Renderer

```tsx
const errors = ["At least 8 characters", "One uppercase letter"];

<InputWrapper
  label="Password"
  error={errors.length > 0}
  renderError={() => (
    <ul className="list-disc list-inside">
      {errors.map((err, i) => (
        <li key={i}>{err}</li>
      ))}
    </ul>
  )}
>
  <Input type="password" />
</InputWrapper>
```

### React Hook Form Integration

```tsx
import { useForm, Controller } from "react-hook-form";

interface FormData {
  email: string;
  dateRange: DateRangeValue | null;
  account: any;
}

function MyForm() {
  const { register, control, formState: { errors } } = useForm<FormData>();

  return (
    <form>
      {/* Regular Input */}
      <InputWrapper
        label="Email"
        required
        error={errors.email?.message}
      >
        <Input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email",
            },
          })}
        />
      </InputWrapper>

      {/* DateRangePicker with Controller */}
      <Controller
        name="dateRange"
        control={control}
        rules={{ required: "Date range is required" }}
        render={({ field, fieldState }) => (
          <InputWrapper
            label="Booking Dates"
            required
            error={fieldState.error?.message}
          >
            <DateRangePicker
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          </InputWrapper>
        )}
      />

      {/* AccountSelect with Controller */}
      <Controller
        name="account"
        control={control}
        rules={{ required: "Account is required" }}
        render={({ field, fieldState }) => (
          <InputWrapper
            label="Guest Account"
            required
            error={fieldState.error?.message}
          >
            <AccountSelect
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          </InputWrapper>
        )}
      />
    </form>
  );
}
```

### Checkbox with Wrapper

```tsx
<InputWrapper description="Subscribe to newsletter">
  <div className="flex items-center gap-2">
    <Checkbox id="newsletter" />
    <Label htmlFor="newsletter">
      Receive updates
    </Label>
  </div>
</InputWrapper>
```

### Radio Group with Wrapper

```tsx
<InputWrapper
  label="Payment Method"
  required
  description="Choose payment method"
>
  <RadioGroup value={value} onValueChange={setValue}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="card" id="card" />
      <Label htmlFor="card">Credit Card</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="paypal" id="paypal" />
      <Label htmlFor="paypal">PayPal</Label>
    </div>
  </RadioGroup>
</InputWrapper>
```

## Accessibility

The component follows WCAG 2.1 AA guidelines:

- **Proper Label Association**: Uses `htmlFor` and `id` for label-input connection
- **ARIA Attributes**: `aria-invalid`, `aria-describedby` for error states
- **Live Regions**: Error messages use `role="alert"` and `aria-live="polite"`
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Clear focus states for all inputs
- **Touch Targets**: Minimum 44x44px for mobile (configurable per breakpoint)
- **Screen Reader Support**: Proper announcement of errors and state changes
- **Contrast Ratios**: Error colors meet WCAG AA contrast requirements

### ARIA Implementation

```tsx
// Generated ARIA attributes
<input
  id="email-input"
  aria-invalid={hasError}
  aria-describedby="email-description email-error"
/>

<p id="email-description">Helper text</p>
<p id="email-error" role="alert" aria-live="polite">Error message</p>
```

## Validation States

The component supports four validation states:

1. **Default** - Normal state with no validation feedback
2. **Error** - Red styling with error icon and message
3. **Success** - Green styling with success icon and message
4. **Warning** - Amber styling with warning icon and message

States are automatically determined based on props:
- If `error` prop is set → Error state
- If `successMessage` prop is set → Success state
- If `warningMessage` prop is set → Warning state
- If `state` prop is explicitly set → Uses that state
- Otherwise → Default state

## Layout Modes

### Stacked Layout (Default)

Label and input are vertically stacked:

```tsx
<InputWrapper label="Email" layout="stacked">
  <Input type="email" />
</InputWrapper>
```

### Inline Layout

Label and input are horizontally aligned:

```tsx
<InputWrapper label="Email" layout="inline">
  <Input type="email" />
</InputWrapper>
```

Good for forms with many short inputs or space-constrained layouts.

## Styling

The component uses Tailwind CSS and follows your project's design system:

- Inherits theme colors (primary, destructive, accent)
- Responsive breakpoints (md, lg)
- Dark mode support
- Consistent spacing using gap utilities

### Custom Styling

```tsx
<InputWrapper
  className="my-custom-wrapper"
  labelClassName="text-lg font-bold"
  inputContainerClassName="bg-gray-50"
  errorClassName="text-red-600"
  descriptionClassName="text-gray-500"
>
  <Input />
</InputWrapper>
```

## Testing

The component includes `data-testid` attributes for testing:

```tsx
<InputWrapper data-testid="email-wrapper" label="Email">
  <Input />
</InputWrapper>

// In tests
const wrapper = screen.getByTestId("email-wrapper");
const input = within(wrapper).getByRole("textbox");
const error = within(wrapper).getByRole("alert");
```

## Performance

Optimizations included:

- `React.memo` - Prevents unnecessary re-renders
- `useMemo` - Memoizes computed values
- Conditional rendering for optional features
- Efficient DOM updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Best Practices

1. **Always provide labels** - Improves accessibility and UX
2. **Use `required` prop** - Shows visual indicator and improves validation
3. **Provide descriptions** - Helps users understand what's expected
4. **Handle errors gracefully** - Clear, actionable error messages
5. **Use tooltips sparingly** - Only for additional context, not critical info
6. **Test on mobile** - Ensure touch targets are adequate
7. **Validate accessibly** - Use proper ARIA attributes

## Common Patterns

### Form Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <InputWrapper label="First Name" required>
    <Input />
  </InputWrapper>
  <InputWrapper label="Last Name" required>
    <Input />
  </InputWrapper>
</div>
```

### Search Input

```tsx
<InputWrapper
  label="Search"
  prefix={<Search className="size-4" />}
>
  <Input type="search" placeholder="Search..." />
</InputWrapper>
```

### Password with Strength Indicator

```tsx
<InputWrapper
  label="Password"
  state={strength === "weak" ? "warning" : "success"}
  warningMessage={strength === "weak" ? "Weak password" : undefined}
  successMessage={strength === "strong" ? "Strong password" : undefined}
>
  <Input type="password" />
</InputWrapper>
```

## Troubleshooting

### Error not showing
- Check if `error` prop is set (string or boolean)
- Verify `state` prop isn't overriding error display
- Ensure error message is not empty string

### Tooltip not appearing
**- Verify `infoTooltip` prop has content
- Check if TooltipProvider is in component tree
- Ensure no z-index conflicts**

### Layout issues on mobile
- Test with real devices or browser dev tools
- Check if parent container has proper width constraints
- Verify touch targets meet 44x44px minimum

### Form validation not working
- Use `Controller` for custom components with React Hook Form
- Pass `onBlur` prop for validation timing
- Ensure proper `name` registration

## Contributing

When modifying this component:

1. Maintain TypeScript types
2. Keep accessibility features
3. Test on mobile devices
4. Update examples and documentation
5. Run tests before committing

## License

MIT
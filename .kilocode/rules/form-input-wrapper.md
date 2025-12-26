# InputField Component

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
import { InputField } from "@/components/application/inputs/input-field";
import { Input } from "@/components/ui/input";

function MyForm() {
  return (
    <InputField
      label="Email Address"
      required
      description="We'll never share your email"
    >
      <Input type="email" placeholder="john@example.com" />
    </InputField>
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
| `orientation` | `"vertical" \| "responsive"` | `"vertical"` | Layout orientation |
| `infoTooltip` | `ReactNode` | - | Info tooltip content |
| `className` | `string` | - | Additional className for the wrapper |
| `labelClassName` | `string` | - | Additional className for the label |
| `errorClassName` | `string` | - | Additional className for the error message |
| `descriptionClassName` | `string` | - | Additional className for the description |
| `children` | `ReactNode` | - | Input component |
| `data-testid` | `string` | - | Test ID for testing |

## Examples

### Basic Text Input with Error

```tsx
const [email, setEmail] = useState("");
const [error, setError] = useState("");

<InputField
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
</InputField>
```

### DateRangePicker Integration

```tsx
const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

<InputField
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
</InputField>
```

### AccountSelect Integration

```tsx
const [account, setAccount] = useState(null);

<InputField
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
</InputField>
```

### Validation States

```tsx
// Error State
<InputField
  label="Username"
  state="error"
  error="Username is already taken"
>
  <Input value="john123" />
</InputField>
```

### Responsive Layout

```tsx
<InputField label="First Name" orientation="responsive" required>
  <Input placeholder="John" />
</InputField>

<InputField label="Last Name" orientation="responsive" required>
  <Input placeholder="Doe" />
</InputField>
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
      <InputField
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
      </InputField>

      {/* DateRangePicker with Controller */}
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
            />
          </InputField>
        )}
      />

      {/* AccountSelect with Controller */}
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
            />
          </InputField>
        )}
      />
    </form>
  );
}
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

## Layout Modes

### Vertical Layout (Default)

Label and input are vertically stacked:

```tsx
<InputField label="Email" orientation="vertical">
  <Input type="email" />
</InputField>
```

### Responsive Layout

Label and input are horizontally aligned on larger screens, vertical on mobile:

```tsx
<InputField label="Email" orientation="responsive">
  <Input type="email" />
</InputField>
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
<InputField
  className="my-custom-wrapper"
  labelClassName="text-lg font-bold"
  errorClassName="text-red-600"
  descriptionClassName="text-gray-500"
>
  <Input />
</InputField>
```

## Testing

The component includes `data-testid` attributes for testing:

```tsx
<InputField data-testid="email-wrapper" label="Email">
  <Input />
</InputField>

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
  <InputField label="First Name" required>
    <Input />
  </InputField>
  <InputField label="Last Name" required>
    <Input />
  </InputField>
</div>
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
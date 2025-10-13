# DateRangePicker Component

A production-ready, fully accessible daterange picker component built with React, TypeScript, and react-day-picker.

## Features

✅ **Full TypeScript Support** - Comprehensive types and interfaces
✅ **WCAG Accessibility** - Keyboard navigation, ARIA labels, screen reader support
✅ **Mobile Responsive** - Touch-friendly with 44x44px minimum click targets
✅ **Date Validation** - Prevents invalid ranges, min/max date constraints
✅ **Centralized Date Formatting** - Uses `useDateFormat` hook for consistent formatting across the app
✅ **Preset Ranges** - Built-in presets (Last 7 Days, Last 30 Days, etc.)
✅ **Form Integration** - Works seamlessly with React Hook Form and Formik
✅ **Controlled/Uncontrolled** - Support for both patterns
✅ **Visual Feedback** - Hover states, focus indicators, range highlighting
✅ **Edge Case Handling** - Leap years, month boundaries, timezones
✅ **Performance Optimized** - React.memo, useMemo, useCallback
✅ **Portal Rendering** - Avoids z-index conflicts
✅ **Smooth Animations** - CSS transitions with reduced motion support
✅ **Testing Ready** - data-testid attributes included

## Installation

The component uses the following dependencies (should already be in your project):

```bash
npm install react-day-picker date-fns lucide-react
```

## Basic Usage

```tsx
import { DateRangePicker } from "@/components/application/inputs/daterange-picker";

function MyComponent() {
  const [dateRange, setDateRange] = useState(null);

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      placeholder="Select date range"
    />
  );
}
```

## Date Formatting

The DateRangePicker component uses the [`useDateFormat`](../../hooks/use-format.ts:5) hook for all date formatting. This ensures consistent date display across your entire application based on user preferences stored in their profile settings.

The date format is automatically determined by:
- User's profile settings (`profile.settings.date_format`)
- Falls back to `yyyy-MM-dd` (ISO format) if no preference is set

**No date format configuration is needed at the component level.** All date formatting is centralized through the formatting hook.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateRangeValue \| null` | - | Current date range value (controlled) |
| `defaultValue` | `DateRangeValue \| null` | `null` | Default value (uncontrolled) |
| `onChange` | `(range: DateRangeValue \| null) => void` | - | Callback when range changes |
| `onBlur` | `() => void` | - | Callback on blur (for form validation) |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `placeholder` | `string` | `"Select date range"` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `boolean` | `false` | Show error state |
| `className` | `string` | - | Additional CSS classes |
| `presets` | `DateRangePreset[]` | - | Custom preset ranges |
| `enablePresets` | `boolean` | `false` | Enable preset ranges |
| `errorMessage` | `string` | - | Custom error message |
| `numberOfMonths` | `number` | `2` | Number of months to display |
| `weekStartsOn` | `WeekStartsOn` | `1` (Monday) | First day of the week (0=Sunday, 1=Monday, etc.) |
| `data-testid` | `string` | - | Test ID for testing |

## Types

```typescript
interface DateRangeValue {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
```

## Examples

### Controlled Component

```tsx
const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  placeholder="Select dates"
/>
```

### With Validation

```tsx
<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  minDate={new Date()}
  maxDate={new Date(2025, 11, 31)}
  error={!!error}
  errorMessage="Please select a valid date range"
/>
```

### With Presets

```tsx
<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  enablePresets
/>
```

### Custom Presets

```tsx
const customPresets = [
  {
    label: "Next Week",
    getValue: () => {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return { from: today, to: nextWeek };
    },
  },
];

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  enablePresets
  presets={customPresets}
/>
```

### React Hook Form Integration

```tsx
import { useForm, Controller } from "react-hook-form";

interface FormData {
  dateRange: DateRangeValue | null;
}

function MyForm() {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="dateRange"
        control={control}
        rules={{ required: "Date range is required" }}
        render={({ field, fieldState }) => (
          <DateRangePicker
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </form>
  );
}
```

### Displaying Selected Dates

The component uses the `useDateFormat` hook internally for the input display. To format dates for display elsewhere in your UI, use the same hook:

```tsx
import { useDateFormat } from "@/hooks/use-format";

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);
  const formatDate = useDateFormat();

  return (
    <div>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />
      {dateRange?.from && dateRange?.to && (
        <p>
          Selected: {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
        </p>
      )}
    </div>
  );
}
```

### Mobile Optimized

```tsx
<DateRangePicker
  numberOfMonths={1}
  enablePresets
  placeholder="Select dates"
/>
```

## Accessibility

The component follows WCAG guidelines:

- **Keyboard Navigation**: Tab, Enter, Escape, Arrow keys
- **ARIA Labels**: Proper labels and roles
- **Screen Reader Support**: Live regions for dynamic content
- **Focus Management**: Proper focus trapping in calendar
- **Touch Targets**: Minimum 44x44px on mobile
- **Reduced Motion**: Respects prefers-reduced-motion

### Keyboard Shortcuts

- `Tab` - Navigate through elements
- `Enter` - Select date or apply changes
- `Escape` - Close calendar without applying
- `Arrow Keys` - Navigate calendar dates
- `Ctrl/Cmd + Enter` - Quick apply

## Validation

The component includes built-in validation:

1. **Invalid Dates** - Prevents selection of invalid dates
2. **Range Validation** - End date must be after start date
3. **Min/Max Dates** - Respects date constraints
4. **Required Fields** - Can enforce both dates are selected

## Performance

Optimizations included:

- `React.memo` - Prevents unnecessary re-renders
- `useMemo` - Memoizes expensive computations
- `useCallback` - Stable callback references
- **Debouncing** - Efficient update handling
- **Code Splitting** - Tree-shakable exports

## Styling

The component uses Tailwind CSS and follows your project's design system:

- Inherits theme colors (primary, accent, destructive)
- Responsive breakpoints (md, lg)
- Dark mode support
- Consistent spacing and sizing

## Testing

The component includes `data-testid` attributes for easy testing:

```tsx
<DateRangePicker data-testid="booking-dates" />

// In tests
const picker = screen.getByTestId("booking-dates");
const calendar = screen.getByTestId("booking-dates-calendar");
const applyButton = screen.getByTestId("booking-dates-apply");
const cancelButton = screen.getByTestId("booking-dates-cancel");
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Calendar doesn't open
- Check if `disabled` prop is set
- Verify no conflicting z-index styles
- Ensure Popover component is properly configured

### Dates not formatting correctly
- Date formatting is controlled by user profile settings via `useDateFormat` hook
- Check that user profile has `settings.date_format` configured
- Falls back to `yyyy-MM-dd` if no format is set
- Ensure date-fns is installed

### Validation errors not showing
- Set `error={true}` prop
- Provide `errorMessage` prop
- Check console for validation errors

### Form integration issues
- Use `Controller` from react-hook-form
- Pass `onBlur` for proper validation timing
- Ensure proper `value`/`onChange` pattern

## Advanced Usage

### Custom Styling

```tsx
<DateRangePicker
  className="custom-class"
  // Additional styles will merge with defaults
/>
```

### Handling Timezones

```tsx
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { useDateFormat } from '@/hooks/use-format';

function MyComponent() {
  const formatDate = useDateFormat();
  
  const handleChange = (range: DateRangeValue | null) => {
    if (range?.from && range?.to) {
      const utcFrom = zonedTimeToUtc(range.from, 'America/New_York');
      const utcTo = zonedTimeToUtc(range.to, 'America/New_York');
      // Use UTC dates for storage/API
      // Use formatDate for display
      console.log('Display:', formatDate(range.from), '-', formatDate(range.to));
    }
  };
  
  return (
    <DateRangePicker onChange={handleChange} />
  );
}
```

### Dynamic Min/Max Dates

```tsx
const [minDate, setMinDate] = useState(new Date());

<DateRangePicker
  minDate={minDate}
  maxDate={new Date(minDate.getTime() + 90 * 24 * 60 * 60 * 1000)}
/>
```

## Date Format Configuration

To change the date format for all users, update the user profile settings. The format should follow date-fns format strings:

- `MM/dd/yyyy` - US format (12/31/2024)
- `dd/MM/yyyy` - European format (31/12/2024)
- `yyyy-MM-dd` - ISO format (2024-12-31)

Example profile settings:
```typescript
{
  profile: {
    settings: {
      date_format: "dd/MM/yyyy" // European format
    }
  }
}
```

The `useDateFormat` hook will automatically handle the format conversion (replacing `YYYY` with `yyyy` and `DD` with `dd` for date-fns compatibility).

## Contributing

When modifying this component:

1. Update TypeScript types
2. Maintain accessibility features
3. Test on mobile devices
4. Do not add date formatting props - use `useDateFormat` hook
5. Update examples and documentation
6. Run tests before committing

## License

MIT
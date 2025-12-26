1. always use react-query useQuery and useMutation to make requests
2. all components and pages must work extremely well on mobile. make sure everything is optimised for mobile phones and tablets
3. make sure that dropdowns, modals, dialogs etc. don't focus on inputs by default on mobile and tablets. it's annoying to open a dropdown and immediately the keyboard pops up.
4. all custom inputs must be compatible with react-hook-form
5. all amounts displays must use the component from @/components/application/display/amount.tsx
6. All dates must be displayed by using the useDateFormat hook from @/src/hooks/use-format.ts file.
7. Do not create additional component example files.
8. Do not create additional markdown documentation files.
9. You must add examples and documentation comments in the component file only
10. You must use react-intl package to translate all text using the FormattedMessage components or the useIntl() hook. Do not use id prop and always use the direct text and a short description for the text.
11. Plurals in react-intl are defined like this: <FormattedMessage defaultMessage={`{count} {count, plural, one {property selected} other {properties selected}}.`} values={{ count: selectedProperties.length }} description={'The number of selected properties'} />
12. Always use plurals when working with counters (like '{count} selected'). While in english you might not need plurals, in other languages you do.
13. all components are rendered in a div with a @container class (think tailwind container queries). We must use @xl:, @2xl:, @lg: etc. for responsive layouts instead of the generic lg:, md: etc.  
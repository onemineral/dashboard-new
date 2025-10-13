1. always use react-query useQuery and useMutation to make requests
2. all components and pages must work extremely well on mobile. make sure everything is optimised for mobile phones and tablets
3. make sure that dropdowns, modals, dialogs etc. don't focus on inputs by default on mobile and tablets. it's annoying to open a dropdown and immediately the keyboard pops up.
4. all custom inputs must be compatible with react-hook-form
5. all amounts displays must use the component from @/components/application/display/amount.tsx
6. All dates must be displayed by using the useDateFormat hook from @/src/hooks/use-format.ts file.
7. Do not create additional component example files.
8. Do not create additional markdown documentation files.
9. You must add examples and documentation comments in the component file only
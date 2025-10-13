# Filte: Generating List Pages for Resource Records

This filte provides step-by-step instructions for Roo Code to generate new pages that display lists of records for any resource type (e.g., properties, users, bookings). The approach is based on the patterns and best practices in [`src/routes/pms/properties/index.tsx`](src/routes/pms/properties/index.tsx:1).

---

## 1. Prompt for Resource-Specific Information

Before generating a list page, prompt the user for:

- **Resource Name** (singular and plural, e.g., "Property", "Properties")
- **Fields and Data Types**: List of fields to display in the datatable, with their data types (string, number, enum, relation, image, etc.)
- **Filters**: Which fields should be filterable, and what filter type to use (text search, picklist, checkbox, etc.)
- **Sortable Fields**: Which fields should support sorting.
- **Actions**: Any row-level or bulk actions (e.g., "Edit", "Delete", "Export", "Add new").
- **Special Display Logic**: Any custom cell rendering (e.g., badges, progress bars, images).

---

## 2. Page Layout Structure

Use the following layout components for consistency:

- [`Page`](src/components/application/page.tsx:1): Main container for the page.
- [`PageHeaderContainer`](src/components/application/page.tsx:1): Wraps the header and actions.
- [`PageHeader`](src/components/application/page.tsx:1): Contains the title and description.
- [`PageTitle`](src/components/application/page.tsx:1): The resource name (plural).
- [`PageDescription`](src/components/application/page.tsx:1): Short description of the resource list.
- [`PageActions`](src/components/application/page.tsx:1): Action buttons (e.g., "Add", "Export").

**Example:**
```tsx
<Page size="md">
  <PageHeaderContainer>
    <PageHeader className="grow">
      <PageTitle>{ResourcePlural}</PageTitle>
      <PageDescription>{ResourceDescription}</PageDescription>
    </PageHeader>
    <PageActions className="gap-2">
      {/* Action buttons */}
    </PageActions>
  </PageHeaderContainer>
  <PageContent>
    {/* Filters, Sort, DataTable, Pagination, Bulk Actions */}
  </PageContent>
</Page>
```

---

## 3. Filters and Sorting

- Use [`Filters`](src/components/application/filters/filters.tsx:1) to wrap filter controls.
- Define available filters using [`useFiltersDefinition`](src/components/application/filters/hooks/use-filters-definition.tsx:1).
- For each filter, specify:
  - `name` or `field`
  - `label`
  - `component` (e.g., [`TextSearchFilter`](src/components/application/filters/types/text-search-filter.tsx:1), picklist, checkbox)
  - `featured` (if it should be shown by default)
- Use [`SortDropdown`](src/components/application/sort-dropdown.tsx:1) for sorting, passing the resource name and available sortable fields.

**Example:**
```tsx
const availableFilters = useFiltersDefinition('resource', [
  { name: 'name', featured: true, label: 'Name', component: <TextSearchFilter field="name" placeholder="Search by name" /> },
  { field: 'status', featured: true },
  // ...other filters
]);

<Filters
  className="mb-2 grow"
  onFiltersChange={setSelectedFilters}
  availableFilters={availableFilters}
  selectedFilters={selectedFilters}
>
  <SortDropdown resource="resource" sort={sort} availableFields={['id', 'name', ...]} onChange={setSort} />
</Filters>
```

---

## 4. Datatable Columns

- Define columns as an array of [`ColumnDef`](https://tanstack.com/table/v8/docs/api/core/column-def) objects.
- For each column, specify:
  - `accessorKey` (field name) or `id`
  - `header` (column label)
  - `cell` (custom rendering logic, if needed)
  - `enablePinning`, `enableResizing`, `enableHiding` as needed
  - `size` (optional, for column width)
- Use custom components for special cell rendering (e.g., badges, progress bars, images).

**Example:**
```tsx
const columns: ColumnDef<ResourceType>[] = [
  { accessorKey: "name", header: "Name", cell: ({row}) => <Link to={`/resource/${row.original.id}`}>{row.original.name}</Link> },
  { accessorKey: "status", header: "Status", cell: ({row}) => <StatusBadge status={row.original.status} /> },
  // ...other columns
  {
    id: "actions",
    header: () => <Button variant="ghost" size="sm"><Settings2 className="size-4" /></Button>,
    cell: ({row}) => (
      <DropdownMenu>
        {/* Row actions */}
      </DropdownMenu>
    ),
    enableResizing: false,
    enableHiding: false,
    enablePinning: true,
    size: 50,
  },
];
```

---

## 5. Data Fetching and State Management

- Use a custom hook (e.g., [`useDataTable`](src/hooks/use-data-table.ts:1)) to manage:
  - Selected filters
  - Sort state
  - Pagination (page, perPage)
  - Request body for API
- Fetch data using [`useQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) from `@tanstack/react-query`.
- Pass the request body (filters, sort, pagination) to the API.

**Example:**
```tsx
const { selectedFilters, setSelectedFilters, body, page, setPage, perPage, sort, setSort } = useDataTable({ initialSort: { field: 'id', direction: 'asc' } });

const query = useQuery({
  queryKey: ['resource.list', body],
  queryFn: async () => {
    if (!body) return null;
    return (await api.resource.query(body)).response;
  },
});
```

---

## 6. Rendering the DataTable

- Use [`DataTable`](src/components/application/data-table.tsx:1) to display records.
- Pass the columns, records, loading state, and selection handler.

**Example:**
```tsx
<DataTable
  className="mt-2"
  onSelectChange={setSelectedRecords}
  records={query.data?.data || []}
  loading={query.isLoading}
  columnDef={columns}
/>
```

---

## 7. Pagination

- Use [`DataTablePagination`](src/components/application/data-table-pagination.tsx:1) for pagination controls.
- Pass current page, total records, records per page, and page change handler.

**Example:**
```tsx
<DataTablePagination
  pageNumber={page}
  totalRecords={query.data?.total}
  recordsPerPage={perPage}
  onChange={setPage}
/>
```

---

## 8. Bulk/Fixed Actions

- Use [`FixedFormActions`](src/components/application/fixed-form-actions.tsx:1) to display actions when records are selected.
- Show the number of selected records and provide action buttons (e.g., "Reset", "Save").

**Example:**
```tsx
<FixedFormActions visible={selectedRecords.length > 0} className="bottom-20 md:bottom-7">
  {/* Action icons and buttons */}
</FixedFormActions>
```

---

## 9. Component References and Options

- **Filters**: [`Filters`](src/components/application/filters/filters.tsx:1), [`TextSearchFilter`](src/components/application/filters/types/text-search-filter.tsx:1), picklist, checkbox, etc.
- **Sorting**: [`SortDropdown`](src/components/application/sort-dropdown.tsx:1)
- **Table**: [`DataTable`](src/components/application/data-table.tsx:1), [`ColumnDef`](https://tanstack.com/table/v8/docs/api/core/column-def)
- **Pagination**: [`DataTablePagination`](src/components/application/data-table-pagination.tsx:1)
- **Actions**: [`DropdownMenu`](src/components/ui/dropdown-menu.tsx:1), [`Button`](src/components/ui/button.tsx:1)
- **Status/Badges**: [`StatusBadge`](src/components/application/statuses/status-badge.tsx:1), custom badges
- **Progress**: [`CircularProgress`](src/components/customized/progress/curcular-progress.tsx:1) for visual indicators

---

## 10. Best Practices

- Keep the page layout consistent across resources.
- Use featured filters for the most important fields.
- Always prompt the user for resource-specific fields, filters, and sort options.
- Use custom cell renderers for complex data (e.g., images, badges, progress).
- Provide clear actions for both individual rows and bulk operations.
- Ensure accessibility and responsiveness in all components.

---

## Summary Checklist

1. Prompt the user for:
   - Resource name (singular/plural)
   - Fields and data types
   - Filterable fields and filter types
   - Sortable fields
   - Special cell rendering or actions
2. Generate the page using the layout and component patterns above.
3. Configure filters, sorting, columns, and pagination as described.
4. Reference and use the appropriate components for each feature.
5. Ensure the generated page is tailored to the resource's unique structure.

---

**End of filte.**
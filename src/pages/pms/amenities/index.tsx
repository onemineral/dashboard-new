import {
  Page,
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContainer,
  PageTitle
} from "@/components/application/page";
import { Filters } from "@/components/application/filters/filters";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus} from "lucide-react";
import AmenityFeaturedBadge from "@/components/application/statuses/amenity-featured-badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "@/components/application/link";
import TextSearchFilter from "@/components/application/filters/types/text-search-filter";
import { DataTable } from "@/components/application/data-table";
import useFiltersDefinition from "@/components/application/filters/hooks/use-filters-definition";
import DataTablePagination from "@/components/application/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import SortDropdown from "@/components/application/sort-dropdown";
import { translated } from "@/lib/utils";
import BooleanRadioFilter from "@/components/application/filters/types/boolean-radio-filter";
import { toast } from "sonner";
import DeleteButton from "@/components/customized/buttons/delete-button";

// Table columns
function getColumns(): ColumnDef<any>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      size: 60,
      enablePinning: true,
      enableResizing: false,
      cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{translated(row.original.name)}</span>,
    },
    {
      accessorKey: "amenity_group",
      header: "Amenity group",
      cell: ({ row }) =>
        row.original.amenity_group
          ? <>{translated(row.original.amenity_group.name)}</>
          : <span className="text-muted-foreground text-xs">—</span>,
    },
    {
      accessorKey: "is_featured",
      header: "Featured",
      cell: ({ row }) => <AmenityFeaturedBadge amenity={row.original} refetchQueryKeys={['amenities.list']} />,
    },
    {
      accessorKey: "original_name",
      header: "Mapping name",
      cell: ({ row }) => row.original.original_name ?? '-',
    },
    {
      id: "actions",
      size: 50,
      enableResizing: false,
      enableHiding: false,
      enablePinning: true,
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DeleteButton
            title={`Delete Amenity "${translated(row.original.name)}"`}
            description={
              <>
                This action is <span className="font-semibold text-destructive">irreversible</span>. Deleting an amenity will permanently remove it from your system. Are you sure you want to continue?
              </>
            }
            refetchQueryKeys={['amenities.list']}
            onConfirm={async () => {
                try {
                  await api.amenity.del({ id: row.original.id });
                  toast.success("Amenity deleted successfully.");
                } catch (err: any) {
                  toast.error("Failed to delete amenity. Please try again.");
                  throw new Error(err.responseBody?.message);
                }
              }}
          />
        </div>
      ),
    },
  ];
}

export default function AmenitiesList() {
  // DataTable state
  const { selectedFilters, setSelectedFilters, body, page, setPage, perPage, sort, setSort } = useDataTable({
    initialSort: { field: "id", direction: "asc" }
  });

  // Data query
  const query = useQuery({
    queryKey: ["amenities.list", body],
    queryFn: async () => {
      if (body === undefined) return null;
      return (await api.amenity.query(body)).response;
    }
  });

  // Filters definition
  const availableFilters = useFiltersDefinition("amenity", [
    {
      name: "name",
      featured: true,
      label: "Name",
      component: <TextSearchFilter field="name" placeholder="Search by amenity name" />,
    },
    {
      name: "is_featured",
      featured: true,
      label: "Featured",
      component: <BooleanRadioFilter field="is_featured" trueLabel='Featured' falseLabel='Not featured' />,
    },
  ]);

  return (
    <Page size="md">
      <PageHeaderContainer>
        <PageHeader className="grow">
          <PageTitle>Amenities</PageTitle>
          <PageDescription>Browse and manage all amenities available in your system.</PageDescription>
        </PageHeader>
        <PageActions className="gap-2">
          <Button size="sm" asChild>
            <Link modal to="/pms/amenities/new">
              <Plus /> Add amenity
            </Link>
          </Button>
        </PageActions>
      </PageHeaderContainer>

      <PageContent>
        <Filters
          className="mb-2 grow"
          onFiltersChange={setSelectedFilters}
          availableFilters={availableFilters}
          selectedFilters={selectedFilters}
        >
          <SortDropdown
            resource="amenity"
            sort={sort}
            availableFields={["id", "name"]}
            onChange={setSort}
          />
        </Filters>

        <DataTable
          className="mt-2"
          records={query.data?.data || []}
          loading={query.isLoading}
          columnDef={getColumns()}
        />

        <DataTablePagination
          pageNumber={page}
          totalRecords={query.data?.total}
          recordsPerPage={perPage}
          onChange={setPage}
        />
      </PageContent>
    </Page>
  );
}
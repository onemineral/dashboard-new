import {
  Page,
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContainer,
  PageTitle
} from "@/components/application/page";
import { useTranslate } from "@/hooks/use-translate";
import {Filters} from "@/components/application/filters/filters";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import AmenityFeaturedBadge from "@/components/application/statuses/amenity-featured-badge";
import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "@/components/application/link";
import TextSearchFilter from "@/components/application/filters/types/text-search-filter";
import {DataTable} from "@/components/application/data/data-table.tsx";
import useFiltersDefinition from "@/components/application/filters/hooks/use-filters-definition";
import QueryPagination from "@/components/application/data/query-pagination.tsx";
import {useDataTable} from "@/hooks/use-data-table";
import SortDropdown from "@/components/application/data/sort-dropdown.tsx";
import BooleanRadioFilter from "@/components/application/filters/types/boolean-radio-filter";
import {toast} from "sonner";
import DeleteButton from "@/components/customized/buttons/delete-button";
import {FormattedMessage, useIntl} from "react-intl";

// Table columns
function getColumns(intl: ReturnType<typeof useIntl>, translated: ReturnType<typeof useTranslate>): ColumnDef<any>[] {
    return [
        {
            accessorKey: "id",
            header: intl.formatMessage({defaultMessage: "ID", description: "Column header for amenity ID"}),
            size: 60,
            enablePinning: true,
            enableResizing: false,
            cell: ({row}) => <span className="font-mono text-xs">#{row.original.id}</span>,
        },
        {
            accessorKey: "name",
            header: intl.formatMessage({defaultMessage: "Name", description: "Column header for amenity name"}),
            cell: ({row}) => <span>{translated(row.original.name)}</span>,
        },
        {
            accessorKey: "amenity_group",
            header: intl.formatMessage({
                defaultMessage: "Amenity group",
                description: "Column header for amenity group"
            }),
            cell: ({row}) =>
                row.original.amenity_group
                    ? <>{translated(row.original.amenity_group.name)}</>
                    : <span className="text-muted-foreground text-xs">—</span>,
        },
        {
            accessorKey: "is_featured",
            header: intl.formatMessage({
                defaultMessage: "Featured",
                description: "Column header for featured amenity status"
            }),
            cell: ({row}) => <AmenityFeaturedBadge amenity={row.original} refetchQueryKeys={['amenities.list']}/>,
        },
        {
            accessorKey: "original_name",
            header: intl.formatMessage({
                defaultMessage: "Mapping name",
                description: "Column header for amenity mapping name"
            }),
            cell: ({row}) => row.original.original_name ?? '-',
        },
        {
            id: "actions",
            size: 50,
            enableResizing: false,
            enableHiding: false,
            enablePinning: true,
            header: '',
            cell: ({row}) => (
                <div className="flex items-center gap-1">
                    <DeleteButton
                        title={intl.formatMessage(
                            {defaultMessage: 'Delete Amenity "{name}"', description: "Delete amenity dialog title"},
                            {name: translated(row.original.name)}
                        )}
                        description={
                            <FormattedMessage
                                defaultMessage="This action is <strong>irreversible</strong>. Deleting an amenity will permanently remove it from your system. Are you sure you want to continue?"
                                description="Delete amenity confirmation message"
                                values={{
                                    strong: (chunks) => <span className="font-semibold text-destructive">{chunks}</span>
                                }}
                            />
                        }
                        refetchQueryKeys={['amenities.list']}
                        onConfirm={async () => {
                            try {
                                await api.amenity.del({id: row.original.id});
                                toast.success(intl.formatMessage({
                                    defaultMessage: "Amenity deleted successfully.",
                                    description: "Success message for amenity deletion"
                                }));
                            } catch (err: any) {
                                toast.error(intl.formatMessage({
                                    defaultMessage: "Failed to delete amenity. Please try again.",
                                    description: "Error message for amenity deletion failure"
                                }));
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
  const intl = useIntl();
  const translated = useTranslate();

    // DataTable state
    const {selectedFilters, setSelectedFilters, body, page, setPage, perPage, sort, setSort} = useDataTable({
        initialSort: {field: "id", direction: "asc"}
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
            label: intl.formatMessage({defaultMessage: "Name", description: "Filter label for amenity name"}),
            component: <TextSearchFilter field="name" placeholder={intl.formatMessage({
                defaultMessage: "Search by amenity name",
                description: "Placeholder for amenity name search"
            })}/>,
        },
        {
            name: "is_featured",
            featured: true,
            label: intl.formatMessage({defaultMessage: "Featured", description: "Filter label for featured amenities"}),
            component: <BooleanRadioFilter
                field="is_featured"
                trueLabel={intl.formatMessage({
                    defaultMessage: "Featured",
                    description: "Label for featured amenities filter option"
                })}
                falseLabel={intl.formatMessage({
                    defaultMessage: "Not featured",
                    description: "Label for not featured amenities filter option"
                })}
            />,
        },
    ]);

    return (
        <Page size="md">
            <PageHeaderContainer>
                <PageHeader className="grow">
                    <PageTitle>
                        <FormattedMessage defaultMessage="Amenities" description="Page title for amenities list"/>
                    </PageTitle>
                    <PageDescription>
                        <FormattedMessage defaultMessage="Browse and manage all amenities available in your system."
                                          description="Page description for amenities list"/>
                    </PageDescription>
                </PageHeader>
                <PageActions className="gap-2">
                    <Button size="sm" asChild>
                        <Link modal to="/pms/amenities/new">
                            <Plus/> <FormattedMessage defaultMessage="Add amenity"
                                                      description="Button text to add a new amenity"/>
                        </Link>
                    </Button>
                </PageActions>
            </PageHeaderContainer>

            <PageContent>
                <Filters
                    className="mb-2"
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
                  className="mt-2 grow"
                  records={query.data?.data || []}
                  loading={query.isLoading}
                  columnDef={getColumns(intl, translated)}
                />

                <QueryPagination
                    pageNumber={page}
                    totalRecords={query.data?.total}
                    recordsPerPage={perPage}
                    onChange={setPage}
                />
            </PageContent>
        </Page>
    );
}
import {
    Page,
    PageActions,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContainer,
    PageTitle
} from "@/components/application/page";
import {Filters} from "@/components/application/filters/filters";
import {
    ColumnDef,
} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {
    CircleAlert,
    Copy,
    DollarSign,
    Download,
    MoreHorizontal,
    Plus,
    Settings2,
    User,
    Bed,
    Bath
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import {Property} from "@onemineral/pms-js-sdk";
import Link from "@/components/application/link.tsx";
import TextSearchFilter from "@/components/application/filters/types/text-search-filter";
import {DataTable} from "@/components/application/data-table";
import useFiltersDefinition from "@/components/application/filters/hooks/use-filters-definition";
import FixedFormActions from "@/components/application/fixed-form-actions";
import {useState} from "react";
import DataTablePagination from "@/components/application/data-table-pagination";
import PropertyStatusBadge from "@/components/application/statuses/property-status-badge";
import { useDataTable } from "@/hooks/use-data-table";
import SortDropdown from "@/components/application/sort-dropdown";
import CircularProgress from "@/components/customized/progress/curcular-progress";
import { translated } from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

function getProgressProps(score: number) {
    if(score > 90) {
        return {
            className: 'stroke-green-500/25',
            progressClassName: 'stroke-green-600'
        };
    }

    if(score > 80) {
        return {
            className: 'stroke-lime-500/25',
            progressClassName: 'stroke-lime-600'
        };
    }

    if(score > 70) {
        return {
            className: 'stroke-yellow-500/25',
            progressClassName: 'stroke-yellow-400'
        };
    }

    if(score > 60) {
        return {
            className: 'stroke-orange-400/25',
            progressClassName: 'stroke-orange-500'
        };
    }

    return {
        className: 'stroke-red-500/25',
        progressClassName: 'stroke-red-600'
    };
}

const columns: ColumnDef<Property>[] = [
    {
        enablePinning: true,
        enableResizing: false,
        accessorKey: "image",
        size: 50,
        header: '',
        cell: ({row}) =>
            <Link modal to={`/calendar/${row.original.id}`}>
                <Avatar className="size-12 rounded-md">
                    <AvatarImage src={row.original.main_image?.thumbnail} alt={translated(row.original.name)} />
                    <AvatarFallback className="text-xs rounded-md">
                        {translated(row.original.name).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </Link>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => <>
            <Link modal to={`/calendar/${row.original.id}`}>
                {translated(row.original.name)}
                {row.original.internal_name ? <>
                    <br/>
                    <span className={"text-muted-foreground"}>{row.original.internal_name}</span>
                </> : null}
            </Link>

            <br />
            <span className="inline-flex space-x-2">
                <Link modal to={`/calendar/${row.original.id}`} className="text-xs text-sky-700">
                    Calendar
                </Link>
                <Link modal to={`/`} className="text-xs text-sky-700">
                    Integrations
                </Link>
            </span>
        </>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => <PropertyStatusBadge property={row.original} refetchQueryKeys={['properties.list']} />,
    },
    {
        accessorKey: 'occupancy',
        header: 'Occupancy',
        cell: ({row}) => (
            <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1">
                    <User className="size-4 text-muted-foreground" />
                    {row.original.max_occupancy}
                </span>
                <span className="flex items-center gap-1">
                    <Bed className="size-4 text-muted-foreground" />
                    {row.original.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                    <Bath className="size-4 text-muted-foreground" />
                    {row.original.bathrooms}
                </span>
            </div>
        )
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({row}) => (translated(row.original.location?.name)),
    },
    {
        accessorKey: 'score',
        header: 'Property health',
        cell: ({row}) => (
            <CircularProgress
                value={row.original.health_score_done_percent ?? 0}
                size={75}
                strokeWidth={5}
                showLabel
                labelClassName="text-xs"
                renderLabel={(progress) => `${progress}%`}
                {...getProgressProps(row.original.health_score_done_percent ?? 0)}
            />
        )
    },
    {
        id: "actions",
        size: 50,
        enableResizing: false,
        enableHiding: false,
        enablePinning: true,
        header: () => {
            return <Button variant={'ghost'} size={'sm'}>
                <Settings2 className={'size-4'}/>
            </Button>
        },
        cell: ({row}) => {
            const property = row.original
            return (<>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={'dark'}>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(property.id.toString())}
                            >
                                <Copy /> Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem><User /> View customer</DropdownMenuItem>
                            <DropdownMenuItem><DollarSign /> View payment details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
];

export default function PropertiesList() {
    const {selectedFilters, setSelectedFilters, body, page, setPage, perPage, sort, setSort} = useDataTable({
        initialSort: {field: 'id', direction: 'asc'},
    });

    const [selectedProperties, setSelectedProperties] = useState<(number|string)[]>([]);

    const query = useQuery({
        queryKey: ['properties.list', body],
        queryFn: async () => {        
            if (body === undefined) {
                return null;
            }
            return (await api.property.query(body)).response;
        },
    });

    const availableFilters = useFiltersDefinition('property', [
        {
            name: 'name',
            featured: true,
            label: 'Name',
            component: <TextSearchFilter field={'name'} placeholder={'Search by property name'}/>,
        },
        {field: 'status', featured: true},
    ]);

    return <Page size={'md'}>
        <PageHeaderContainer>
            <PageHeader>
                <PageTitle>Properties</PageTitle>
                <PageDescription>You'll find all your properties here</PageDescription>
            </PageHeader>
            <PageActions className={'gap-2'}>
                <Button size={'sm'} asChild><Link modal to={`/calendar-update/65`}><Plus/> Add property</Link></Button>
                <Button variant={'outline'} size={'sm'}><Download/> Export</Button>
            </PageActions>
        </PageHeaderContainer>

        <PageContent>
            <Filters
                className={'mb-2 grow'}
                onFiltersChange={setSelectedFilters}
                availableFilters={availableFilters}
                selectedFilters={selectedFilters}
            >
                <SortDropdown resource="property" sort={sort} availableFields={['id', 'name', 'health_score_done_percent', 'bedrooms', 'max_occupancy']} onChange={setSort} />
            </Filters>


            <DataTable
                className={'mt-2'}
                onSelectChange={setSelectedProperties}
                records={query.data?.data || []}
                loading={query.isLoading}
                columnDef={columns}
            />

            <DataTablePagination
                pageNumber={page}
                totalRecords={query.data?.total}
                recordsPerPage={perPage}
                onChange={setPage}
            />

            <FixedFormActions visible={selectedProperties.length > 0} className={'bottom-20 md:bottom-7'}>
                <CircleAlert className={'text-orange-300 size-5 ml-1'}/>
                <div className={'mr-10 text-mute'}>
                    {selectedProperties.length} selected
                </div>
                <Button variant={"outline"} size={'sm'}>Reset</Button>
                <Button variant={'default'} size={'sm'}>Save</Button>
            </FixedFormActions>
        </PageContent>
    </Page>;
}
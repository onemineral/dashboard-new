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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import Link from "@/components/application/link.tsx";
import TextSearchFilter from "@/components/application/filters/types/text-search-filter";
import {DataTable} from "@/components/application/data/data-table.tsx";
import useFiltersDefinition from "@/components/application/filters/hooks/use-filters-definition";
import FixedFormActions from "@/components/application/fixed-form-actions";
import {useState} from "react";
import QueryPagination from "@/components/application/data/query-pagination.tsx";
import PropertyStatusBadge from "@/components/application/statuses/property-status-badge";
import {useDataTable} from "@/hooks/use-data-table";
import SortDropdown from "@/components/application/data/sort-dropdown.tsx";
import CircularProgress from "@/components/customized/progress/curcular-progress";
import {mergeObjects} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {FormattedMessage, useIntl} from "react-intl";
import {Property} from "@sdk/generated";
import {useTranslate} from "@/hooks/use-translate.ts";

function getProgressProps(score: number) {
    if (score > 90) {
        return {
            className: 'stroke-green-500/25',
            progressClassName: 'stroke-green-600'
        };
    }

    if (score > 80) {
        return {
            className: 'stroke-lime-500/25',
            progressClassName: 'stroke-lime-600'
        };
    }

    if (score > 70) {
        return {
            className: 'stroke-yellow-500/25',
            progressClassName: 'stroke-yellow-400'
        };
    }

    if (score > 60) {
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

export default function PropertiesList() {
    const intl = useIntl();
    const translated = useTranslate();

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
                        <AvatarImage src={row.original.main_image?.thumbnail} alt={translated(row.original.name)}/>
                        <AvatarFallback className="text-xs rounded-md">
                            {translated(row.original.name).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Link>,
        },
        {
            accessorKey: "name",
            header: intl.formatMessage({defaultMessage: "Name", description: "Property name column header"}),
            cell: ({row}) => <>
                <Link modal to={`/calendar/${row.original.id}`}>
                    {translated(row.original.name)}
                    {row.original.internal_name ? <>
                        <br/>
                        <span className={"text-muted-foreground"}>{row.original.internal_name}</span>
                    </> : null}
                </Link>

                <br/>
                <span className="inline-flex space-x-2">
                    <Link modal to={`/calendar/${row.original.id}`} className="text-xs text-sky-700">
                        <FormattedMessage defaultMessage="Calendar" description="Link to property calendar"/>
                    </Link>
                    <Link modal to={`/`} className="text-xs text-sky-700">
                        <FormattedMessage defaultMessage="Integrations" description="Link to property integrations"/>
                    </Link>
                </span>
            </>,
        },
        {
            accessorKey: "status",
            header: intl.formatMessage({defaultMessage: "Status", description: "Property status column header"}),
            cell: ({row}) => <PropertyStatusBadge property={row.original} refetchQueryKeys={['properties.list']}/>,
        },
        {
            accessorKey: 'occupancy',
            header: intl.formatMessage({defaultMessage: "Occupancy", description: "Property occupancy column header"}),
            cell: ({row}) => (
                <div className="flex items-center space-x-4">
                    <span className="flex items-center gap-1">
                        <User className="size-4 text-muted-foreground"/>
                        {row.original.max_occupancy}
                    </span>
                    <span className="flex items-center gap-1">
                        <Bed className="size-4 text-muted-foreground"/>
                        {row.original.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                        <Bath className="size-4 text-muted-foreground"/>
                        {row.original.bathrooms}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "location",
            header: intl.formatMessage({defaultMessage: "Location", description: "Property location column header"}),
            cell: ({row}) => (translated(row.original.location?.name)),
        },
        {
            accessorKey: 'channel_connections',
            header: intl.formatMessage({
                defaultMessage: "Channels",
                description: "Property channel connections column header"
            }),
            cell: ({row}) => {
                const connections = row.original.channel_connections;
                if (!connections || connections.length === 0) {
                    return null;
                }

                const mainChannels = ['airbnb', 'booking-com', 'homeaway'];
                const filteredConnections = connections.filter(
                    (conn) => mainChannels.includes(conn.provider)
                );

                if (filteredConnections.length === 0) {
                    return null;
                }

                const maxDisplay = 3;
                const displayConnections = filteredConnections.slice(0, maxDisplay);
                const remainingCount = filteredConnections.length - maxDisplay;

                return (
                    <TooltipProvider>
                            <Link to={`/pms/properties/${row.original.id}/calendar`} modal className="flex -space-x-2">
                            {displayConnections.map((conn) => (
                                <Tooltip key={conn.id}>
                                    <TooltipTrigger asChild>
                                        <Avatar
                                            className="size-9 rounded-full border-2 border-background bg-slate-100 p-0.5">
                                            <AvatarImage
                                                src={conn.channel?.icon_url}
                                                alt={conn.provider}
                                                className="p-1"
                                            />
                                            <AvatarFallback className="text-xs bg-slate-100">
                                                {conn.provider.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{conn.channel?.name || conn.provider}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                            {remainingCount > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar
                                            className="size-9 rounded-full border-2 border-background bg-slate-100 p-0.5">
                                            <AvatarFallback className="text-xs bg-slate-100">
                                                +{remainingCount}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <FormattedMessage
                                            defaultMessage="{count, plural, one {+1 more connection} other {+# more connections}}"
                                            values={{count: remainingCount}}
                                            description="Additional channel connections count"
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            </Link>
                    </TooltipProvider>
                );
            }
        },
        {
            accessorKey: 'score',
            header: intl.formatMessage({
                defaultMessage: "Property health",
                description: "Property health score column header"
            }),
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
                                    <span className="sr-only">
                                        <FormattedMessage defaultMessage="Open menu"
                                                          description="Open actions menu for property"/>
                                    </span>
                                    <MoreHorizontal/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={'dark'}>
                                <DropdownMenuItem
                                    onClick={() => navigator.clipboard.writeText(property.id.toString())}
                                >
                                    <Copy/> <FormattedMessage defaultMessage="Copy property ID"
                                                              description="Copy property ID to clipboard"/>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>
                                    <User/> <FormattedMessage defaultMessage="View customer"
                                                              description="View customer details"/>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <DollarSign/> <FormattedMessage defaultMessage="View payment details"
                                                                    description="View payment details"/>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )
            },
        },
    ];
    const {selectedFilters, setSelectedFilters, body, page, setPage, perPage, sort, setSort} = useDataTable({
        initialSort: {field: 'id', direction: 'asc'},
    });

    const [selectedProperties, setSelectedProperties] = useState<(number | string)[]>([]);

    const query = useQuery({
        queryKey: ['properties.list', body],
        queryFn: async () => {
            if (body === undefined) {
                return null;
            }
            return (await api.property.query(mergeObjects(body, {
                with: ['channel_connections.channel']
            }))).response;
        },
    });

    const availableFilters = useFiltersDefinition('property', [
        {
            name: 'name',
            featured: true,
            label: intl.formatMessage({defaultMessage: "Name", description: "Property name filter label"}),
            component: <TextSearchFilter field={'name'}
                                         placeholder={intl.formatMessage({
                                             defaultMessage: 'Search by property name',
                                             description: 'Search by property name placeholder'
                                         })}/>,
        },
        {field: 'status', featured: true},
    ]);

    return <Page size={'md'}>
        <PageHeaderContainer>
            <PageHeader>
                <PageTitle><FormattedMessage defaultMessage="Properties"
                                             description="Properties page title"/></PageTitle>
                <PageDescription>
                    <FormattedMessage defaultMessage="You'll find all your properties here"
                                      description="Properties page description"/>
                </PageDescription>
            </PageHeader>
            <PageActions className={'gap-2'}>
                <Button size={'sm'} asChild>
                    <Link modal to={`/calendar-update/65`}>
                        <Plus/> <FormattedMessage defaultMessage="Add property" description="Add new property button"/>
                    </Link>
                </Button>
                <Button variant={'outline'} size={'sm'}>
                    <Download/> <FormattedMessage defaultMessage="Export" description="Export properties button"/>
                </Button>
            </PageActions>
        </PageHeaderContainer>

        <PageContent>
            <Filters
                className={'mb-2'}
                onFiltersChange={setSelectedFilters}
                availableFilters={availableFilters}
                selectedFilters={selectedFilters}
            >
                <SortDropdown resource="property" sort={sort}
                              availableFields={['id', 'name', 'health_score_done_percent', 'bedrooms', 'max_occupancy']}
                              onChange={setSort}/>
            </Filters>


            <DataTable
                className={'mt-2 grow'}
                onSelectChange={setSelectedProperties}
                records={query.data?.data || []}
                loading={query.isLoading}
                columnDef={columns}
            />

            <QueryPagination
                pageNumber={page}
                totalRecords={query.data?.total}
                recordsPerPage={perPage}
                onChange={setPage}
            />

            <FixedFormActions visible={selectedProperties.length > 0} className={'bottom-20 md:bottom-7'}>
                <CircleAlert className={'text-orange-300 size-5 ml-1'}/>
                <div className={'mr-10 text-mute'}>
                    <FormattedMessage
                        defaultMessage={`{count} {count, plural, one {property selected} other {properties selected}}.`}
                        values={{
                            count: selectedProperties.length
                        }}
                        description={'The number of selected properties'}/>
                </div>
                <Button variant={"outline"} size={'sm'}>
                    <FormattedMessage defaultMessage="Reset" description="Reset selection button"/>
                </Button>
                <Button variant={'default'} size={'sm'}>
                    <FormattedMessage defaultMessage="Save" description="Save changes button"/>
                </Button>
            </FixedFormActions>
        </PageContent>
    </Page>;
}
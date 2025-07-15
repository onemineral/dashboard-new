import {
    Page,
    PageActions,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContainer,
    PageTitle
} from "@/components/page.tsx";
import {Filters} from "@/components/filters/filters.tsx";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {
    ColumnDef,
} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {
    ArrowDown10,
    ArrowDownUp, ArrowDownZA, ArrowUp01, ArrowUpAZ,
    CircleAlert,
    Copy,
    DollarSign,
    Download,
    MoreHorizontal,
    Plus,
    Settings2,
    User
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
import {mergeObjects} from "@/lib/utils.ts";
import Link from "@/components/application/link.tsx";
import {useFiltersRequest} from "@/components/filters/hooks/use-filters-request.ts";
import TextSearchFilter from "@/components/filters/types/text-search-filter.tsx";
import {DataTable} from "@/components/data-table.tsx";
import useFiltersDefinition from "@/components/filters/hooks/use-filters-definition.tsx";
import FixedFormActions from "@/components/fixed-form-actions.tsx";
import {useState} from "react";

const columns: ColumnDef<Property>[] = [
    {
        enablePinning: true,
        enableResizing: false,
        accessorKey: "image",
        size: 70,
        header: '',
        cell: ({row}) =>
            <Link modal to={`/calendar/${row.original.id}`}><img src={row.original.main_image?.thumbnail}
                                                                    className={'size-12 ml-1 my-1 rounded'}/></Link>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => <Link modal to={`/calendar/${row.original.id}`}>{row.original.name.en}<br/><span
            className={"text-muted-foreground"}>{row.original.internal_name}</span></Link>,
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "bedrooms",
        header: "Bedrooms",
    },
    {
        accessorKey: "bathrooms",
        header: "Bathrooms",
    },
    {
        accessorKey: "property_type",
        header: "Property type",
        cell: ({row}) => (row.original.property_type?.name?.en),
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({row}) => (row.original.location?.name?.en),
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
    const {selectedFilters, setSelectedFilters, body} = useFiltersRequest([{body: {where: {conditions: [
        {field: 'status', in: ['enabled']}]}}, name: 'status', value: ['enabled']}
    ]);

    const [selectedProperties, setSelectedProperties] = useState<(number|string)[]>([]);

    const query = useQuery({
        queryKey: [body, 'properties.list'],
        queryFn: async () => {
            if (body === undefined) {
                return null;
            }
            return (await api.property.query(mergeObjects({paginate: {perpage: 20}}, body))).response;
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
        'room_category_type',
        'checkin_category',
    ]);

    return <Page size={'md'}>
        <PageHeaderContainer>
            <PageHeader className={'grow'}>
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'} size={'sm'}><ArrowDownUp/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-46 dark" align="start">
                        <DropdownMenuItem className={'flex justify-between'}><span>Name</span> <span><ArrowUpAZ className={'text-white size-5'} /></span></DropdownMenuItem>
                        <DropdownMenuItem className={'flex justify-between'}><span>Name</span> <span><ArrowDownZA className={'text-white size-5'} /></span></DropdownMenuItem>
                        <DropdownMenuItem className={'flex justify-between'}><span>Bedrooms</span> <span><ArrowUp01 className={'text-white size-5'} /></span></DropdownMenuItem>
                        <DropdownMenuItem className={'flex justify-between'}><span>Bedrooms</span> <span><ArrowDown10 className={'text-white size-5'} /></span></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Filters>


            <DataTable
                className={'mt-2'}
                onSortChange={(records: Property[]) => {console.log(records)}}
                onSelectChange={setSelectedProperties}
                records={query.data?.data || []}
                loading={query.isLoading}
                columnDef={columns}
            />

            <Pagination className={'py-4'}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#"/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#"/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <FixedFormActions visible={selectedProperties.length > 0} className={'bottom-20 md:bottom-7'}>
                <CircleAlert className={'text-orange-300 size-5 ml-1'}/>
                <div className={'mr-10 text-mute'}>
                    {selectedProperties.length} selected
                </div>
                <Button variant={"outline"} className={''} size={'sm'}>Reset</Button>
                <Button variant={'default'} size={'sm'}>Save</Button>
            </FixedFormActions>
        </PageContent>
    </Page>;
}
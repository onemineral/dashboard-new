import {
    closestCenter, DndContext,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import React, {CSSProperties, ReactNode, useEffect, useMemo, useState} from "react";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {CSS} from "@dnd-kit/utilities";
import {cn} from "@/lib/utils.ts";
import {Ghost, GripVertical} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
    const isPinned = column.getIsPinned()

    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getCanResize() ? undefined : column.getSize(),
        minWidth: column.getCanResize() ? undefined : column.getSize(),
        zIndex: isPinned ? 1 : 0,
    }
}

export const DataTable = ({
                              records,
                              columnDef,
                              loading = false,
                              emptyElement,
                              onSortChange,
                              onSelectChange,
                              className,
                          }: {
    records: any[],
    columnDef: ColumnDef<any>[],
    loading?: boolean,
    emptyElement?: ReactNode,
    onSortChange?: (records: any[]) => void,
    onSelectChange?: (selectedIds: (string | number)[]) => void,
    className?: string,
}) => {
    const [data, setData] = useState<any[]>(records);

    const columns = useMemo(() => {
        let retColumns: ColumnDef<any>[] = columnDef;

        if (onSelectChange) {
            retColumns = [
                {
                    enablePinning: true,
                    enableResizing: false,
                    accessorKey: "selector",
                    size: 25,
                    header: ({table}) => (<Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && "indeterminate")
                            }
                            className={'bg-white'}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                        />
                    ),
                    cell: ({row}) => <Checkbox
                        className={'ml-1'}
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />,
                },
                ...retColumns,
            ];
        }

        if (onSortChange) {
            retColumns = [
                {
                    id: "drag-handle",
                    enablePinning: true,
                    enableResizing: false,
                    size: 25,
                    cell: () => <GripVertical size={17} className={'text-gray-700'}/>,
                    header: "",
                },
                ...retColumns,
            ];
        }

        return retColumns;
    }, [columnDef, onSortChange])

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
    );

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({id}) => id),
        [data]
    )

    useEffect(() => {
        setData(records);
    }, [records]);

    // reorder rows after drag & drop
    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event

        if (active && over && active.id !== over.id) {
            const oldIndex = dataIds.indexOf(active.id)
            const newIndex = dataIds.indexOf(over.id)
            const newData = arrayMove(data, oldIndex, newIndex) //this is just a splice util
            setData(newData);
            onSortChange?.(newData);
        }
    }

    if (loading) {
        return <LoadingTable/>
    }

    if (!records.length) {
        if (emptyElement) {
            return emptyElement;
        } else {
            return <EmptyTable/>;
        }
    }

    return <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onSortChange ? handleDragEnd : undefined}
        sensors={onSortChange ? sensors : undefined}
    >
        <RTable data={data} columns={columns} onSelectChange={onSelectChange} className={className}/>
    </DndContext>;
}

function getPinned(columns: ColumnDef<any>[]): string[] {
    const result: string[] = [];

    for (const i in columns) {
        if (columns[i].enablePinning) {
            result.push(columns[i].id || (columns[i] as any).accessorKey);
        } else {
            break;
        }
    }

    return result;
}

const RTable = ({data, columns, onSelectChange, className}: {
    data: any[],
    columns: ColumnDef<any>[],
    onSelectChange?: (selectedIds: (string | number)[]) => void,
    className?: string,
}) => {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id.toString(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        state: {
            columnVisibility,
            rowSelection,
        },
        initialState: {
            columnPinning: {
                left: getPinned(columns),
                right: getPinned([...columns].reverse()),
            },
        }
    });

    useEffect(() => {
        if (onSelectChange) {
            onSelectChange(Object.keys(rowSelection));
        }
    }, [onSelectChange, rowSelection]);

    return <Table className={cn('table-auto border-b border-accent', className)}>
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className={'border-accent'} key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                            <TableHead key={header.id}
                                       className={'bg-muted'}
                                       style={getCommonPinningStyles(header.column)}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableHead>
                        )
                    })}
                </TableRow>
            ))}
        </TableHeader>
        <TableBody>
            <SortableContext
                items={data?.map(({id}) => id)}
                strategy={verticalListSortingStrategy}
            >
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row}/>)
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </SortableContext>
        </TableBody>
    </Table>;
}

const DraggableRow = ({row}: { row: Row<any> }) => {
    const {transform, transition, setNodeRef, isDragging, listeners, attributes} = useSortable({
        id: row.original.id,
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    }

    return <TableRow
        ref={setNodeRef}
        style={style}
        className={'group border-accent'}
        data-state={row.getIsSelected() && "selected"}
    >
        {row.getVisibleCells().map((cell) => (
            <TableCell
                className={cn('group-hover:bg-muted p-1', {
                    'bg-background ': !row.getIsSelected(),
                    'bg-accent': row.getIsSelected(),
                    'cursor-pointer': cell.column.id == 'drag-handle',
                })}
                style={getCommonPinningStyles(cell.column)}
                key={cell.id}
                {...(cell.column.id == 'drag-handle' ? {...attributes, ...listeners} : {})}
            >
                {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                )}
            </TableCell>
        ))}
    </TableRow>
};

export const LoadingTable = () => {
    const numRows = 7; // Number of skeleton rows to display
    const numCols = 1; // Number of skeleton columns to display (adjust based on your typical table)

    return (
        <Table className={'table-auto border-b border-accent'}>
            <TableHeader>
                <TableRow className={'border-accent'}>
                    {Array.from({length: numCols}).map((_, i) => (
                        <TableHead key={i} className={'bg-background'}>
                            {/* Skeleton for header text */}
                            <Skeleton className="h-5 w-[50%]"/>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({length: numRows}).map((_, rowIndex) => (
                    <TableRow key={rowIndex} className={'border-accent'}>
                        {Array.from({length: numCols}).map((_, colIndex) => (
                            <TableCell key={colIndex} className="p-3">
                                {/* Skeleton for cell content */}
                                <Skeleton className="h-5 w-full"/>
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export const EmptyTable = () => {
    return <div
        className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-input p-12 text-center">
        <Ghost className="h-20 w-20 text-muted-foreground"/>
        <h3 className="text-xl font-semibold tracking-tight">
            It's a Ghost Town in Here!
        </h3>
        <p className="max-w-sm text-muted-foreground">
            Looks like the data has vanished. We've sent a search party, but for now, this space is spookily empty.
        </p>
    </div>
}
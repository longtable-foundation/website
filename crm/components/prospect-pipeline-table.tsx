"use client"

import { useMemo } from "react"
import {
  useDataTable,
  DataTable,
  DataTableColumnHeader,
  DataTableTitle,
  DataTableSearch,
  DataTableFilters,
  DataTableFilterChips,
  DataTableViewOptions,
  DataTablePagination,
  selectColumn,
  useUndoableRows,
  type ColumnDef,
} from "@/components/ui/data-table"
import {
  PROSPECT_OWNERS,
  PROSPECT_PRIORITIES,
  PROSPECT_SEED,
  PROSPECT_TYPES,
  type Prospect,
} from "@/lib/prospects"

const typeOptions = [...PROSPECT_TYPES]
const ownerOptions = [...PROSPECT_OWNERS]
const priorityOptions = [...PROSPECT_PRIORITIES]

function formatCellValue(value: unknown): string {
  if (value == null) return ""
  if (value instanceof Date) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, "0")
    const d = String(value.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }
  if (Array.isArray(value)) return value.join(", ")
  return String(value)
}

export function ProspectPipelineTable() {
  const { rows, edit, undo, redo } = useUndoableRows(PROSPECT_SEED, {
    getId: (r) => r.id,
  })

  const columns = useMemo<ColumnDef<Prospect>[]>(
    () => [
      selectColumn<Prospect>(),
      {
        accessorKey: "organization",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Organization" />
        ),
        meta: {
          label: "Organization",
          editor: "text",
          className: "min-w-[160px]",
        },
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        meta: {
          label: "Type",
          editor: { type: "select", options: typeOptions },
          filter: { type: "options", options: typeOptions },
        },
      },
      {
        accessorKey: "signed",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Signed?" />
        ),
        meta: {
          label: "Signed?",
          editor: "text",
        },
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Priority" />
        ),
        meta: {
          label: "Priority",
          editor: { type: "select", options: priorityOptions },
          filter: { type: "options", options: priorityOptions },
        },
      },
      {
        accessorKey: "stage",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stage" />
        ),
        meta: {
          label: "Stage",
          editor: "text",
          className: "min-w-[140px]",
        },
      },
      {
        accessorKey: "owner",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Owner" />
        ),
        meta: {
          label: "Owner",
          editor: { type: "select", options: ownerOptions },
          filter: { type: "options", options: ownerOptions },
        },
      },
      {
        accessorKey: "nextAction",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Next action" />
        ),
        meta: {
          label: "Next action",
          editor: "text",
          lines: 2,
          className: "min-w-[220px]",
        },
      },
      {
        accessorKey: "orgPoc",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Org POC" />
        ),
        meta: {
          label: "Org POC",
          editor: "text",
        },
      },
      {
        accessorKey: "lastTouch",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last touch" />
        ),
        meta: {
          label: "Last touch",
          editor: "date",
          filter: "date",
        },
      },
      {
        accessorKey: "notes",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Notes" />
        ),
        meta: {
          label: "Notes",
          editor: "text",
          lines: 2,
          className: "min-w-[240px]",
        },
      },
    ],
    []
  )

  const table = useDataTable({
    data: rows,
    columns,
    getRowId: (row) => row.id,
    pageSize: 20,
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <DataTableTitle table={table}>Prospect pipeline</DataTableTitle>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <DataTableFilters table={table} />
          <DataTableViewOptions table={table} />
          <DataTableSearch table={table} placeholder="Search prospects…" />
        </div>
      </div>
      <DataTableFilterChips table={table} />
      <DataTable
        table={table}
        fill
        resizeColumns
        onCellEdit={({ row, columnId, value }) => {
          edit(row.id, {
            [columnId]: formatCellValue(value),
          } as Partial<Prospect>)
        }}
        onUndo={undo}
        onRedo={redo}
      />
      <DataTablePagination table={table} pageSizes={[10, 20, 50, 100]} />
    </div>
  )
}

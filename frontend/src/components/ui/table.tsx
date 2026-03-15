"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Table                                                              */
/* ------------------------------------------------------------------ */

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Add striped row styling */
  striped?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, striped, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-xl border border-gray-200/60 dark:border-gray-700/40">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          striped && "table-striped",
          className
        )}
        data-striped={striped ? "" : undefined}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

/* ------------------------------------------------------------------ */
/*  Table Header                                                       */
/* ------------------------------------------------------------------ */

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-gray-50/80 dark:bg-gray-800/50",
      "backdrop-blur-sm",
      "[&_tr]:border-b [&_tr]:border-gray-200/60 dark:[&_tr]:border-gray-700/40",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

/* ------------------------------------------------------------------ */
/*  Table Body                                                         */
/* ------------------------------------------------------------------ */

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0",
      className
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/* ------------------------------------------------------------------ */
/*  Table Footer                                                       */
/* ------------------------------------------------------------------ */

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-gray-50/50 dark:bg-gray-800/30 font-medium",
      "border-t border-gray-200/60 dark:border-gray-700/40",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/* ------------------------------------------------------------------ */
/*  Table Row                                                          */
/* ------------------------------------------------------------------ */

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-gray-100/80 dark:border-gray-800/40",
      "transition-colors duration-150",
      "hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20",
      "data-[state=selected]:bg-emerald-50 dark:data-[state=selected]:bg-emerald-950/30",
      /* Striped styling via parent's data attribute */
      "[table[data-striped]_&:nth-child(even)]:bg-gray-50/50",
      "dark:[table[data-striped]_&:nth-child(even)]:bg-gray-800/20",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/* ------------------------------------------------------------------ */
/*  Table Head (th)                                                    */
/* ------------------------------------------------------------------ */

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Indicate this column is sortable */
  sortable?: boolean;
  /** Current sort direction */
  sortDirection?: "asc" | "desc" | null;
  /** Sort click handler */
  onSort?: () => void;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-11 px-4 text-left align-middle font-semibold text-gray-600 dark:text-gray-400",
        "text-xs uppercase tracking-wider",
        sortable && "cursor-pointer select-none hover:text-emerald-700 dark:hover:text-emerald-400",
        className
      )}
      onClick={sortable ? onSort : undefined}
      aria-sort={
        sortDirection === "asc"
          ? "ascending"
          : sortDirection === "desc"
            ? "descending"
            : undefined
      }
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {children}
        {sortable && (
          <span className="inline-flex flex-col">
            <svg
              className={cn(
                "h-2.5 w-2.5 -mb-0.5 transition-colors",
                sortDirection === "asc"
                  ? "text-emerald-600"
                  : "text-gray-300 dark:text-gray-600"
              )}
              viewBox="0 0 10 6"
              fill="currentColor"
            >
              <path d="M5 0L10 6H0z" />
            </svg>
            <svg
              className={cn(
                "h-2.5 w-2.5 transition-colors",
                sortDirection === "desc"
                  ? "text-emerald-600"
                  : "text-gray-300 dark:text-gray-600"
              )}
              viewBox="0 0 10 6"
              fill="currentColor"
            >
              <path d="M5 6L0 0h10z" />
            </svg>
          </span>
        )}
      </div>
    </th>
  )
);
TableHead.displayName = "TableHead";

/* ------------------------------------------------------------------ */
/*  Table Cell (td)                                                    */
/* ------------------------------------------------------------------ */

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle text-gray-700 dark:text-gray-300",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/* ------------------------------------------------------------------ */
/*  Table Caption                                                      */
/* ------------------------------------------------------------------ */

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-3 text-sm text-gray-500 dark:text-gray-400",
      className
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};

"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-base font-bold text-cyan-900",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white p-0 border-cyan-300 hover:bg-cyan-50 hover:border-cyan-500"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "grid grid-cols-7 gap-0",
        head_cell:
          "text-cyan-800 font-bold text-xs flex items-center justify-center h-9",
        row: "grid grid-cols-7 gap-0 mt-2",
        cell: "text-center text-sm p-0 relative flex items-center justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-cyan-50 rounded-md"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-br from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700 focus:from-cyan-600 focus:to-teal-700 font-bold",
        day_today: "bg-cyan-50 text-cyan-900 font-bold border border-cyan-500",
        day_outside:
          "day-outside text-gray-400 opacity-50 aria-selected:bg-cyan-100/50 aria-selected:text-gray-500",
        day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-cyan-100 aria-selected:text-cyan-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

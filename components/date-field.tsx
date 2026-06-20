"use client";

import { CalendarBlankIcon } from "@phosphor-icons/react";
import {
  Button,
  DatePicker,
  Field,
  Popover,
} from "@cloudflare/kumo";

function formatDate(date?: Date) {
  return date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    : "Select date";
}

export function DateField({
  label,
  value,
  onChange,
  error,
  minDate,
  maxDate,
}: {
  label: string;
  value?: Date;
  onChange: (value?: Date) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}) {
  return (
    <Field
      label={label}
      error={error ? { message: error, match: true } : undefined}
    >
      <Popover>
        <Popover.Trigger
          render={
            <Button
              type="button"
              variant="outline"
              icon={CalendarBlankIcon}
              className={`h-10! w-full! justify-start! rounded-lg! bg-white! px-4! text-left! font-normal! ${
                error ? "border-red-600!" : "border-black/15!"
              }`}
            />
          }
        >
          {formatDate(value)}
        </Popover.Trigger>
        <Popover.Content
          side="bottom"
          align="start"
          positionMethod="fixed"
          className="z-[90]! max-w-[calc(100vw-2rem)]! rounded-xl! p-3!"
        >
          <Popover.Title className="sr-only">{label}</Popover.Title>
          <DatePicker
            mode="single"
            selected={value}
            onChange={onChange}
            defaultMonth={value ?? maxDate ?? minDate}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            startMonth={minDate}
            endMonth={maxDate}
            captionLayout="dropdown"
          />
        </Popover.Content>
      </Popover>
    </Field>
  );
}

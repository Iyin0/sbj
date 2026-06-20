"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ArrowRightIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react";
import {
  Button,
  DatePicker,
  LayerCard,
  Popover,
  Select,
} from "@cloudflare/kumo";
import { useAvailability } from "@/components/availability-provider";
import { apartmentTypes } from "@/lib/site-data";
import {
  quickBookingSchema,
  type QuickBookingValues,
} from "@/lib/form-schemas";
import {
  rangeContainsDateKeys,
  toDateKey,
} from "@/lib/date-utils";
import { saveReservationDraft } from "@/lib/reservation-session";

function formatDisplayDate(date?: Date) {
  return date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
    : "Select date";
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function QuickBooking() {
  const router = useRouter();
  const { blockedDateKeys, blockedDates } = useAvailability();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<QuickBookingValues>({
    resolver: zodResolver(quickBookingSchema),
    defaultValues: {
      residence: apartmentTypes[0].id as QuickBookingValues["residence"],
      checkIn: undefined,
      checkOut: undefined,
    },
  });
  const checkIn = useWatch({ control, name: "checkIn" });
  const checkOut = useWatch({ control, name: "checkOut" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstBlockedAfterCheckIn = useMemo(() => {
    if (!checkIn) return undefined;
    return blockedDates
      .filter((date) => date > checkIn)
      .sort((left, right) => left.getTime() - right.getTime())[0];
  }, [blockedDates, checkIn]);

  useEffect(() => {
    if (checkIn && blockedDateKeys.includes(toDateKey(checkIn))) {
      setValue("checkIn", undefined as never);
      setValue("checkOut", undefined as never);
      return;
    }

    if (
      checkIn &&
      checkOut &&
      rangeContainsDateKeys(
        { from: checkIn, to: checkOut },
        blockedDateKeys,
      )
    ) {
      setValue("checkOut", undefined as never);
    }
  }, [blockedDateKeys, checkIn, checkOut, setValue]);

  function continueToAvailability(values: QuickBookingValues) {
    if (
      rangeContainsDateKeys(
        { from: values.checkIn, to: values.checkOut },
        blockedDateKeys,
      )
    ) {
      setError("checkOut", {
        message: "Those dates include a reserved date.",
      });
      return;
    }

    saveReservationDraft({
      residence: values.residence,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
    });
    router.push("/reservations", { scroll: true });
  }

  return (
    <form onSubmit={handleSubmit(continueToAvailability)} noValidate>
      <LayerCard className="soft-shadow grid gap-px overflow-hidden! rounded-2xl! bg-black/10! shadow-none! ring-0! lg:grid-cols-[1.15fr_2fr_auto]">
        <div className="bg-[#fbfaf6] p-4 sm:p-5">
          <Controller
            control={control}
            name="residence"
            render={({ field }) => (
              <Select
                label="Residence"
                value={field.value}
                onValueChange={(value) => field.onChange(String(value))}
                error={errors.residence?.message}
                className="w-full! min-w-0 capitalize"
              >
                {apartmentTypes.map((apartment) => (
                  <Select.Option key={apartment.id} value={apartment.id}>
                    {apartment.shortName}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="grid bg-[#fbfaf6] sm:grid-cols-2">
          <div className="min-w-0 border-b border-black/10 p-4 sm:border-b-0 sm:border-r sm:p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarBlankIcon size={16} className="text-[#9c3f28]" />
              Check in
            </div>
            <Controller
              control={control}
              name="checkIn"
              render={({ field }) => (
                <Popover
                  open={checkInOpen}
                  onOpenChange={setCheckInOpen}
                >
                  <Popover.Trigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className={`mt-2 h-12! w-full! justify-start! rounded-lg! bg-white! px-4! text-left! text-sm! font-normal! text-[#625d54]! hover:bg-white! ${
                          errors.checkIn
                            ? "border-red-600!"
                            : "border-black/15!"
                        }`}
                      />
                    }
                  >
                    {formatDisplayDate(field.value)}
                  </Popover.Trigger>
                  <Popover.Content
                    side="bottom"
                    align="start"
                    positionMethod="fixed"
                    className="z-[90]! max-w-[calc(100vw-2rem)]! rounded-xl! p-3!"
                  >
                    <Popover.Title className="sr-only">
                      Select check-in date
                    </Popover.Title>
                    <DatePicker
                      mode="single"
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        clearErrors(["checkIn", "checkOut"]);
                        if (
                          checkOut &&
                          date &&
                          (checkOut <= date ||
                            rangeContainsDateKeys(
                              { from: date, to: checkOut },
                              blockedDateKeys,
                            ))
                        ) {
                          setValue("checkOut", undefined as never);
                        }
                        if (date) {
                          setCheckInOpen(false);
                          setCheckOutOpen(true);
                        }
                      }}
                      defaultMonth={field.value ?? today}
                      disabled={[{ before: today }, ...blockedDates]}
                      fixedWeeks
                    />
                  </Popover.Content>
                </Popover>
              )}
            />
            {errors.checkIn?.message ? (
              <p className="mt-2 text-xs text-red-700">
                {errors.checkIn.message}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarBlankIcon size={16} className="text-[#9c3f28]" />
              Check out
            </div>
            <Controller
              control={control}
              name="checkOut"
              render={({ field }) => (
                <Popover
                  open={checkOutOpen}
                  onOpenChange={setCheckOutOpen}
                >
                  <Popover.Trigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!checkIn}
                        className={`mt-2 h-12! w-full! justify-start! rounded-lg! bg-white! px-4! text-left! text-sm! font-normal! text-[#625d54]! hover:bg-white! disabled:bg-[#f3f0e9]! disabled:text-[#9b958a]! ${
                          errors.checkOut
                            ? "border-red-600!"
                            : "border-black/15!"
                        }`}
                      />
                    }
                  >
                    {formatDisplayDate(field.value)}
                  </Popover.Trigger>
                  <Popover.Content
                    side="bottom"
                    align="start"
                    positionMethod="fixed"
                    className="z-[90]! max-w-[calc(100vw-2rem)]! rounded-xl! p-3!"
                  >
                    <Popover.Title className="sr-only">
                      Select check-out date
                    </Popover.Title>
                    <DatePicker
                      mode="single"
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        clearErrors("checkOut");
                        if (date) setCheckOutOpen(false);
                      }}
                      defaultMonth={field.value ?? checkIn ?? today}
                      disabled={[
                        { before: checkIn ? addDays(checkIn, 1) : today },
                        ...blockedDates,
                        ...(firstBlockedAfterCheckIn
                          ? [{ after: firstBlockedAfterCheckIn }]
                          : []),
                      ]}
                      fixedWeeks
                    />
                  </Popover.Content>
                </Popover>
              )}
            />
            {errors.checkOut?.message ? (
              <p className="mt-2 text-xs text-red-700">
                {errors.checkOut.message}
              </p>
            ) : null}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          icon={ArrowRightIcon}
          className="min-h-20! w-full! rounded-none! rounded-r-xl! bg-[#9c3f28]! px-7! text-xs! font-bold! uppercase! tracking-[0.16em]! text-white! hover:bg-[#74301f]! lg:min-h-full!"
        >
          Check dates
        </Button>
      </LayerCard>
    </form>
  );
}

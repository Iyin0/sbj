"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ArrowClockwiseIcon,
  CalendarXIcon,
  CheckIcon,
  CurrencyNgnIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  DatePicker,
  Empty,
  Grid,
  GridItem,
  Input,
  LayerCard,
  Select,
  Table,
  Tabs,
} from "@cloudflare/kumo";
import { useAvailability } from "@/components/availability-provider";
import { adminReservations, dashboardMetrics } from "@/lib/site-data";
import { usePricing } from "@/components/pricing-provider";
import {
  blockedDatesSchema,
  pricingSchema,
  type BlockedDatesValues,
  type PricingValues,
} from "@/lib/form-schemas";
import {
  formatDateRange,
  fromDateKey,
} from "@/lib/date-utils";
import {
  formatNaira,
} from "@/lib/pricing";

function badgeVariant(status: string) {
  if (status === "Confirmed") return "success" as const;
  if (status === "KYC review") return "info" as const;
  if (status === "Rejected") return "error" as const;
  return "warning" as const;
}

export function AdminDashboard() {
  const { pricing, savePricing } = usePricing();
  const {
    blockedDateKeys,
    blockRange,
    removeBlockedDate,
    clearBlockedDates,
  } = useAvailability();
  const [reservations, setReservations] = useState(adminReservations);
  const [selectedId, setSelectedId] = useState(adminReservations[0].id);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [residenceFilter, setResidenceFilter] = useState("all");
  const [pricingSaved, setPricingSaved] = useState(false);
  const [datesSaved, setDatesSaved] = useState(false);
  const {
    register: registerPricing,
    handleSubmit: handlePricingSubmit,
    reset: resetPricing,
    formState: { errors: pricingErrors },
  } = useForm<PricingValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      twoBedroom: pricing["two-bedroom"],
      threeBedroom: pricing["three-bedroom"],
    },
  });
  const {
    control: availabilityControl,
    handleSubmit: handleAvailabilitySubmit,
    reset: resetAvailability,
    formState: { errors: availabilityErrors },
  } = useForm<BlockedDatesValues>({
    resolver: zodResolver(blockedDatesSchema),
    defaultValues: { range: undefined },
  });
  const selectedBlockedRange = useWatch({
    control: availabilityControl,
    name: "range",
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    resetPricing({
      twoBedroom: pricing["two-bedroom"],
      threeBedroom: pricing["three-bedroom"],
    });
  }, [pricing, resetPricing]);

  const filtered = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesQuery =
        reservation.guest.toLowerCase().includes(query.toLowerCase()) ||
        reservation.id.toLowerCase().includes(query.toLowerCase());
      const matchesResidence =
        residenceFilter === "all" || reservation.apartment === residenceFilter;
      const matchesTab =
        tab === "all" ||
        (tab === "attention" &&
          ["Payment pending", "KYC review"].includes(reservation.status)) ||
        (tab === "confirmed" && reservation.status === "Confirmed");
      return matchesQuery && matchesResidence && matchesTab;
    });
  }, [query, residenceFilter, reservations, tab]);

  const selected =
    reservations.find((reservation) => reservation.id === selectedId) ??
    reservations[0];

  function updateStatus(status: string) {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === selected.id
          ? {
              ...reservation,
              status,
              signal:
                status === "Confirmed"
                  ? "Ready for arrival"
                  : status === "Rejected"
                    ? "Guest notified"
                    : reservation.signal,
            }
          : reservation,
      ),
    );
  }

  function submitPricing(values: PricingValues) {
    savePricing({
      "two-bedroom": values.twoBedroom,
      "three-bedroom": values.threeBedroom,
    });
    setPricingSaved(true);
  }

  function submitBlockedDates(values: BlockedDatesValues) {
    blockRange(values.range);
    resetAvailability({ range: undefined });
    setDatesSaved(true);
  }

  return (
    <div>
      <Grid
        variant="4up"
        gap="sm"
        className="gap-4"
        aria-label="Reservation overview"
      >
        {dashboardMetrics.map(([value, label, note]) => (
          <GridItem key={label}>
            <LayerCard className="h-full rounded-xl! bg-[#fbfaf6]! p-6 shadow-none! ring-black/10!">
              <p className="font-display text-5xl font-medium tracking-[-0.04em]">
                {value}
              </p>
              <p className="mt-5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#514d45]">
                {label}
              </p>
              <p className="mt-2 text-xs text-[#8b857a]">{note}</p>
            </LayerCard>
          </GridItem>
        ))}
      </Grid>

      <LayerCard
        render={<section />}
        className="mt-8 rounded-2xl! bg-[#181713]! p-6 text-white shadow-none! ring-black/10! sm:p-8"
      >
        <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-end">
          <div>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-[#d9967f]">
              <CurrencyNgnIcon size={21} />
            </span>
            <p className="mt-6 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#d9967f]">
              Residence pricing
            </p>
            <h2 className="font-display mt-3 text-4xl font-medium">
              Set nightly rates.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/52">
              Saved rates update public residence pricing and calculations for
              new reservation requests immediately.
            </p>
          </div>

          <form
            onSubmit={handlePricingSubmit(submitPricing)}
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field-dark">
                <Input
                  label="Two Bedroom nightly rate"
                  type="number"
                  min={0}
                  step={5000}
                  error={pricingErrors.twoBedroom?.message}
                  {...registerPricing("twoBedroom", {
                    onChange: () => setPricingSaved(false),
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="field-dark">
                <Input
                  label="Three Bedroom nightly rate"
                  type="number"
                  min={0}
                  step={5000}
                  error={pricingErrors.threeBedroom?.message}
                  {...registerPricing("threeBedroom", {
                    onChange: () => setPricingSaved(false),
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/46">
                Current: {formatNaira(pricing["two-bedroom"])} ·{" "}
                {formatNaira(pricing["three-bedroom"])}
              </p>
              <div className="flex items-center gap-4">
                {pricingSaved ? (
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#b9cfb9]">
                    <CheckIcon size={15} />
                    Pricing saved
                  </span>
                ) : null}
                <Button
                  type="submit"
                  variant="primary"
                  className="h-11! rounded-lg! bg-[#d9967f]! px-5! text-xs! font-bold! uppercase! tracking-[0.15em]! text-[#181713]! hover:bg-[#efb39f]!"
                >
                  Save pricing
                </Button>
              </div>
            </div>
          </form>
        </div>
      </LayerCard>

      <LayerCard
        render={<section />}
        className="mt-8 rounded-2xl! bg-[#fbfaf6]! p-6 shadow-none! ring-black/10! sm:p-8"
      >
        <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
          <div>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-black/12 text-[#9c3f28]">
              <CalendarXIcon size={21} />
            </span>
            <p className="mt-6 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#9c3f28]">
              Reservation availability
            </p>
            <h2 className="font-display mt-3 text-4xl font-medium">
              Block reserved dates.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#746f65]">
              Dates blocked here become unavailable on every guest calendar,
              including the homepage and reservation page.
            </p>
          </div>

          <form
            onSubmit={handleAvailabilitySubmit(submitBlockedDates)}
            noValidate
          >
            <div className="premium-calendar overflow-x-auto rounded-xl border border-black/10 bg-[#f3f0e9] p-3 sm:p-5">
              <Controller
                control={availabilityControl}
                name="range"
                render={({ field }) => (
                  <DatePicker
                    mode="range"
                    selected={field.value}
                    onChange={(range) => {
                      field.onChange(range);
                      setDatesSaved(false);
                    }}
                    defaultMonth={today}
                    numberOfMonths={2}
                    disabled={{ before: today }}
                    fixedWeeks
                  />
                )}
              />
            </div>
            {availabilityErrors.range?.message ? (
              <p className="mt-3 text-xs text-red-700">
                {availabilityErrors.range.message}
              </p>
            ) : null}
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#746f65]">
                {selectedBlockedRange?.from && selectedBlockedRange.to
                  ? formatDateRange(selectedBlockedRange)
                  : "Choose the first and last date of the reservation."}
              </p>
              <div className="flex items-center gap-4">
                {datesSaved ? (
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#425344]">
                    <CheckIcon size={15} />
                    Dates blocked
                  </span>
                ) : null}
                <Button
                  type="submit"
                  variant="primary"
                  className="h-11! rounded-lg! bg-[#181713]! px-5! text-xs! font-bold! uppercase! tracking-[0.15em]! text-white! hover:bg-[#9c3f28]!"
                >
                  Block selected dates
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 border-t border-black/10 pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Currently blocked</p>
              <p className="mt-1 text-xs text-[#746f65]">
                Remove a date to make it available to guests again.
              </p>
            </div>
            {blockedDateKeys.length ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearBlockedDates}
                className="rounded-lg! border-black/15!"
              >
                Clear all dates
              </Button>
            ) : null}
          </div>
          {blockedDateKeys.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {blockedDateKeys.map((dateKey) => (
                <Button
                  key={dateKey}
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={XIcon}
                  onClick={() => removeBlockedDate(dateKey)}
                  className="rounded-full! bg-[#e9e3d9]! text-[#514d45]!"
                >
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(fromDateKey(dateKey))}
                </Button>
              ))}
            </div>
          ) : (
            <Empty
              size="sm"
              title="No dates are blocked"
              description="Choose a reservation range above to lock it on guest calendars."
              className="mt-5 rounded-xl! bg-[#f3f0e9]!"
            />
          )}
        </div>
      </LayerCard>

      <section className="mt-8 grid gap-8 2xl:grid-cols-[1fr_22rem]">
        <LayerCard className="min-w-0 rounded-2xl! bg-[#fbfaf6]! shadow-none! ring-black/10!">
          <div className="border-b border-black/10 p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#9c3f28]">
                  Reservation queue
                </p>
                <h2 className="font-display mt-2 text-4xl font-medium">Stay requests</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowClockwiseIcon}
                  className="rounded-md!"
                >
                  Refresh
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={DownloadSimpleIcon}
                  className="rounded-md!"
                >
                  Export
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Tabs
                variant="underline"
                value={tab}
                onValueChange={setTab}
                tabs={[
                  { value: "all", label: "All requests" },
                  { value: "attention", label: "Needs attention" },
                  { value: "confirmed", label: "Confirmed" },
                ]}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_15rem]">
              <Input
                label="Search reservations"
                placeholder="Guest name or reservation ID"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
              <Select
                label="Residence"
                value={residenceFilter}
                onValueChange={(value) => setResidenceFilter(String(value))}
                className="w-full!"
              >
                <Select.Option value="all">All residences</Select.Option>
                <Select.Option value="Two Bedroom">Two Bedroom</Select.Option>
                <Select.Option value="Three Bedroom">Three Bedroom</Select.Option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Reservation</Table.Head>
                  <Table.Head>Guest</Table.Head>
                  <Table.Head>Residence</Table.Head>
                  <Table.Head>Stay</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Signal</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filtered.map((reservation) => (
                  <Table.Row
                    key={reservation.id}
                    onClick={() => setSelectedId(reservation.id)}
                    className={`cursor-pointer transition hover:bg-[#e9e3d9] ${
                      reservation.id === selected.id ? "bg-[#eee7dc]!" : ""
                    }`}
                  >
                    <Table.Cell className="font-mono text-xs font-bold text-[#9c3f28]">
                      {reservation.id}
                    </Table.Cell>
                    <Table.Cell className="font-semibold">{reservation.guest}</Table.Cell>
                    <Table.Cell>{reservation.apartment}</Table.Cell>
                    <Table.Cell>{reservation.date}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant={badgeVariant(reservation.status)}
                        appearance="dot"
                      >
                        {reservation.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-xs font-semibold text-[#625d54]">
                      {reservation.signal}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {filtered.length === 0 ? (
              <Empty
                size="sm"
                title="No matching requests"
                description="Adjust the search or residence filter."
                className="rounded-xl! border-0! bg-transparent!"
              />
            ) : null}
          </div>
        </LayerCard>

        <LayerCard
          render={<aside />}
          className="h-fit rounded-2xl! bg-[#181713]! p-6 text-white shadow-none! ring-black/10! 2xl:sticky 2xl:top-28"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold text-[#d9967f]">{selected.id}</p>
              <h2 className="font-display mt-3 text-4xl font-medium">{selected.guest}</h2>
            </div>
            <Badge
              variant={badgeVariant(selected.status)}
              appearance="dot"
              className="border-white/20! bg-white/10! text-white!"
            >
              {selected.status}
            </Badge>
          </div>

          <div className="mt-7 grid gap-px bg-white/12">
            {[
              ["Residence", selected.apartment],
              ["Stay", selected.date],
              ["Guests", selected.guests],
              ["Amount", selected.amount],
              ["Contact", selected.contact],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-5 bg-[#181713] py-4">
                <span className="text-xs text-white/38">{label}</span>
                <span className="text-right text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#d9967f]">
              Review checklist
            </p>
            <div className="mt-4 grid gap-3">
              {[
                ["Payment proof", selected.status !== "Payment pending"],
                ["Government ID", selected.status !== "Payment pending"],
                ["Guest portrait", selected.status !== "Payment pending"],
              ].map(([label, done]) => (
                <LayerCard
                  key={String(label)}
                  className="flex items-center justify-between rounded-lg! bg-white/[0.03]! p-3 shadow-none! ring-white/12!"
                >
                  <span className="text-xs text-white/58">{label}</span>
                  {done ? (
                    <CheckIcon size={15} className="text-[#9fb59f]" />
                  ) : (
                    <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#d9967f]">
                      Pending
                    </span>
                  )}
                </LayerCard>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-3">
            <Button
              variant="secondary"
              icon={EyeIcon}
              className="h-11! rounded-lg! bg-white/10! text-white! hover:bg-white/16!"
            >
              Review documents
            </Button>
            <Button
              variant="secondary"
              icon={EnvelopeSimpleIcon}
              className="h-11! rounded-lg! bg-white/10! text-white! hover:bg-white/16!"
            >
              Contact guest
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                icon={XIcon}
                onClick={() => updateStatus("Rejected")}
                className="h-11! rounded-lg! border-white/20! text-white! hover:bg-white/10!"
              >
                Reject
              </Button>
              <Button
                variant="primary"
                icon={CheckIcon}
                onClick={() => updateStatus("Confirmed")}
                className="h-11! rounded-lg! bg-[#d9967f]! text-[#181713]! hover:bg-[#efb39f]!"
              >
                Confirm
              </Button>
            </div>
          </div>
        </LayerCard>
      </section>
    </div>
  );
}

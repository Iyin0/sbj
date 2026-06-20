"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ArrowRightIcon,
  BedIcon,
  CalendarBlankIcon,
  CheckIcon,
  MapPinIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  DatePicker,
  Grid,
  GridItem,
  Input,
  InputArea,
  LayerCard,
  Radio,
  Select,
  type DateRange,
} from "@cloudflare/kumo";
import { apartmentTypes } from "@/lib/site-data";
import { useAvailability } from "@/components/availability-provider";
import { usePricing } from "@/components/pricing-provider";
import {
  reservationSchema,
  type ReservationValues,
} from "@/lib/form-schemas";
import { rangeContainsDateKeys } from "@/lib/date-utils";
import {
  consumeResidencePreference,
  consumeReservationDraft,
  savePaymentDraft,
} from "@/lib/reservation-session";

function formatDate(date?: Date) {
  return date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
    : "Not selected";
}

function getNights(range?: DateRange) {
  if (!range?.from || !range.to) return 0;
  return Math.max(
    0,
    Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000),
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function currentMonth() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

export function ReservationDateRange() {
  const router = useRouter();
  const { pricing } = usePricing();
  const { blockedDateKeys, blockedDates } = useAvailability();
  const [monthCount, setMonthCount] = useState(1);
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const {
    control,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ReservationValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      apartmentId: apartmentTypes[0].id as ReservationValues["apartmentId"],
      range: undefined,
      guests: "2",
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });
  const apartmentId = useWatch({ control, name: "apartmentId" });
  const range = useWatch({ control, name: "range" });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 780px)");
    const update = () => setMonthCount(media.matches ? 2 : 1);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const draft = consumeReservationDraft();
      const residencePreference = consumeResidencePreference();
      if (!draft && !residencePreference) return;

      if (!draft) {
        reset({
          apartmentId: residencePreference ?? "two-bedroom",
          range: undefined,
          guests: "2",
          name: "",
          email: "",
          phone: "",
          notes: "",
        });
        return;
      }

      reset({
        apartmentId: draft.residence,
        range: {
          from: draft.checkIn,
          to: draft.checkOut,
        },
        guests: "2",
        name: "",
        email: "",
        phone: "",
        notes: "",
      });
      setCalendarMonth(
        new Date(draft.checkIn.getFullYear(), draft.checkIn.getMonth(), 1),
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [reset]);

  useEffect(() => {
    if (rangeContainsDateKeys(range, blockedDateKeys)) {
      setValue("range", undefined as never);
    }
  }, [blockedDateKeys, range, setValue]);

  const selectedApartment =
    apartmentTypes.find((apartment) => apartment.id === apartmentId) ??
    apartmentTypes[0];
  const nights = getNights(range);
  const nightlyRate =
    pricing[apartmentId === "three-bedroom" ? "three-bedroom" : "two-bedroom"];
  const total = nightlyRate * nights;
  const complete = Boolean(range?.from && range.to && nights >= 1);

  const stage = useMemo(() => {
    if (complete) return 3;
    if (range?.from) return 2;
    return 1;
  }, [complete, range?.from]);

  function submitRequest(values: ReservationValues) {
    if (rangeContainsDateKeys(values.range, blockedDateKeys)) {
      setError("range", {
        message: "Those dates are no longer available.",
      });
      return;
    }
    const submittedNights = getNights(values.range);
    const submittedRate =
      pricing[
        values.apartmentId === "three-bedroom"
          ? "three-bedroom"
          : "two-bedroom"
      ];
    const windowStartedAt = Date.now();
    savePaymentDraft({
      residence: values.apartmentId,
      nights: submittedNights,
      guests: Number(values.guests),
      total: submittedRate * submittedNights,
      windowStartedAt,
      windowExpiresAt: windowStartedAt + 10 * 60 * 1000,
    });
    router.push("/payment", { scroll: true });
  }

  function submitReservationForm(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const textFields = ["name", "email", "phone", "notes"] as const;

    textFields.forEach((field) => {
      const value = formData.get(field);
      if (typeof value === "string") {
        setValue(field, value, { shouldDirty: true });
      }
    });

    void handleSubmit(submitRequest)(event);
  }

  return (
    <div>
      <div className="grid gap-px bg-black/12 sm:grid-cols-3">
        {[
          ["01", "Choose residence"],
          ["02", "Select dates"],
          ["03", "Guest details"],
        ].map(([number, label], index) => {
          const active = stage >= index + 1;
          return (
            <div
              key={number}
              className={`flex items-center gap-4 p-5 ${
                active ? "bg-[#181713] text-white" : "bg-[#e9e3d9] text-[#746f65]"
              }`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border text-[0.65rem] font-bold ${
                  active ? "border-white/30" : "border-black/15"
                }`}
              >
                {stage > index + 1 ? <CheckIcon size={13} weight="bold" /> : number}
              </span>
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.16em]">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={submitReservationForm}
        noValidate
        autoComplete="on"
        className="mt-8 grid gap-8 xl:grid-cols-[1.16fr_0.84fr]"
      >
        <div className="space-y-8">
          <LayerCard
            render={<section />}
            className="rounded-2xl! bg-[#fbfaf6]! p-5 soft-shadow ring-0! sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">01 · Your residence</p>
                <h2 className="font-display mt-5 text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
                  Where would you like to stay?
                </h2>
              </div>
              <Badge
                variant="outline"
                className="w-fit! rounded-md! border-black/20! bg-transparent! text-[0.62rem]! font-bold! uppercase! tracking-[0.18em]! text-[#514d45]!"
              >
                Personally confirmed
              </Badge>
            </div>

            <Controller
              control={control}
              name="apartmentId"
              render={({ field }) => (
                <Radio.Group
                  value={field.value}
                  onValueChange={field.onChange}
                  appearance="card"
                  controlPosition="end"
                  className="residence-choice-grid mt-8"
                >
                  <Radio.Legend className="sr-only">
                    Choose a residence
                  </Radio.Legend>
                  {apartmentTypes.map((apartment) => {
                    const selected = apartment.id === apartmentId;
                    return (
                      <Radio.Item
                        key={apartment.id}
                        value={apartment.id}
                        className={`rounded-xl! p-6! text-left transition duration-500 ${
                          selected
                            ? "border-[#181713]! bg-[#181713]! text-white!"
                            : "border-black/12! bg-[#f3f0e9]! hover:border-[#9c3f28]/45!"
                        }`}
                        label={
                      <span className="block">
                        <span
                          className={`block text-[0.62rem] font-bold uppercase tracking-[0.18em] ${
                            selected ? "text-[#d9967f]" : "text-[#9c3f28]"
                          }`}
                        >
                          {apartment.eyebrow}
                        </span>
                        <span
                          className={`font-display mt-5 block pr-4 text-3xl font-medium ${
                            selected ? "text-white" : "text-[#181713]"
                          }`}
                        >
                          {apartment.name}
                        </span>
                        <span
                          className={`mt-4 block text-sm font-normal leading-7 ${
                            selected ? "text-white/58" : "text-[#746f65]"
                          }`}
                        >
                          {apartment.summary}
                        </span>
                        <span
                          className={`mt-4 flex items-start gap-2 text-xs font-normal leading-6 ${
                            selected ? "text-white/62" : "text-[#625d54]"
                          }`}
                        >
                          <MapPinIcon size={15} className="mt-1 shrink-0 text-[#d9967f]" />
                          {apartment.address}
                        </span>
                        <span
                          className={`mt-7 flex flex-wrap gap-4 border-t pt-5 text-xs font-semibold ${
                            selected ? "border-white/14 text-white/70" : "border-black/10"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <BedIcon size={15} />
                            {apartment.bedrooms}
                          </span>
                          <span className="flex items-center gap-2">
                            <UsersThreeIcon size={15} />
                            {apartment.capacity}
                          </span>
                        </span>
                      </span>
                        }
                      />
                    );
                  })}
                </Radio.Group>
              )}
            />
            {errors.apartmentId?.message ? (
              <p className="mt-3 text-xs text-red-700">
                {errors.apartmentId.message}
              </p>
            ) : null}
          </LayerCard>

          <LayerCard
            render={<section />}
            className="rounded-2xl! bg-[#fbfaf6]! p-5 soft-shadow ring-0! sm:p-8"
          >
            <p className="eyebrow">02 · Your dates</p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
                Choose check-in and check-out.
              </h2>
              <p className="max-w-xs text-sm leading-6 text-[#746f65]">
                Enjoy discounted offers on longer stays. Unavailable dates are muted.
              </p>
            </div>
            <div className="premium-calendar mt-8 overflow-x-auto rounded-xl border border-black/10 bg-[#f3f0e9] p-2 sm:p-5">
              <Controller
                control={control}
                name="range"
                render={({ field }) => (
                  <DatePicker
                    mode="range"
                    selected={field.value}
                    onChange={field.onChange}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    numberOfMonths={monthCount}
                    min={1}
                    disabled={[{ before: today }, ...blockedDates]}
                    excludeDisabled
                    fixedWeeks
                    footer={
                      <p className="pt-4 text-xs leading-5 text-[#746f65]">
                        Your 10-minute reservation begins when this request is
                        created. Active temporary holds are unavailable.
                      </p>
                    }
                  />
                )}
              />
            </div>
            {errors.range?.message ? (
              <p className="mt-3 text-xs text-red-700">
                {errors.range.message}
              </p>
            ) : null}
          </LayerCard>

          <LayerCard
            render={<section />}
            className="rounded-2xl! bg-[#fbfaf6]! p-5 soft-shadow ring-0! sm:p-8"
          >
            <p className="eyebrow">03 · About your stay</p>
            <h2 className="font-display mt-5 text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
              A few details, then your reservation.
            </h2>
            <Grid variant="2up" gap="sm" className="mt-8 gap-5">
              <GridItem>
                <Input
                  label="Full name"
                  placeholder="Primary guest"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </GridItem>
              <GridItem>
                <Input
                  label="Email address"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </GridItem>
              <GridItem>
                <Input
                  label="Phone number"
                  placeholder="+234"
                  type="tel"
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </GridItem>
              <GridItem>
                <Controller
                  control={control}
                  name="guests"
                  render={({ field }) => (
                    <Select
                      label="Number of guests"
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(String(value))
                      }
                      error={errors.guests?.message}
                      className="w-full!"
                    >
                      {Array.from(
                        {
                          length:
                            apartmentId === "three-bedroom" ? 6 : 4,
                        },
                        (_, index) => index + 1,
                      ).map((count) => (
                        <Select.Option key={count} value={String(count)}>
                          {count} guest{count === 1 ? "" : "s"}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </GridItem>
            </Grid>
            <div className="mt-5">
              <InputArea
                className="min-h-28"
                label="Anything we should know?"
                placeholder="Arrival time, occasion, accessibility needs, or a special request"
                error={errors.notes?.message}
                {...register("notes")}
              />
            </div>
          </LayerCard>
        </div>

        <aside className="h-fit xl:sticky xl:top-28">
          <LayerCard className="rounded-2xl! bg-[#181713]! p-6 text-white soft-shadow ring-0! sm:p-8">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#d9967f]">
              Stay summary
            </p>
            <h2 className="font-display mt-5 text-4xl font-medium">
              {selectedApartment.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/52">
              {selectedApartment.signature}
            </p>

            <div className="mt-8 grid gap-px bg-white/12">
              <div className="grid grid-cols-2 gap-4 bg-[#181713] py-5">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/38">
                    Check in
                  </p>
                  <p className="mt-2 text-sm font-semibold">{formatDate(range?.from)}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/38">
                    Check out
                  </p>
                  <p className="mt-2 text-sm font-semibold">{formatDate(range?.to)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-[#181713] py-5">
                <span className="flex items-center gap-2 text-sm text-white/58">
                  <CalendarBlankIcon size={17} />
                  Length of stay
                </span>
                <span className="text-sm font-semibold">
                  {nights ? `${nights} nights` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#181713] py-5">
                <span className="text-sm text-white/58">Nightly rate</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(nightlyRate)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-white/16 pt-6">
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/38">
                  Estimated total
                </p>
                <p className="mt-2 text-xs text-white/42">Excludes refundable deposits</p>
              </div>
              <p className="font-display text-4xl text-[#fbfaf6]">
                {nights ? formatCurrency(total) : "—"}
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={ArrowRightIcon}
              disabled={!complete}
              className="mt-8 h-13! w-full! rounded-lg! bg-[#fbfaf6]! text-xs! font-bold! uppercase! tracking-[0.16em]! text-[#181713]! hover:bg-[#d9967f]! disabled:bg-white/16! disabled:text-white/35!"
            >
              Begin 10-minute reservation
            </Button>
            {!complete ? (
              <p className="mt-4 text-center text-xs leading-5 text-white/42">
                Select a complete date range to continue.
              </p>
            ) : (
              <p className="mt-4 text-center text-xs leading-5 text-white/42">
                The 10-minute window begins as soon as you create the request.
              </p>
            )}
          </LayerCard>
          <LayerCard className="mt-3 rounded-xl! bg-[#e9e3d9]! p-5 shadow-none! ring-black/12!">
            <p className="text-xs leading-6 text-[#625d54]">
              No charge is made at this stage. Your request remains subject to
              admin review and final confirmation.
            </p>
          </LayerCard>
        </aside>
      </form>
    </div>
  );
}

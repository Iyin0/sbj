"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  CheckCircleIcon,
  ClockCountdownIcon,
  LockKeyIcon,
  PhoneIcon,
  UploadSimpleIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import {
  Banner,
  Button,
  ClipboardText,
  InputArea,
  LayerCard,
  LinkButton,
} from "@cloudflare/kumo";
import { FileUpload } from "@/components/file-upload";
import {
  paymentDetails,
  phoneNumber,
  phoneUrl,
  whatsappUrl,
} from "@/lib/site-data";
import {
  paymentSchema,
  type PaymentValues,
} from "@/lib/form-schemas";
import {
  clearPaymentDraft,
  loadPaymentDraft,
  savePaymentDraft,
  type PaymentDraft,
} from "@/lib/reservation-session";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

const defaultPaymentDraft: PaymentDraft = {
  residence: "two-bedroom",
  nights: 3,
  guests: 2,
  total: 420_000,
  windowStartedAt: 0,
  windowExpiresAt: 0,
};

export function PaymentPanel() {
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAfterWindow, setSubmittedAfterWindow] = useState(false);
  const [summary, setSummary] = useState(defaultPaymentDraft);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [expiryNoticeOpen, setExpiryNoticeOpen] = useState(false);
  const expiryNotified = useRef(false);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentReceipt: undefined,
      transferNote: "",
    },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedDraft = loadPaymentDraft();
      if (savedDraft) {
        setSummary(savedDraft);
        setExpiresAt(savedDraft.windowExpiresAt);
        return;
      }

      const windowStartedAt = Date.now();
      const fallbackDraft = {
        ...defaultPaymentDraft,
        windowStartedAt,
        windowExpiresAt: windowStartedAt + 10 * 60 * 1000,
      };
      savePaymentDraft(fallbackDraft);
      setSummary(fallbackDraft);
      setExpiresAt(fallbackDraft.windowExpiresAt);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (submitted || expiresAt === null) return;

    const update = () => {
      const remaining = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);

      if (remaining === 0 && !expiryNotified.current) {
        expiryNotified.current = true;
        setExpiryNoticeOpen(true);
      }
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, submitted]);

  useEffect(() => {
    if (submitted) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [submitted]);

  const expired = secondsLeft <= 0;
  const progress = Math.max(0, Math.min(100, (secondsLeft / 600) * 100));
  const formattedTotal = useMemo(
    () =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(summary.total),
    [summary.total],
  );

  function submitProof() {
    setSubmittedAfterWindow(expired);
    clearPaymentDraft();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <LayerCard className="rounded-2xl! bg-[#fbfaf6]! p-7 text-center soft-shadow ring-0! sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dfe5dc] text-[#425344]">
          <CheckCircleIcon size={30} weight="fill" />
        </span>
        <p className="eyebrow mt-8 justify-center before:hidden">Payment proof received</p>
        <h2 className="font-display mx-auto mt-5 max-w-3xl text-5xl font-medium leading-[0.92] tracking-[-0.04em] sm:text-6xl">
          Your reservation is being processed.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#746f65]">
          {submittedAfterWindow
            ? "Your proof was submitted after the temporary reservation window ended. Our admin team will check current availability before confirming or arranging a refund."
            : "We will contact you about your reservation shortly. You will also receive an email after our admin team reviews your payment."}
        </p>
        <LayerCard className="mx-auto mt-8 max-w-2xl rounded-xl! bg-[#f3f0e9]! p-5 shadow-none! ring-black/10! sm:p-6">
          <p className="text-sm leading-7 text-[#625d54]">
            You can contact us on WhatsApp at {phoneNumber} or call{" "}
            {phoneNumber} for a faster confirmation.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              variant="primary"
              className="h-12! rounded-lg! bg-[#425344]! px-6! text-xs! font-bold! uppercase! tracking-[0.12em]! text-white! hover:bg-[#344236]!"
            >
              <WhatsappLogoIcon size={17} weight="fill" />
              WhatsApp {phoneNumber}
            </LinkButton>
            <LinkButton
              href={phoneUrl}
              variant="outline"
              className="h-12! rounded-lg! border-black/20! px-6! text-xs! font-bold! uppercase! tracking-[0.12em]!"
            >
              <PhoneIcon size={17} weight="fill" />
              Call {phoneNumber}
            </LinkButton>
          </div>
        </LayerCard>
        <div className="mx-auto mt-10 grid max-w-2xl gap-px overflow-hidden rounded-xl bg-black/12 sm:grid-cols-3">
          {[
            ["01", "Reservation received"],
            ["02", "Payment submitted"],
            ["03", "Admin review"],
          ].map(([number, label], index) => (
            <div
              key={number}
              className={`p-5 ${
                index < 2 ? "bg-[#dfe5dc] text-[#425344]" : "bg-[#e9e3d9]"
              }`}
            >
              <p className="font-display text-2xl">{number}</p>
              <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.16em]">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <LinkButton
            href="/"
            variant="primary"
            className="h-12! rounded-lg! bg-[#181713]! px-7! text-xs! font-bold! uppercase! tracking-[0.16em]! text-white! hover:bg-[#9c3f28]!"
          >
            Back to home
          </LinkButton>
        </div>
      </LayerCard>
    );
  }

  return (
    <>
      {expiryNoticeOpen ? (
        <LayerCard
          render={
            <aside
              role="alert"
              aria-live="assertive"
              aria-label="Reservation unlocked"
            />
          }
          className="fixed inset-x-4 bottom-4 z-[70] rounded-2xl! bg-[#fbfaf6]! p-6 soft-shadow ring-black/10! sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[34rem] sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f0ddd7] text-[#9c3f28]">
              <ClockCountdownIcon size={22} weight="fill" />
            </span>
            <div>
              <h2 className="font-display text-3xl font-medium leading-[0.95] tracking-[-0.03em] text-[#181713]">
                Your reservation is now unlocked.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#625d54]">
                The temporary hold has ended, but you can still transfer and
                submit proof. Only admin confirmation creates a final date
                lock.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={() => setExpiryNoticeOpen(false)}
              className="h-12! rounded-lg! bg-[#181713]! px-6! text-xs! font-bold! uppercase! tracking-[0.14em]! text-white! hover:bg-[#9c3f28]!"
            >
              Continue payment
            </Button>
            <LinkButton
              href="/reservations"
              variant="outline"
              className="h-12! rounded-lg! border-black/20! px-6! text-xs! font-bold! uppercase! tracking-[0.14em]!"
            >
              Check availability
            </LinkButton>
          </div>
        </LayerCard>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
      <LayerCard
        render={<aside />}
        className="h-fit min-w-0 rounded-2xl! bg-[#181713]! p-6 text-white soft-shadow ring-0! sm:p-8 xl:sticky xl:top-28"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#d9967f]">
              Reservation SBJ-2407
            </p>
            <h2 className="font-display mt-4 text-4xl font-medium">Your stay</h2>
          </div>
          <LockKeyIcon size={22} className="text-[#d9967f]" />
        </div>
        <div className="mt-8 grid gap-px bg-white/12">
          {[
            ["Residence", summary.residence.replaceAll("-", " ")],
            [
              "Length",
              `${summary.nights} night${summary.nights === 1 ? "" : "s"}`,
            ],
            [
              "Guests",
              `${summary.guests} guest${summary.guests === 1 ? "" : "s"}`,
            ],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-5 bg-[#181713] py-4">
              <span className="text-xs text-white/42">{label}</span>
              <span className="text-right text-sm font-semibold capitalize">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-white/14 pt-6">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/38">
            Amount due
          </p>
          <p className="font-display mt-2 text-5xl text-[#fbfaf6]">{formattedTotal}</p>
        </div>
        <p className="mt-6 text-xs leading-6 text-white/42">
          Final confirmation follows payment submission and admin review.
        </p>
      </LayerCard>

      <LayerCard className="min-w-0 rounded-2xl! bg-[#fbfaf6]! p-5 soft-shadow ring-0! sm:p-8 lg:p-10">
        <div className="grid gap-8 border-b border-black/12 pb-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow">Your 10-minute reservation</p>
            <h2 className="font-display mt-5 text-5xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-6xl">
              Complete the transfer within ten minutes.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#746f65]">
              Use the transfer details below, then attach a clear payment
              receipt.
            </p>
          </div>
          <div className="relative grid h-36 w-36 place-items-center rounded-full">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 144 144" aria-hidden="true">
              <circle
                cx="72"
                cy="72"
                r="66"
                fill="none"
                stroke="rgba(24,23,19,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="72"
                cy="72"
                r="66"
                fill="none"
                stroke={expired ? "#9c3f28" : "#181713"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={414.69}
                strokeDashoffset={414.69 * (1 - progress / 100)}
                className="transition-[stroke-dashoffset] duration-1000"
              />
            </svg>
            <div className="text-center" aria-live="polite">
              <ClockCountdownIcon size={19} className="mx-auto text-[#9c3f28]" />
              <p className="font-display mt-1 text-4xl font-semibold">
                {formatTime(secondsLeft)}
              </p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[#746f65]">
                {expired ? "Expired" : "Remaining"}
              </p>
            </div>
          </div>
        </div>

        {expired ? (
          <Banner
            variant="error"
            title="Your dates are now unlocked"
            description="You may still transfer and submit proof, but availability is no longer held. Admin will recheck the dates before confirming, and only admin confirmation creates a true lock."
            action={
              <LinkButton href="/reservations" variant="outline">
                Check availability
              </LinkButton>
            }
            className="mt-7"
          />
        ) : null}

        <div className="mt-8">
          <p className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#9c3f28]">
            Transfer details
          </p>
          <div className="mt-4 grid gap-3">
            {paymentDetails.map(([label, rawValue]) => {
              const value = label === "Amount" ? formattedTotal : rawValue;
              return (
                <LayerCard
                  key={label}
                  className="grid gap-3 rounded-xl! bg-[#f3f0e9]! p-4 shadow-none! ring-black/10! sm:grid-cols-[0.42fr_0.58fr] sm:items-center"
                >
                  <span className="text-xs font-semibold text-[#746f65]">{label}</span>
                  {label === "Amount" ? (
                    <span className="text-sm font-bold sm:text-right">{value}</span>
                  ) : (
                    <ClipboardText text={value} className="min-w-0" />
                  )}
                </LayerCard>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(submitProof)}
          noValidate
          className="mt-8 border-t border-black/12 pt-8"
        >
          <div className="flex items-center gap-3">
            <UploadSimpleIcon size={20} className="text-[#9c3f28]" />
            <h3 className="font-display text-3xl font-medium">Attach transfer proof</h3>
          </div>
          {expired ? (
            <p className="mt-3 text-sm leading-7 text-[#746f65]">
              Late proof is accepted for review. Confirmation depends on the
              dates still being available when the admin checks your request.
            </p>
          ) : null}
          <div className="mt-6 grid gap-5">
            <Controller
              control={control}
              name="paymentReceipt"
              render={({ field }) => (
                <FileUpload
                  label="Payment receipt"
                  description="PNG, JPG, or PDF · Maximum 10 MB"
                  accept="image/png,image/jpeg,application/pdf"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.paymentReceipt?.message}
                />
              )}
            />
            <InputArea
              label="Transfer note"
              placeholder="Add any helpful payment details"
              className="min-h-28 w-full! min-w-0! max-w-full!"
              required={false}
              error={errors.transferNote?.message}
              {...register("transferNote")}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-6 h-12! w-full! rounded-lg! bg-[#181713]! text-xs! font-bold! uppercase! tracking-[0.16em]! text-white! hover:bg-[#9c3f28]!"
          >
            Submit proof securely
          </Button>
        </form>
      </LayerCard>
      </div>
    </>
  );
}

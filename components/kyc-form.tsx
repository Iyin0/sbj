"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  FileTextIcon,
  IdentificationCardIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import {
  Button,
  Checkbox,
  Grid,
  GridItem,
  Input,
  InputArea,
  LayerCard,
  LinkButton,
  Select,
} from "@cloudflare/kumo";
import { DateField } from "@/components/date-field";
import { FileUpload } from "@/components/file-upload";
import { kycRequirements } from "@/lib/site-data";
import { kycSchema, type KycValues } from "@/lib/form-schemas";

export function KycForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [complete, setComplete] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    trigger,
    formState: { errors },
  } = useForm<KycValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      legalName: "",
      phone: "",
      email: "",
      identificationType: "passport",
      idNumber: "",
      dateOfBirth: undefined,
      address: "",
      identityDocument: undefined,
      portrait: undefined,
      consent: false,
    },
  });
  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);
  maxBirthDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step, complete]);

  async function nextStep() {
    const valid = await trigger([
      "legalName",
      "phone",
      "email",
      "identificationType",
      "idNumber",
      "dateOfBirth",
      "address",
    ]);
    if (valid) setStep(2);
  }

  function submit() {
    setComplete(true);
  }

  if (complete) {
    return (
      <LayerCard className="rounded-2xl! bg-[#fbfaf6]! p-7 text-center soft-shadow ring-0! sm:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dfe5dc] text-[#425344]">
          <CheckCircleIcon size={30} weight="fill" />
        </span>
        <p className="eyebrow mt-8 justify-center before:hidden">
          Verification submitted
        </p>
        <h2 className="font-display mx-auto mt-5 max-w-3xl text-5xl font-medium leading-[0.9] tracking-[-0.045em] sm:text-7xl">
          Your reservation is being processed.
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#746f65]">
          You will receive an email with an update about your reservation after
          review. Our admin team will contact you if anything further is needed
          before final confirmation.
        </p>
        <div className="mx-auto mt-10 grid max-w-2xl gap-px overflow-hidden rounded-xl bg-black/12 sm:grid-cols-3">
          {[
            ["01", "Payment received"],
            ["02", "Identity submitted"],
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
    <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
      <LayerCard
        render={<aside />}
        className="h-fit rounded-2xl! bg-[#181713]! p-6 text-white soft-shadow ring-0! sm:p-8 xl:sticky xl:top-28"
      >
        <ShieldCheckIcon size={25} className="text-[#d9967f]" />
        <h2 className="font-display mt-7 text-4xl font-medium">
          Why we verify every primary guest.
        </h2>
        <p className="mt-5 text-sm leading-7 text-white/52">
          Verification protects the residence, the host, and every guest. Only
          the information needed to review the stay is requested.
        </p>
        <div className="mt-8 grid gap-px bg-white/12">
          {kycRequirements.map((item, index) => (
            <div key={item} className="flex gap-4 bg-[#181713] py-4">
              <span className="font-display text-xl text-[#d9967f]">
                0{index + 1}
              </span>
              <span className="text-sm leading-6 text-white/68">{item}</span>
            </div>
          ))}
        </div>
        <LayerCard className="mt-8 rounded-xl! bg-white/[0.04]! p-5 shadow-none! ring-white/14!">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#d9967f]">
            Privacy promise
          </p>
          <p className="mt-3 text-xs leading-6 text-white/46">
            Documents are privately handled, access-limited, and retained only
            for the period required to review the reservation.
          </p>
        </LayerCard>
      </LayerCard>

      <LayerCard className="rounded-2xl! bg-[#fbfaf6]! p-5 soft-shadow ring-0! sm:p-8 lg:p-10">
        <div className="flex items-center gap-3 border-b border-black/12 pb-6">
          {[1, 2].map((item) => (
            <div key={item} className="flex flex-1 items-center gap-3">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[0.64rem] font-bold ${
                  step >= item
                    ? "border-[#181713] bg-[#181713] text-white"
                    : "border-black/15 text-[#746f65]"
                }`}
              >
                {step > item ? (
                  <CheckCircleIcon size={15} weight="fill" />
                ) : (
                  `0${item}`
                )}
              </span>
              <span
                className={`hidden text-[0.62rem] font-bold uppercase tracking-[0.16em] sm:block ${
                  step >= item ? "text-[#181713]" : "text-[#9b958a]"
                }`}
              >
                {item === 1 ? "Guest details" : "Documents & consent"}
              </span>
              {item === 1 ? (
                <span className="h-px flex-1 bg-black/12" />
              ) : null}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          noValidate
          className="mt-8"
        >
          {step === 1 ? (
            <section>
              <IdentificationCardIcon size={24} className="text-[#9c3f28]" />
              <p className="eyebrow mt-6">Primary guest</p>
              <h2 className="font-display mt-5 text-5xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                Tell us who will be staying.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#746f65]">
                Enter details exactly as they appear on the identification
                document you will provide next.
              </p>
              <Grid variant="2up" gap="sm" className="mt-8 gap-5">
                <GridItem>
                  <Input
                    label="Legal full name"
                    placeholder="Name on your ID"
                    error={errors.legalName?.message}
                    {...register("legalName")}
                  />
                </GridItem>
                <GridItem>
                  <Input
                    label="Phone number"
                    placeholder="+234"
                    type="tel"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </GridItem>
                <GridItem>
                  <Input
                    label="Email address"
                    placeholder="you@example.com"
                    type="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </GridItem>
                <GridItem>
                  <Controller
                    control={control}
                    name="identificationType"
                    render={({ field }) => (
                      <Select
                        label="Identification type"
                        value={field.value}
                        onValueChange={field.onChange}
                        error={errors.identificationType?.message}
                        className="w-full!"
                      >
                        <Select.Option value="passport">
                          International passport
                        </Select.Option>
                        <Select.Option value="national-id">
                          National ID
                        </Select.Option>
                        <Select.Option value="driver-license">
                          Driver&apos;s licence
                        </Select.Option>
                        <Select.Option value="voter-card">
                          Voter&apos;s card
                        </Select.Option>
                      </Select>
                    )}
                  />
                </GridItem>
                <GridItem>
                  <Input
                    label="ID number"
                    placeholder="Document number"
                    error={errors.idNumber?.message}
                    {...register("idNumber")}
                  />
                </GridItem>
                <GridItem>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <DateField
                        label="Date of birth"
                        value={field.value}
                        onChange={field.onChange}
                        minDate={new Date(1920, 0, 1)}
                        maxDate={maxBirthDate}
                        error={errors.dateOfBirth?.message}
                      />
                    )}
                  />
                </GridItem>
              </Grid>
              <InputArea
                label="Current residential address"
                placeholder="Street, city, and country"
                className="mt-5 min-h-28"
                error={errors.address?.message}
                {...register("address")}
              />
              <Button
                type="button"
                variant="primary"
                icon={ArrowRightIcon}
                onClick={() => void nextStep()}
                className="mt-7 h-12! w-full! rounded-lg! bg-[#181713]! text-xs! font-bold! uppercase! tracking-[0.16em]! text-white! hover:bg-[#9c3f28]!"
              >
                Continue to documents
              </Button>
            </section>
          ) : (
            <section>
              <FileTextIcon size={24} className="text-[#9c3f28]" />
              <p className="eyebrow mt-6">Documents & consent</p>
              <h2 className="font-display mt-5 text-5xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                Add two clear images.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#746f65]">
                Use a clear photo or scan with all document edges visible. Your
                portrait should be recent and unobstructed.
              </p>
              <Grid variant="2up" gap="sm" className="mt-8 gap-5">
                <GridItem>
                  <Controller
                    control={control}
                    name="identityDocument"
                    render={({ field }) => (
                      <FileUpload
                        label="Government-issued ID"
                        description="Passport photo page, National ID, or driver's licence · PNG, JPG, or PDF"
                        accept="image/png,image/jpeg,application/pdf"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.identityDocument?.message}
                      />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <Controller
                    control={control}
                    name="portrait"
                    render={({ field }) => (
                      <FileUpload
                        label="Recent portrait or selfie"
                        description="Face forward in natural light, without sunglasses or filters · PNG or JPG"
                        accept="image/png,image/jpeg"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.portrait?.message}
                      />
                    )}
                  />
                </GridItem>
              </Grid>
              <LayerCard className="mt-6 rounded-xl! bg-[#e9e3d9]! p-5 shadow-none! ring-black/10!">
                <Controller
                  control={control}
                  name="consent"
                  render={({ field }) => (
                    <Checkbox
                      label="I confirm that these details are accurate and consent to their use for reservation verification."
                      checked={field.value}
                      onCheckedChange={(value) =>
                        field.onChange(Boolean(value))
                      }
                      variant={errors.consent ? "error" : "default"}
                    />
                  )}
                />
                {errors.consent?.message ? (
                  <p className="mt-3 text-xs text-red-700">
                    {errors.consent.message}
                  </p>
                ) : null}
              </LayerCard>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  icon={ArrowLeftIcon}
                  onClick={() => setStep(1)}
                  className="h-12! rounded-lg! border-black/20! px-6!"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="h-12! rounded-lg! bg-[#181713]! px-8! text-xs! font-bold! uppercase! tracking-[0.16em]! text-white! hover:bg-[#9c3f28]!"
                >
                  Complete verification
                </Button>
              </div>
            </section>
          )}
        </form>
      </LayerCard>
    </div>
  );
}

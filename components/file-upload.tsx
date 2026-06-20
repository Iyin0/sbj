"use client";

import { useId, useRef, useState } from "react";
import {
  CheckCircleIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Button, Field, LayerCard } from "@cloudflare/kumo";

export function FileUpload({
  label,
  description,
  accept,
  value,
  onChange,
  error,
}: {
  label: string;
  description: string;
  accept: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [dragActive, setDragActive] = useState(false);

  function chooseFile(file?: File) {
    onChange(file);
    setDragActive(false);
  }

  return (
    <Field
      label={label}
      description={description}
      error={error ? { message: error, match: true } : undefined}
    >
      <LayerCard
        className={`group rounded-xl! bg-[#f3f0e9]! p-6 text-center shadow-none! transition ring-1! ${
          dragActive
            ? "ring-[#9c3f28]! bg-[#eee7dc]!"
            : error
              ? "ring-red-600!"
              : "ring-black/15! hover:ring-[#9c3f28]/55!"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          chooseFile(event.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => chooseFile(event.currentTarget.files?.[0])}
        />
        {value ? (
          <div className="flex flex-col items-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#dfe5dc] text-[#425344]">
              <CheckCircleIcon size={24} weight="fill" />
            </span>
            <p className="mt-4 max-w-full truncate text-sm font-semibold">
              {value.name}
            </p>
            <p className="mt-1 text-xs text-[#746f65]">
              {(value.size / 1_048_576).toFixed(1)} MB selected
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={XIcon}
              onClick={() => chooseFile(undefined)}
              className="mt-4 text-[#9c3f28]!"
            >
              Remove file
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-black/12 bg-[#fbfaf6] text-[#9c3f28] transition group-hover:border-[#9c3f28]/35">
              <UploadSimpleIcon size={23} />
            </span>
            <p className="mt-4 text-sm font-semibold">
              Browse or drag and drop
            </p>
            <p className="mt-1 text-xs text-[#746f65]">
              Drop your file anywhere in this area
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="mt-4 rounded-lg! border-black/20! bg-[#fbfaf6]!"
            >
              Browse files
            </Button>
          </div>
        )}
      </LayerCard>
    </Field>
  );
}

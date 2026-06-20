type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "light",
  as = "h2",
}: SectionHeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";
  const Heading = as;

  return (
    <div className={centered ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <p
        className={`eyebrow ${centered ? "justify-center before:hidden" : ""} ${
          dark ? "text-[#d9967f]!" : ""
        }`}
      >
        {eyebrow}
      </p>
      <Heading
        className={`font-display mt-6 text-[clamp(3rem,6vw,6.4rem)] font-medium leading-[0.88] tracking-[-0.045em] ${
          dark ? "text-[#fbfaf6]" : "text-[#181713]"
        }`}
      >
        {title}
      </Heading>
      {body ? (
        <p
          className={`mt-7 max-w-2xl text-base leading-8 sm:text-lg ${
            centered ? "mx-auto" : ""
          } ${dark ? "text-white/60" : "text-[#746f65]"}`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

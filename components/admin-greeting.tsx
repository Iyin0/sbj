"use client";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function AdminGreeting() {
  const greeting = greetingForHour(new Date().getHours());

  return (
    <h1
      suppressHydrationWarning
      className="font-display mt-6 text-[clamp(4rem,8vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.055em]"
    >
      {greeting},
      <span className="block italic text-[#9c3f28]">Glory.</span>
    </h1>
  );
}

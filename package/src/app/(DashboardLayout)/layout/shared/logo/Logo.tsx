import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      href="/"
      aria-label="Modernize dashboard home"
      className={cn(
        "group flex items-center gap-3 rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-soft text-sm font-semibold text-brand shadow-card transition group-hover:shadow-md">
        MZ
      </span>
      <span className="text-base font-semibold text-foreground">
        Modernize
      </span>
      <span className="sr-only">Dashboard</span>
    </Link>
  );
};

export default Logo;
  
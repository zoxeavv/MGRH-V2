import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UpgradeProps = {
  className?: string;
};

export const Upgrade = ({ className }: UpgradeProps) => {
  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-2xl border border-brand/20 bg-brand-soft/80 p-5 text-sm text-slate-700 shadow-card",
        className
      )}
      role="complementary"
      aria-label="Create an account prompt"
    >
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-base font-semibold text-slate-800">
          Haven&apos;t created an account?
        </p>
        <p className="text-sm text-slate-600">
          Start collaborating with your team in seconds.
        </p>
        <Button
          asChild
          size="sm"
          className="w-fit"
          aria-label="Create a free account"
        >
          <Link href="/authentication/register">Sign up</Link>
        </Button>
      </div>
      <Image
        src="/images/backgrounds/rocket.png"
        alt=""
        width={140}
        height={140}
        className="pointer-events-none absolute -bottom-10 right-0 h-40 w-40 select-none object-contain opacity-90"
        priority
      />
    </div>
  );
};

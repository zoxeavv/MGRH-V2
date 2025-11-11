"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && (resolvedTheme === "dark" || theme === "dark")
      ? "/images/logos/dark-logo.svg"
      : "/images/logos/dark-logo.svg";

  return (
    <Link href="/" className="flex items-center">
      <Image
        src={logoSrc}
        alt="CardStacks CRM"
        height={40}
        width={160}
        priority
        className="h-10 w-auto"
      />
    </Link>
  );
}
  
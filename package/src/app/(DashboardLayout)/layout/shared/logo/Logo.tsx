'use client';

import Link from "next/link";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <LinkStyled href="/">
      <Image
        src="/images/logos/dark-logo.svg"
        alt="logo"
        height={70}
        width={174}
        priority
        style={{
          height: "auto",
          width: "100%",
          filter: isDarkMode ? "brightness(0) invert(1)" : "none",
          transition: "filter 0.2s ease-in-out",
        }}
      />
    </LinkStyled>
  );
};

export default Logo;
  
'use client';

import React, { Fragment } from "react";
import { Box } from "@mui/material";
import { Sidebar as MUI_Sidebar, Menu, MenuItem, Submenu } from "react-mui-sidebar";
import { IconPoint } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upgrade } from "./Updrade";
import type { NavigationGroup, NavigationItem } from "./MenuItems";
import AppLogo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";

const renderMenuItems = (items: NavigationItem[], activePath: string) =>
  items.map((item) => {
    const Icon = item.icon ?? IconPoint;
    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    //If the item has children (submenu)
    if (item.items && item.items.length > 0) {
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius="7px"
        >
          {renderMenuItems(item.items, activePath)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <Box px={3} key={item.id}>
        <MenuItem
          key={item.id}
          isSelected={activePath === item.href}
          borderRadius="8px"
          icon={itemIcon}
          link={item.href}
          component={Link}
        >
          {item.title}
        </MenuItem >
      </Box>

    );
  });

type SidebarItemsProps = {
  groups: NavigationGroup[];
};

const SidebarItems = ({ groups }: SidebarItemsProps) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <>
      <MUI_Sidebar width={"100%"} showProfile={false} themeColor={"#5D87FF"} themeSecondaryColor={'#49beff'} >
        <Box px={3} py={4}>
          <AppLogo />
        </Box>
        {groups.map((group) => (
          <Fragment key={group.id}>
            <Menu subHeading={group.title} />
            {renderMenuItems(group.items, pathDirect)}
          </Fragment>
        ))}
        <Box px={2}>
          <Upgrade />
        </Box>
      </MUI_Sidebar>
    </>
  );
};
export default SidebarItems;

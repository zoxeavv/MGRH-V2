'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { ActiveMembershipContext } from '@/lib/auth/session';

import SidebarItems from './SidebarItems';

type SidebarProps = {
  context: ActiveMembershipContext;
  width: number;
  isMobileSidebarOpen: boolean;
  onSidebarClose: () => void;
  isSidebarOpen: boolean;
};

const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#d4d8e1',
    borderRadius: '12px',
  },
};

const Sidebar = ({
  context,
  width,
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: SidebarProps) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

  if (lgUp) {
    return (
      <Box
        component="nav"
        sx={{
          width,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: 'border-box',
              width,
              borderRight: 'none',
              backgroundColor: 'background.paper',
              ...scrollbarStyles,
            },
          }}
        >
          <SidebarItems context={context} />
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          boxSizing: 'border-box',
          width,
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <SidebarItems context={context} onNavigate={onSidebarClose} />
    </Drawer>
  );
};

export default Sidebar;

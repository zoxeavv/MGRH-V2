'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import type { ActiveMembershipContext } from '@/lib/auth/session';

import Header from '../layout/header/Header';
import Sidebar from '../layout/sidebar/Sidebar';

type DashboardShellProps = {
  children: React.ReactNode;
  context: ActiveMembershipContext;
};

const drawerWidth = 280;

const DashboardShell = ({ children, context }: DashboardShellProps) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar
        context={context}
        width={drawerWidth}
        isSidebarOpen
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          pb: 6,
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Header context={context} onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Container
          maxWidth="lg"
          sx={{
            py: 3,
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardShell;


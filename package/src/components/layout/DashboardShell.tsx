'use client';

import React from 'react';
import { Box, Container, styled } from '@mui/material';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import type { NavigationGroup } from '@/app/(DashboardLayout)/layout/sidebar/MenuItems';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

type DashboardShellProps = {
  navGroups: NavigationGroup[];
  children: React.ReactNode;
};

export default function DashboardShell({ navGroups, children }: DashboardShellProps) {
  const [isSidebarOpen] = React.useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        navGroups={navGroups}
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper className="page-wrapper">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Container
          sx={{
            paddingTop: '20px',
            maxWidth: '1200px',
          }}
        >
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}

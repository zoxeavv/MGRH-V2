'use client';

import React from 'react';
import { Box, Container, styled } from '@mui/material';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import type { NavigationGroup } from '@/app/(DashboardLayout)/layout/sidebar/MenuItems';
import { useOrganization } from '@/components/layout/organization-context';

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
  const { organization } = useOrganization();
  const [isSidebarOpen] = React.useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  if (!organization) {
    return (
      <MainWrapper className="mainwrapper">
        <PageWrapper className="page-wrapper">
          <Container
            sx={{
              paddingTop: '20px',
              maxWidth: '720px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                minHeight: '60vh',
                textAlign: 'center',
              }}
            >
              <Box component="h1" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                No organization found
              </Box>
              <Box component="p" sx={{ color: 'text.secondary' }}>
                Your account does not have an active organization yet. Please contact support or create one
                to continue.
              </Box>
            </Box>
          </Container>
        </PageWrapper>
      </MainWrapper>
    );
  }

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

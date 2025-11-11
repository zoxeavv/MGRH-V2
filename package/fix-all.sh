#!/bin/bash
# Script de correction automatique des fichiers

echo "🔧 Application des corrections..."

# 1. Corriger schema.ts - Supprimer le doublon users
echo "1. Correction de schema.ts..."
cat > src/lib/db/schema.ts << 'EOF'
import { pgTable, uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// CRM Users table - separate from Supabase auth.users
// This table stores extended user profile data for the CRM application
export const crmUsers = pgTable(
  'crm_users',
  {
    id: uuid('id').primaryKey(),
    email: text('email').notNull(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    emailUnique: uniqueIndex('crm_users_email_unique').on(table.email),
  }),
);
EOF

# 2. Corriger Header.tsx - Utiliser Material-UI
echo "2. Correction de Header.tsx..."
cat > src/app/\(DashboardLayout\)/layout/header/Header.tsx << 'EOF'
'use client';

import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import Link from 'next/link';
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>
        
        <Box flexGrow={1} />
        
        <Stack spacing={1} direction="row" alignItems="center">
          <Button 
            variant="contained" 
            component={Link} 
            href="/authentication/login" 
            disableElevation 
            color="primary"
          >
            Login
          </Button>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
EOF

# 3. Corriger postcss.config.js - Supprimer Tailwind
echo "3. Correction de postcss.config.js..."
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
EOF

echo ""
echo "✅ Toutes les corrections ont été appliquées !"
echo ""
echo "📋 Résumé:"
echo "   ✅ schema.ts: Doublon 'users' supprimé, seulement 'crmUsers'"
echo "   ✅ Header.tsx: Utilise Material-UI au lieu de lucide-react"
echo "   ✅ postcss.config.js: Tailwind supprimé"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Videz le cache: rm -rf .next"
echo "   2. Redémarrez: npm run dev"
echo ""

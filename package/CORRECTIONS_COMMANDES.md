# 🔧 CORRECTIONS RAPIDES - Copiez-collez ces commandes

## Commande unique pour tout corriger :

```bash
cd /Users/thier/Ehnsm/Modernize-Nextjs-Free/package && \
# Corriger schema.ts - Supprimer le doublon et renommer
sed -i '' '26,33d' src/lib/db/schema.ts && \
sed -i '' 's/export const users = pgTable/export const crmUsers = pgTable/g' src/lib/db/schema.ts && \
sed -i '' "s/'users'/'crm_users'/g" src/lib/db/schema.ts && \
sed -i '' 's/users_email_unique/crm_users_email_unique/g' src/lib/db/schema.ts && \
# Corriger postcss.config.js
echo 'module.exports = { plugins: { autoprefixer: {} } };' > postcss.config.js && \
echo "✅ Fichiers corrigés ! Maintenant corrigez Header.tsx manuellement ou utilisez la commande suivante"
```

## Pour Header.tsx, utilisez cette commande :

```bash
cd /Users/thier/Ehnsm/Modernize-Nextjs-Free/package && \
cat > src/app/\(DashboardLayout\)/layout/header/Header.tsx << 'HEADEREOF'
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
HEADEREOF
echo "✅ Header.tsx corrigé !"
```

## Ensuite, videz le cache et redémarrez :

```bash
cd /Users/thier/Ehnsm/Modernize-Nextjs-Free/package && \
rm -rf .next && \
npm run dev
```

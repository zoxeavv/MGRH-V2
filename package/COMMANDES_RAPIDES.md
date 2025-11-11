# 🚀 CORRECTIONS RAPIDES - Commandes à exécuter

## Option 1: Script automatique (Recommandé)

Copiez-collez cette commande dans votre terminal :

```bash
cd /Users/thier/Ehnsm/Modernize-Nextjs-Free/package && bash -c '
cat > src/lib/db/schema.ts << "EOF"
import { pgTable, uuid, text, timestamp, uniqueIndex } from '\''drizzle-orm/pg-core'\'';

export const organizations = pgTable('\''organizations'\'', {
  id: uuid('\''id'\'').primaryKey().defaultRandom(),
  name: text('\''name'\'').notNull(),
  createdAt: timestamp('\''created_at'\'', { withTimezone: true }).defaultNow().notNull(),
});

export const crmUsers = pgTable(
  '\''crm_users'\'',
  {
    id: uuid('\''id'\'').primaryKey(),
    email: text('\''email'\'').notNull(),
    fullName: text('\''full_name'\''),
    avatarUrl: text('\''avatar_url'\''),
    createdAt: timestamp('\''created_at'\'', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('\''updated_at'\'', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    emailUnique: uniqueIndex('\''crm_users_email_unique'\'').on(table.email),
  }),
);
EOF

cat > src/app/\(DashboardLayout\)/layout/header/Header.tsx << "EOF"
'\''use client'\'';

import React from '\''react'\'';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '\''@mui/material'\'';
import Link from '\''next/link'\'';
import Profile from '\''./Profile'\'';
import { IconBellRinging, IconMenu } from '\''@tabler/icons-react'\'';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: '\''none'\'',
    background: theme.palette.background.paper,
    justifyContent: '\''center'\'',
    backdropFilter: '\''blur(4px)'\'',
    [theme.breakpoints.up('\''lg'\'')]: {
      minHeight: '\''70px'\'',
    },
  }));
  
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '\''100%'\'',
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

cat > postcss.config.js << "EOF"
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
EOF

echo "✅ Corrections appliquées !"
'
```

## Option 2: Commandes simples (Plus facile)

Exécutez ces commandes une par une :

```bash
cd /Users/thier/Ehnsm/Modernize-Nextjs-Free/package

# 1. Supprimer les lignes 26-33 du schema.ts (le doublon)
sed -i '' '26,33d' src/lib/db/schema.ts

# 2. Remplacer "users" par "crmUsers" dans schema.ts
sed -i '' 's/export const users = pgTable/export const crmUsers = pgTable/g' src/lib/db/schema.ts
sed -i '' "s/'users'/'crm_users'/g" src/lib/db/schema.ts
sed -i '' 's/users_email_unique/crm_users_email_unique/g' src/lib/db/schema.ts

# 3. Corriger Header.tsx - Remplacer tout le contenu
# (Ouvrez le fichier et remplacez par la version corrigée)

# 4. Corriger postcss.config.js
echo 'module.exports = {
  plugins: {
    autoprefixer: {},
  },
};' > postcss.config.js

# 5. Vider le cache et redémarrer
rm -rf .next
npm run dev
```

## Option 3: Édition manuelle

1. **schema.ts** : Supprimez les lignes 26-33 (la deuxième déclaration `users`)
2. **Header.tsx** : Remplacez tout le contenu par la version avec Material-UI
3. **postcss.config.js** : Supprimez la ligne `tailwindcss: {},`

Puis : `rm -rf .next && npm run dev`

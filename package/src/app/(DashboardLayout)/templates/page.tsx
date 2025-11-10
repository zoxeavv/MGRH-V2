import Grid from '@mui/material/Unstable_Grid2';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listTemplates } from '@/lib/db/queries/templates';
import { StatusChip } from '@/components/ui/StatusChip';
import { TemplatesFilters } from './_components/TemplatesFilters';

type TemplatesPageProps = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const { membership } = await getActiveMembershipOrRedirect();

  const templatesList = await listTemplates({
    organizationId: membership.organization_id,
    search: searchParams.q ?? undefined,
    category: searchParams.category ?? undefined,
  });

  const categories = await listTemplates({ organizationId: membership.organization_id });

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Templates
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Centralisez vos modèles pour générer des offres cohérentes.
            </Typography>
          </Box>
          <Button component={Link} href="/templates/new" variant="contained">
            Nouveau template
          </Button>
        </Stack>
      </Stack>

      <TemplatesFilters categories={categories.map((template) => template.category)} />

      {templatesList.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucun template pour le moment.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {templatesList.map((template) => (
            <Grid key={template.id} xs={12} sm={6} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {template.previewImageUrl ? (
                  <Box
                    component="img"
                    src={template.previewImageUrl}
                    alt={template.title}
                    sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: 'grey.100',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Aucun aperçu
                  </Box>
                )}
                <Stack spacing={1.5} sx={{ p: 2, flexGrow: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" noWrap>
                      {template.title}
                    </Typography>
                    <StatusChip value={template.isDraft ? 'draft' : 'published'} />
                  </Stack>
                  {template.category ? <Chip label={template.category} size="small" /> : null}
                  <Stack direction="row" spacing={1} mt="auto">
                    <Button component={Link} href={`/templates/${template.id}/edit`} variant="outlined" size="small">
                      Éditer
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}

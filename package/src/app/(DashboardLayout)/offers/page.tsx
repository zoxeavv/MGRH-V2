import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listOffers } from '@/lib/db/queries/offers';
import { StatusChip } from '@/components/ui/StatusChip';

export default async function OffersPage() {
  const { membership } = await getActiveMembershipOrRedirect();
  const offersList = await listOffers(membership.organization_id);

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Offres
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Suivez la progression de vos propositions commerciales.
          </Typography>
        </Box>
        <Button component={Link} href="/offers/new" variant="contained">
          Nouvelle offre
        </Button>
      </Stack>

      {offersList.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucune offre pour le moment.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {offersList.map((offer) => (
            <Paper
              key={offer.id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ md: 'center' }}>
                <Typography variant="h6" component={Link} href={`/offers/${offer.id}`} sx={{ textDecoration: 'none', fontWeight: 600 }}>
                  {offer.title}
                </Typography>
                <StatusChip value={offer.isPublished ? 'published' : 'draft'} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Client : {offer.clientName ?? '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Dernière mise à jour le{' '}
                {new Intl.DateTimeFormat('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(offer.updatedAt ?? offer.createdAt ?? new Date()))}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

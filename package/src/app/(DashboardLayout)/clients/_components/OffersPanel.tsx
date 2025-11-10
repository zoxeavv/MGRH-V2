import { Chip, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { StatusChip } from '@/components/ui/StatusChip';

export type ClientOffer = {
  id: string;
  title: string;
  isPublished: boolean;
  currentVersion: number | null;
  updatedAt: string | null;
};

type OffersPanelProps = {
  offers: ClientOffer[];
};

export function OffersPanel({ offers }: OffersPanelProps) {
  if (offers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Aucune offre liée à ce client.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {offers.map((offer) => (
        <Paper
          key={offer.id}
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 3,
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
            <Stack spacing={1}>
              <Typography component={Link} href={`/offers/${offer.id}`} variant="subtitle1" sx={{ fontWeight: 600 }}>
                {offer.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <StatusChip value={offer.isPublished ? 'published' : 'draft'} />
                {offer.currentVersion ? (
                  <Chip size="small" label={`v${offer.currentVersion}`} variant="outlined" />
                ) : null}
              </Stack>
            </Stack>
            {offer.updatedAt ? (
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}>
                Modifié le{' '}
                {new Intl.DateTimeFormat('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(offer.updatedAt))}
              </Typography>
            ) : null}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

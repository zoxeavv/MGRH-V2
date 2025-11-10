'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import StatusChip from '@/components/StatusChip';
import { publishOffer } from '../actions';

type OfferHeaderProps = {
  offerId: string;
  title: string;
  summary: string | null;
  clientName: string;
  isPublished: boolean;
  total: number;
};

const OfferHeader = ({ offerId, title, summary, clientName, isPublished, total }: OfferHeaderProps) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const handlePublishToggle = () => {
    startTransition(async () => {
      const result = await publishOffer({ offerId, isPublished: !isPublished });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <StatusChip context="offer" status={isPublished ? 'published' : 'draft'} />
          <Typography variant="subtitle2" color="text.secondary">
            Client: {clientName}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Total: ${total.toFixed(2)}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <Button variant="contained" onClick={handlePublishToggle} disabled={pending}>
              {pending ? 'Updating…' : isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          </Stack>
        </Stack>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {summary ? (
          <Typography variant="body1" color="text.secondary">
            {summary}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default OfferHeader;


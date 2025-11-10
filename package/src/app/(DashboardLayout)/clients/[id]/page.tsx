import Grid from '@mui/material/Unstable_Grid2';
import { Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getClientById, getClientNotes, getClientOffers, getClientTasks } from '@/lib/db/queries/clients';
import { StatusChip } from '@/components/ui/StatusChip';
import { ClientStatusSelect } from '../_components/ClientStatusSelect';
import { ClientDetailTabs } from '../_components/ClientDetailTabs';

type ClientDetailPageProps = {
  params: { id: string };
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { membership } = await getActiveMembershipOrRedirect();

  const client = await getClientById(membership.organization_id, params.id);
  if (!client) {
    notFound();
  }

  const [notes, tasks, offers] = await Promise.all([
    getClientNotes(membership.organization_id, params.id),
    getClientTasks(membership.organization_id, params.id),
    getClientOffers(membership.organization_id, params.id),
  ]);

  const contacts = Array.isArray(client.contacts) ? client.contacts : [];
  const tags = Array.isArray(client.tags) ? client.tags : [];

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Typography variant="h4" fontWeight={700}>
            {client.name}
          </Typography>
          <StatusChip value={client.status} />
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <ClientStatusSelect clientId={client.id} initialStatus={client.status as 'lead' | 'active' | 'inactive' | 'archived'} />
          {tags.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          ) : null}
        </Stack>
        {client.description ? (
          <Typography variant="body1" color="text.secondary">
            {client.description}
          </Typography>
        ) : null}
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Contacts
        </Typography>
        <Divider sx={{ my: 2 }} />
        {contacts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucun contact renseigné.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {contacts.map((contact, index) => (
              <Grid key={`${contact.value}-${index}`} xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">{contact.label ?? 'Contact'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contact.value}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <ClientDetailTabs
        clientId={client.id}
        notes={notes.map((note) => ({
          id: note.id,
          content: note.content,
          createdAt: note.createdAt?.toISOString() ?? new Date().toISOString(),
          authorName: note.authorName,
          authorEmail: note.authorEmail,
        }))}
        tasks={tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status as 'todo' | 'in_progress' | 'done',
          dueDate: task.dueDate?.toISOString() ?? null,
        }))}
        offers={offers.map((offer) => ({
          id: offer.id,
          title: offer.title,
          isPublished: offer.isPublished,
          currentVersion: offer.currentVersion,
          updatedAt: offer.updatedAt?.toISOString() ?? null,
        }))}
      />
    </Stack>
  );
}

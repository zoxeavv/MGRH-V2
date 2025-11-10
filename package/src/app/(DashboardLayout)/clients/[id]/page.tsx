import { notFound } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import {
  getClientById,
  getClientNotes,
  getClientOffers,
  getClientTasks,
} from '@/lib/db/queries/clients';

import ClientHeader from '../components/ClientHeader';
import ClientTabs from '../components/ClientTabs';

type ClientDetailPageProps = {
  params: {
    id: string;
  };
};

const ClientDetailPage = async ({ params }: ClientDetailPageProps) => {
  const { organization } = await getActiveMembershipOrRedirect();

  const [client, notes, tasks, offers] = await Promise.all([
    getClientById(organization.id, params.id),
    getClientNotes(organization.id, params.id),
    getClientTasks(organization.id, params.id),
    getClientOffers(organization.id, params.id),
  ]);

  if (!client) {
    notFound();
  }

  const contacts = (client.contacts as Array<Record<string, unknown>> | null) ?? [];

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          {client.name}
        </Typography>
        {client.description ? (
          <Typography variant="body2" color="text.secondary">
            {client.description}
          </Typography>
        ) : null}
      </Stack>

      <ClientHeader
        client={{
          id: client.id,
          status: client.status,
          tags: (client.tags as string[]) ?? [],
          contacts: contacts.map((contact) => ({
            name: typeof contact.name === 'string' ? contact.name : undefined,
            email: typeof contact.email === 'string' ? contact.email : undefined,
            phone: typeof contact.phone === 'string' ? contact.phone : undefined,
            title: typeof contact.title === 'string' ? contact.title : undefined,
          })),
        }}
      />

      <ClientTabs
        clientId={client.id}
        notes={notes.map((note) => ({
          id: note.id,
          content: note.content,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
          author: {
            id: note.authorId ?? '',
            name: note.authorName ?? note.authorEmail ?? 'Unknown',
            email: note.authorEmail ?? '',
          },
        }))}
        tasks={tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          dueDate: task.dueDate ? task.dueDate.toISOString() : null,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          author: task.authorName ?? '',
          assignee: task.assigneeName ?? '',
        }))}
        offers={offers.map((offer) => ({
          id: offer.id,
          title: offer.title,
          summary: offer.summary ?? '',
          isPublished: offer.isPublished,
          versionNumber: offer.versionNumber ?? 1,
          updatedAt: offer.updatedAt.toISOString(),
        }))}
      />
    </Stack>
  );
};

export default ClientDetailPage;

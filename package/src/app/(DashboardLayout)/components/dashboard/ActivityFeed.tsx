import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import type { ActivityFeedItem } from '@/lib/db/queries/dashboard';

type ActivityFeedProps = {
  items: ActivityFeedItem[];
};

const actionLabels: Record<string, string> = {
  created: 'a créé',
  updated: 'a mis à jour',
  deleted: 'a supprimé',
  status_changed: 'a changé le statut',
  published: 'a publié',
  duplicated: 'a dupliqué',
  invited: 'a invité',
};

const entityLabels: Record<string, string> = {
  client: 'un client',
  offer: 'une offre',
  template: 'un template',
  membership: 'un membre',
  organization: "l'organisation",
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardHeader
        title={<Typography variant="h6">Journal d’activité</Typography>}
        subheader="20 derniers événements"
      />
      <CardContent>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune activité récente.
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {items.map((item) => {
              const labelAction = actionLabels[item.action] ?? item.action;
              const labelEntity = entityLabels[item.entityType] ?? item.entityType;
              const actorInitial =
                item.actor?.fullName?.[0]?.toUpperCase() ??
                item.actor?.email?.[0]?.toUpperCase() ??
                '?';

              return (
                <ListItem key={item.id} alignItems="flex-start" disableGutters sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar src={item.actor?.avatarUrl ?? undefined}>{actorInitial}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box component="span">
                        <Typography component="span" variant="subtitle2">
                          {item.actor?.fullName ?? item.actor?.email ?? 'Système'}
                        </Typography>{' '}
                        <Typography component="span" variant="body2" color="text.secondary">
                          {labelAction} {labelEntity}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

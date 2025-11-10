import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import type { ActivityFeedItem } from '@/lib/db/queries/dashboard';

const activityLabels: Record<string, string> = {
  created: 'created',
  updated: 'updated',
  deleted: 'deleted',
  status_changed: 'changed status',
  published: 'published',
  duplicated: 'duplicated',
  invited: 'invited',
};

const entityLabels: Record<string, string> = {
  client: 'Client',
  offer: 'Offer',
  template: 'Template',
  membership: 'Member',
  organization: 'Organization',
};

type ActivityFeedProps = {
  items: ActivityFeedItem[];
};

const ActivityFeed = ({ items }: ActivityFeedProps) => {
  return (
    <Card>
      <CardHeader
        title="Latest activity"
        subheader="The 20 latest actions across your organization"
      />
      <CardContent sx={{ pt: 0 }}>
        {items.length === 0 ? (
          <Stack alignItems="center" spacing={1} py={6}>
            <Typography variant="subtitle1" fontWeight={600}>
              No activity yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actions like creating clients, offers, or templates will appear here.
            </Typography>
          </Stack>
        ) : (
          <List disablePadding>
            {items.map((item) => {
              const actionLabel = activityLabels[item.action] ?? item.action;
              const entityLabel = entityLabels[item.entityType] ?? item.entityType;

              return (
                <ListItem key={item.id} divider alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          {item.actor.fullName ?? item.actor.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {actionLabel} a {entityLabel.toLowerCase()}
                        </Typography>
                        <Chip
                          size="small"
                          label={entityLabel}
                          sx={{
                            fontWeight: 600,
                            bgcolor: (theme) => theme.palette.grey[200],
                          }}
                        />
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {new Intl.DateTimeFormat('en', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(item.createdAt)}
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
};

export default ActivityFeed;


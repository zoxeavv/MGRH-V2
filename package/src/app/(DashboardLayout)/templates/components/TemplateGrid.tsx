import Link from 'next/link';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import StatusChip from '@/components/StatusChip';

type TemplateListItem = {
  id: string;
  title: string;
  category: string | null;
  isDraft: boolean;
  previewImageUrl: string | null;
  metadata: Record<string, unknown>;
  updatedAt: Date;
};

type TemplateGridProps = {
  templates: TemplateListItem[];
};

const TemplateGrid = ({ templates }: TemplateGridProps) => {
  if (templates.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No templates yet. Create one to speed up your offer creation.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {templates.map((template) => {
        const tags = Array.isArray(template.metadata?.tags) ? (template.metadata?.tags as string[]) : [];
        return (
          <Grid xs={12} sm={6} md={4} key={template.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea component={Link} href={`/templates/${template.id}/edit`} sx={{ height: '100%' }}>
                {template.previewImageUrl ? (
                  <CardMedia
                    component="img"
                    height="160"
                    src={template.previewImageUrl}
                    alt={template.title}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Stack
                    height={160}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ bgcolor: 'grey.100' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No preview
                    </Typography>
                  </Stack>
                )}
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {template.title}
                      </Typography>
                      <StatusChip context="template" status={template.isDraft ? 'draft' : 'published'} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {template.category || 'Uncategorized'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {tags.slice(0, 3).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                      {tags.length > 3 ? <Chip label={`+${tags.length - 3}`} size="small" variant="outlined" /> : null}
                      {tags.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No tags
                        </Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TemplateGrid;


import { notFound } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getTemplateAssets, getTemplateById } from '@/lib/db/queries/templates';
import StatusChip from '@/components/StatusChip';

import TemplateForm from '../../components/TemplateForm';
import TemplateAssetsPanel from '../../components/TemplateAssetsPanel';
import PublishToggleButton from '../../components/PublishToggleButton';
import TemplateGuide from '../../components/TemplateGuide';

type TemplateEditPageProps = {
  params: {
    id: string;
  };
};

const TemplateEditPage = async ({ params }: TemplateEditPageProps) => {
  const { organization } = await getActiveMembershipOrRedirect();

  const template = await getTemplateById(organization.id, params.id);
  const assets = await getTemplateAssets(params.id);

  if (!template) {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={700}>
              {template.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <StatusChip context="template" status={template.isDraft ? 'draft' : 'published'} />
              <Typography variant="body2" color="text.secondary">
                Last updated{' '}
                {new Intl.DateTimeFormat('en', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(template.updatedAt)}
              </Typography>
            </Stack>
          </Stack>
          <PublishToggleButton id={template.id} isDraft={template.isDraft} />
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <TemplateForm
            template={{
              id: template.id,
              title: template.title,
              category: template.category,
              content: template.content,
              tags: template.tags,
              previewImageUrl: template.previewImageUrl,
              isDraft: template.isDraft,
            }}
          />
        </Grid>
        <Grid xs={12} md={4} spacing={3} container>
          <Grid xs={12}>
            <TemplateAssetsPanel
              templateId={template.id}
              assets={assets.map((asset) => ({
                ...asset,
                createdAt: new Date(asset.createdAt),
              }))}
            />
          </Grid>
          <Grid xs={12}>
            <TemplateGuide />
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TemplateEditPage;

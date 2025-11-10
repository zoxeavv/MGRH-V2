import { notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getTemplateById, listTemplateAssets } from '@/lib/db/queries/templates';
import { TemplateEditor } from '../../_components/TemplateEditor';

type TemplateEditPageProps = {
  params: { id: string };
};

export default async function TemplateEditPage({ params }: TemplateEditPageProps) {
  const { membership } = await getActiveMembershipOrRedirect();

  const template = await getTemplateById(membership.organization_id, params.id);
  if (!template) {
    notFound();
  }

  const assets = await listTemplateAssets(params.id);
  const tags = Array.isArray(template.metadata?.tags) ? template.metadata.tags : [];

  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Éditer le template
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Mettez à jour le contenu et publiez quand vous êtes prêt.
      </Typography>
      <TemplateEditor
        initialTemplate={{
          id: template.id,
          title: template.title,
          category: template.category,
          content: template.content,
          isDraft: template.isDraft,
          tags,
          previewImageUrl: template.previewImageUrl,
        }}
        assets={assets.map((asset) => ({
          id: asset.id,
          url: asset.url,
          type: asset.type,
        }))}
      />
    </>
  );
}

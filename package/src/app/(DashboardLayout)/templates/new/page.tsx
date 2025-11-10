import { Typography } from '@mui/material';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { TemplateEditor } from '../_components/TemplateEditor';

export default async function TemplateNewPage() {
  await getActiveMembershipOrRedirect();

  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Nouveau template
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Rédigez votre contenu Markdown, ajoutez des assets et publiez pour le rendre disponible dans l’éditeur
        d’offres.
      </Typography>
      <TemplateEditor
        initialTemplate={{
          title: 'Titre du template',
          category: '',
          content: '## Nouveau template\n\nDécrivez ici le contenu de votre offre.',
          isDraft: true,
          tags: [],
          previewImageUrl: '',
        }}
        assets={[]}
      />
    </>
  );
}

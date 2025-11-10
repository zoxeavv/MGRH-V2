'use client';

import PublishIcon from '@mui/icons-material/Publish';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { MarkdownEditor } from '@/components/ui/MarkdownEditor';
import { UploadField } from '@/components/ui/UploadField';
import { attachAsset, publishTemplate, saveTemplateDraft } from '../actions';

type TemplateEditorProps = {
  initialTemplate: {
    id?: string;
    title: string;
    category: string | null;
    content: string;
    isDraft: boolean;
    tags: string[];
    previewImageUrl: string | null;
  };
  assets: { id: string; url: string; type: string }[];
};

export function TemplateEditor({ initialTemplate, assets }: TemplateEditorProps) {
  const [title, setTitle] = useState(initialTemplate.title);
  const [category, setCategory] = useState(initialTemplate.category ?? '');
  const [previewImageUrl, setPreviewImageUrl] = useState(initialTemplate.previewImageUrl ?? '');
  const [content, setContent] = useState(initialTemplate.content);
  const [tagsInput, setTagsInput] = useState(initialTemplate.tags.join(', '));
  const [isDraft, setIsDraft] = useState(initialTemplate.isDraft);
  const [templateId, setTemplateId] = useState(initialTemplate.id);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentAssets, setCurrentAssets] = useState(assets);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCurrentAssets(assets);
  }, [assets]);

  const tagsArray = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsInput],
  );

  const handleSave = () => {
    if (!title.trim()) {
      setFormError('Le titre est requis.');
      return;
    }
    if (!content.trim()) {
      setFormError('Le contenu du template est requis.');
      return;
    }

    setFormError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const result = await saveTemplateDraft({
          id: templateId,
          title,
          category: category || undefined,
          content,
          previewImageUrl: previewImageUrl || undefined,
          tags: tagsArray,
          isDraft,
        });
        setTemplateId(result.id);
        setSuccessMessage('Template sauvegardé.');
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Impossible de sauvegarder le template.');
      }
    });
  };

  const handlePublishToggle = () => {
    if (!templateId) {
      setFormError('Sauvegardez le template avant de modifier le statut.');
      return;
    }

    startTransition(async () => {
      try {
        await publishTemplate({ id: templateId, isDraft: !isDraft });
        setIsDraft(!isDraft);
        setSuccessMessage(!isDraft ? 'Template repassé en brouillon.' : 'Template publié.');
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Impossible de modifier le statut.');
      }
    });
  };

  const handleAttachAsset = async (input: { url: string; type: string }) => {
    if (!templateId) {
      setFormError('Sauvegardez le template avant d’ajouter des assets.');
      return;
    }
    setFormError(null);
    setSuccessMessage(null);

    try {
      const asset = await attachAsset({ templateId, ...input });
      setCurrentAssets((prev) => [{ id: asset.id, url: input.url, type: input.type }, ...prev]);
      setSuccessMessage('Ressource ajoutée.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Impossible d'ajouter la ressource.");
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {formError ? <Alert severity="error">{formError}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
          <TextField label="Titre" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Catégorie"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Image de prévisualisation (URL)"
              value={previewImageUrl}
              onChange={(event) => setPreviewImageUrl(event.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </Stack>
          <TextField
            label="Tags (séparés par des virgules)"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
          />
          <MarkdownEditor label="Contenu Markdown" value={content} onChange={setContent} />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={isPending}>
              Sauvegarder
            </Button>
            <Button
              variant="outlined"
              startIcon={<PublishIcon />}
              onClick={handlePublishToggle}
              disabled={isPending}
            >
              {isDraft ? 'Publier' : 'Marquer en brouillon'}
            </Button>
          </Stack>
        </Stack>
      </Grid>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Guide d’intégration
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Utilisez des placeholders pour personnaliser vos offres :
            </Typography>
            <Stack spacing={1}>
              <Chip label="{{client.name}}" size="small" />
              <Chip label="{{offer.total}}" size="small" />
              <Chip label="{{organization.name}}" size="small" />
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={2}>
              Supporte la syntaxe Markdown et GFM (listes, tableaux...).
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Ressources
            </Typography>
            <UploadField placeholder="https://cdn..." onSubmit={handleAttachAsset} />
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1.5}>
              {currentAssets.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun asset pour le moment.
                </Typography>
              ) : (
                currentAssets.map((asset) => (
                  <Stack key={asset.id} spacing={0.5}>
                    <Typography variant="subtitle2">{asset.type}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {asset.url}
                    </Typography>
                  </Stack>
                ))
              )}
            </Stack>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
}

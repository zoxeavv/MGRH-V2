'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import MarkdownEditor from '@/components/MarkdownEditor';
import { saveTemplateDraft } from '../actions';

type TemplateFormProps = {
  template: {
    id: string;
    title: string;
    category: string | null;
    content: string;
    tags: string[];
    previewImageUrl: string | null;
    isDraft: boolean;
  };
};

const TemplateForm = ({ template }: TemplateFormProps) => {
  const [title, setTitle] = React.useState(template.title);
  const [category, setCategory] = React.useState(template.category ?? '');
  const [previewImageUrl, setPreviewImageUrl] = React.useState(template.previewImageUrl ?? '');
  const [content, setContent] = React.useState(template.content);
  const [tags, setTags] = React.useState(template.tags.join(', '));
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);
    startTransition(async () => {
      const result = await saveTemplateDraft({
        id: template.id,
        title,
        category: category || undefined,
        previewImageUrl: previewImageUrl || undefined,
        content,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        isDraft: template.isDraft,
      });

      if (!result.success) {
        setError(result.error);
      } else {
        setError(null);
        setSuccess(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {success ? <Alert severity="success">Template saved</Alert> : null}

        <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Tags"
            helperText="Comma separated"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            sx={{ flex: 1 }}
          />
        </Stack>

        <TextField
          label="Preview image URL"
          value={previewImageUrl}
          onChange={(event) => setPreviewImageUrl(event.target.value)}
        />

        <MarkdownEditor
          label="Template content"
          value={content}
          onChange={setContent}
          placeholder="Write markdown content..."
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save draft'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default TemplateForm;


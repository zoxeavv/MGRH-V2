'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { IconPlus } from '@tabler/icons-react';

import { saveTemplateDraft } from '../actions';

const CreateTemplateButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await saveTemplateDraft({
        title: 'Untitled template',
        content: '# New template',
        isDraft: true,
      });

      if (result.success) {
        router.push(`/templates/${result.data.id}/edit`);
      }
    });
  };

  return (
    <Button
      variant="contained"
      startIcon={<IconPlus size={18} stroke={1.6} />}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? 'Creating…' : 'New template'}
    </Button>
  );
};

export default CreateTemplateButton;


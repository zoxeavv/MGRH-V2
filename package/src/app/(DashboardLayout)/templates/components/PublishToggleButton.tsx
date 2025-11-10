'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { IconRocket, IconCloudOff } from '@tabler/icons-react';

import { publishTemplate } from '../actions';

type PublishToggleButtonProps = {
  id: string;
  isDraft: boolean;
};

const PublishToggleButton = ({ id, isDraft }: PublishToggleButtonProps) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await publishTemplate({ id, isDraft: !isDraft });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <Button
      variant={isDraft ? 'contained' : 'outlined'}
      color={isDraft ? 'primary' : 'inherit'}
      onClick={handleToggle}
      startIcon={isDraft ? <IconRocket size={18} stroke={1.6} /> : <IconCloudOff size={18} stroke={1.6} />}
      disabled={pending}
    >
      {pending ? 'Updating…' : isDraft ? 'Publish template' : 'Unpublish'}
    </Button>
  );
};

export default PublishToggleButton;


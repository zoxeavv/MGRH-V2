import * as React from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';

import UploadField from '@/components/UploadField';
import { attachAsset } from '../actions';

type TemplateAsset = {
  id: string;
  url: string;
  type: string;
  createdAt: Date;
};

type TemplateAssetsPanelProps = {
  templateId: string;
  assets: TemplateAsset[];
};

const TemplateAssetsPanel = ({ templateId, assets }: TemplateAssetsPanelProps) => {
  const router = useRouter();

  const handleUpload = async (url: string) => {
    await attachAsset({ templateId, url, type: 'image' });
    router.refresh();
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Assets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Attach hosted assets (images, documents, etc.) to reuse inside your template placeholders.
        </Typography>

        <UploadField onUpload={handleUpload} buttonLabel="Attach asset" />

        <Stack spacing={1}>
          {assets.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No assets yet.
            </Typography>
          ) : (
            assets.map((asset) => (
              <Stack
                key={asset.id}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack spacing={0.5}>
                  <Link href={asset.url} target="_blank" rel="noopener noreferrer">
                    {asset.url}
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    Added{' '}
                    {new Intl.DateTimeFormat('en', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(asset.createdAt)}
                  </Typography>
                </Stack>
                <Chip label={asset.type} size="small" variant="outlined" />
              </Stack>
            ))
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TemplateAssetsPanel;


'use client';

import React from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import { IconArchive, IconCircleCheck, IconPlayerPause } from '@tabler/icons-react';

type ClientBulkActionsProps = {
  selectedCount: number;
  disabled?: boolean;
  onMarkActive: () => void;
  onMarkInactive: () => void;
  onMarkArchived: () => void;
};

export default function ClientBulkActions({
  selectedCount,
  disabled,
  onMarkActive,
  onMarkInactive,
  onMarkArchived,
}: ClientBulkActionsProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="flex-end"
      alignItems="center"
      sx={{ opacity: disabled ? 0.7 : 1 }}
    >
      <Tooltip title="Mark selected clients as active">
        <span>
          <Button
            startIcon={<IconCircleCheck size={18} />}
            disabled={disabled}
            onClick={onMarkActive}
          >
            Activate ({selectedCount})
          </Button>
        </span>
      </Tooltip>

      <Tooltip title="Mark selected clients as inactive">
        <span>
          <Button
            startIcon={<IconPlayerPause size={18} />}
            disabled={disabled}
            onClick={onMarkInactive}
          >
            Set Inactive ({selectedCount})
          </Button>
        </span>
      </Tooltip>

      <Tooltip title="Archive selected clients">
        <span>
          <Button
            startIcon={<IconArchive size={18} />}
            disabled={disabled}
            onClick={onMarkArchived}
          >
            Archive ({selectedCount})
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );
}

import { Chip } from '@mui/material';

type StatusChipProps = {
  value: string;
};

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> =
  {
    lead: 'secondary',
    active: 'success',
    inactive: 'default',
    archived: 'warning',
    published: 'primary',
    draft: 'default',
    todo: 'default',
    in_progress: 'warning',
    done: 'success',
    pending: 'warning',
    disabled: 'default',
  };

export function StatusChip({ value }: StatusChipProps) {
  const color = STATUS_COLORS[value] ?? 'default';
  return <Chip size="small" label={value.replaceAll('_', ' ')} color={color} sx={{ textTransform: 'capitalize' }} />;
}

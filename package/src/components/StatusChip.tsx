import Chip from '@mui/material/Chip';

type StatusContext = 'client' | 'offer' | 'task' | 'membership' | 'template';

const STATUS_STYLES: Record<
  StatusContext,
  Record<string, { bg: string; color: string; label?: string }>
> = {
  client: {
    lead: { bg: '#E0F2FF', color: '#1E88E5', label: 'Lead' },
    active: { bg: '#E6FFFA', color: '#02665C', label: 'Active' },
    inactive: { bg: '#F9F5FF', color: '#7F56D9', label: 'Inactive' },
    archived: { bg: '#F8F9FC', color: '#5A6A85', label: 'Archived' },
  },
  offer: {
    draft: { bg: '#FFF4DE', color: '#B88115', label: 'Draft' },
    published: { bg: '#E6FFFA', color: '#02665C', label: 'Published' },
  },
  template: {
    draft: { bg: '#FFF4DE', color: '#B88115', label: 'Draft' },
    published: { bg: '#E6FFFA', color: '#02665C', label: 'Published' },
  },
  task: {
    todo: { bg: '#F8F9FC', color: '#5A6A85', label: 'To do' },
    in_progress: { bg: '#E0F2FF', color: '#1E88E5', label: 'In progress' },
    done: { bg: '#E6FFFA', color: '#02665C', label: 'Done' },
  },
  membership: {
    active: { bg: '#E6FFFA', color: '#02665C', label: 'Active' },
    pending: { bg: '#FFF4DE', color: '#B88115', label: 'Pending' },
    disabled: { bg: '#F8F9FC', color: '#5A6A85', label: 'Disabled' },
  },
};

type StatusChipProps = {
  context: StatusContext;
  status: string;
  size?: 'small' | 'medium';
  labelOverride?: string;
};

const StatusChip = ({ context, status, size = 'small', labelOverride }: StatusChipProps) => {
  const styles = STATUS_STYLES[context][status] ?? {
    bg: '#EAEFF4',
    color: '#2A3547',
    label: status,
  };

  return (
    <Chip
      size={size}
      label={labelOverride ?? styles.label ?? status}
      sx={{
        bgcolor: styles.bg,
        color: styles.color,
        fontWeight: 600,
        textTransform: 'capitalize',
      }}
    />
  );
};

export default StatusChip;


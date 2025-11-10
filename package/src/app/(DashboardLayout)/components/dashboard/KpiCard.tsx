import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

type KpiCardProps = {
  label: string;
  value: number;
  helper?: string;
  prefix?: string;
  suffix?: string;
  accentColor?: string;
};

const KpiCard = ({ label, value, helper, prefix = '', suffix = '', accentColor }: KpiCardProps) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
            {label}
          </Typography>
          <Stack direction="row" alignItems="flex-end" spacing={1}>
            <Typography variant="h3" fontWeight={700}>
              {prefix}
              {value.toLocaleString()}
              {suffix}
            </Typography>
            {helper ? (
              <Chip
                label={helper}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: accentColor ?? 'primary.light',
                  color: accentColor ? '#fff' : 'primary.dark',
                }}
              />
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default KpiCard;


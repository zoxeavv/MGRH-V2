'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { IconTrash, IconPlus } from '@tabler/icons-react';

import { createOfferFromTemplate } from '../actions';

type ClientOption = {
  id: string;
  name: string;
};

type TemplateOption = {
  id: string;
  title: string;
  summary: string | null;
  category: string | null;
  content: string;
  isDraft: boolean;
  updatedAt: string;
};

type OfferWizardProps = {
  clients: ClientOption[];
  templates: TemplateOption[];
};

type ItemDraft = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

const steps = ['Select client', 'Choose template', 'Compose'];

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const OfferWizard = ({ clients, templates }: OfferWizardProps) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [clientId, setClientId] = React.useState(clients[0]?.id ?? '');
  const [templateId, setTemplateId] = React.useState(templates[0]?.id ?? '');
  const selectedTemplate = templates.find((template) => template.id === templateId) ?? templates[0];

  const [title, setTitle] = React.useState(selectedTemplate?.title ?? '');
  const [summary, setSummary] = React.useState(selectedTemplate?.summary ?? '');
  const [items, setItems] = React.useState<ItemDraft[]>([
    {
      id: generateId(),
      name: 'Line item',
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ]);

  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (selectedTemplate) {
      setTitle(selectedTemplate.title);
      setSummary(selectedTemplate.summary ?? '');
    }
  }, [selectedTemplate?.id]);

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        name: 'Line item',
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleItemChange = (id: string, field: keyof ItemDraft, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'quantity' || field === 'unitPrice' ? Number(value) || 0 : value,
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    if (!clientId || !templateId) {
      setError('Select a client and template.');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one item.');
      return;
    }

    setError(null);
    startTransition(async () => {
      const payload = {
        clientId,
        templateId,
        values: {
          title,
          summary,
          items: items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      };

      const result = await createOfferFromTemplate(payload);
      if (!result.success) {
        setError(result.error);
      } else {
        router.push(`/offers/${result.data.id}`);
      }
    });
  };

  return (
    <Stack spacing={3}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {activeStep === 0 ? (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Choose client</Typography>
            <RadioGroup
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
            >
              {clients.map((client) => (
                <FormControlLabel
                  key={client.id}
                  value={client.id}
                  control={<Radio />}
                  label={client.name}
                />
              ))}
            </RadioGroup>
          </Stack>
        </Paper>
      ) : null}

      {activeStep === 1 ? (
        <Stack spacing={2}>
          <Typography variant="h6">Select a template</Typography>
          <Grid container spacing={2}>
            {templates.map((template) => (
              <Grid xs={12} sm={6} md={4} key={template.id}>
                <Card
                  variant={template.id === templateId ? 'outlined' : undefined}
                  sx={{
                    borderColor: template.id === templateId ? 'primary.main' : undefined,
                  }}
                >
                  <CardActionArea onClick={() => setTemplateId(template.id)}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {template.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {template.summary ?? 'No summary'}
                        </Typography>
                        <Chip
                          label={template.category || 'Uncategorized'}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Updated{' '}
                          {new Intl.DateTimeFormat('en', {
                            dateStyle: 'medium',
                          }).format(new Date(template.updatedAt))}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      ) : null}

      {activeStep === 2 ? (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            <TextField
              label="Summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              multiline
              minRows={3}
            />

            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Line items</Typography>
                <Button startIcon={<IconPlus size={16} />} onClick={handleAddItem}>
                  Add item
                </Button>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell width={120}>Quantity</TableCell>
                    <TableCell width={120}>Unit price</TableCell>
                    <TableCell width={120}>Total</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <TextField
                          value={item.name}
                          onChange={(event) => handleItemChange(item.id, 'name', event.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.description}
                          onChange={(event) => handleItemChange(item.id, 'description', event.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          inputProps={{ min: 0, step: 1 }}
                          value={item.quantity}
                          onChange={(event) => handleItemChange(item.id, 'quantity', event.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                          value={item.unitPrice}
                          onChange={(event) => handleItemChange(item.id, 'unitPrice', event.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveItem(item.id)} aria-label="Remove line">
                          <IconTrash size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Stack direction="row" justifyContent="flex-end">
                <Typography variant="subtitle1" fontWeight={600}>
                  Total: ${total.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      ) : null}

      <Divider />

      <Stack direction="row" justifyContent="space-between">
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create offer'}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default OfferWizard;


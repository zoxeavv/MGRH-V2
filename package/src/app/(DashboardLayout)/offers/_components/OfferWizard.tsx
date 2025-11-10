'use client';

import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useMemo, useState, useTransition } from 'react';
import { createOfferFromTemplate } from '../actions';

type WizardClient = {
  id: string;
  name: string;
};

type WizardTemplate = {
  id: string;
  title: string;
  content: string;
  isDraft: boolean;
};

type OfferItemInput = {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
};

type OfferWizardProps = {
  clients: WizardClient[];
  templates: WizardTemplate[];
};

const steps = ['Client', 'Template', 'Composition'];

export function OfferWizard({ clients, templates }: OfferWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [clientId, setClientId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [items, setItems] = useState<OfferItemInput[]>([
    { name: 'Poste 1', description: '', quantity: 1, unitPrice: 0 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  const selectedTemplate = useMemo(() => templates.find((template) => template.id === templateId), [templates, templateId]);

  const handleNext = () => {
    if (activeStep === 0 && !clientId) {
      setError('Choisissez un client.');
      return;
    }
    if (activeStep === 1 && !templateId) {
      setError('Choisissez un template.');
      return;
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError(null);
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const onSelectTemplate = (id: string) => {
    setTemplateId(id);
    const template = templates.find((t) => t.id === id);
    if (template) {
      setTitle(template.title);
      setSummary(template.content.slice(0, 280));
    }
  };

  const handleItemChange = (index: number, patch: Partial<OfferItemInput>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: `Poste ${prev.length + 1}`, quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = () => {
    if (!clientId || !templateId) {
      setError('Client et template sont requis.');
      return;
    }
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    if (items.length === 0) {
      setError('Ajoutez au moins un poste.');
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const response = await createOfferFromTemplate({
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
        });
        setSuccess('Offre créée avec succès.');
        setActiveStep(0);
        setClientId('');
        setTemplateId('');
        setTitle('');
        setSummary('');
        setItems([{ name: 'Poste 1', description: '', quantity: 1, unitPrice: 0 }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de créer l'offre.");
      }
    });
  };

  return (
    <Stack spacing={3}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Sélectionnez un client
          </Typography>
          <TextField
            select
            fullWidth
            label="Client"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </TextField>
        </Paper>
      )}
      {activeStep === 1 && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Choisissez un template
          </Typography>
          <TextField
            select
            fullWidth
            label="Template"
            value={templateId}
            onChange={(event) => onSelectTemplate(event.target.value)}
          >
            {templates
              .filter((template) => !template.isDraft)
              .map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.title}
                </MenuItem>
              ))}
          </TextField>
          {selectedTemplate ? (
            <Typography variant="body2" color="text.secondary" mt={2}>
              {selectedTemplate.content.slice(0, 180)}...
            </Typography>
          ) : null}
        </Paper>
      )}
      {activeStep === 2 && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <TextField label="Titre de l'offre" value={title} onChange={(event) => setTitle(event.target.value)} />
            <TextField
              label="Résumé"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              multiline
              minRows={2}
            />
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Postes
                </Typography>
                <Button startIcon={<AddIcon />} onClick={addItem}>
                  Ajouter un poste
                </Button>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix unitaire (€)</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={item.name}
                          onChange={(event) => handleItemChange(index, { name: event.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.description ?? ''}
                          onChange={(event) => handleItemChange(index, { description: event.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.quantity}
                          inputProps={{ min: 1 }}
                          onChange={(event) => handleItemChange(index, { quantity: Number(event.target.value) })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.unitPrice}
                          inputProps={{ min: 0, step: 0.01 }}
                          onChange={(event) => handleItemChange(index, { unitPrice: Number(event.target.value) })}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => removeItem(index)} disabled={items.length === 1}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="subtitle2" align="right" mt={2}>
                Total estimé:{' '}
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0))}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button onClick={handlePrev} disabled={activeStep === 0}>
          Précédent
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Suivant
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
            Créer l'offre
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

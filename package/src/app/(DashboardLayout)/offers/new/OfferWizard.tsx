'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { createOffer, type OfferItem } from '../actions';
import { useToast } from '@/hooks/use-toast';
import type { clients } from '@/lib/db/schema';

type Client = typeof clients.$inferSelect;

interface OfferWizardProps {
  organizationId: string;
  userId: string;
  clients: Client[];
}

type WizardStep = 'client' | 'items' | 'pricing' | 'review';

interface DraftOffer {
  clientId: string;
  title: string;
  items: OfferItem[];
  subtotal: number;
  taxRate: number;
  total: number;
  validUntil?: Date | undefined;
}

export function OfferWizard({ organizationId, userId, clients }: OfferWizardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<WizardStep>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [draft, setDraft] = useState<DraftOffer>({
    clientId: '',
    title: '',
    items: [],
    subtotal: 0,
    taxRate: 0,
    total: 0,
  });

  // Autosave to localStorage
  const saveDraft = (updates: Partial<DraftOffer>) => {
    const updated = { ...draft, ...updates };
    setDraft(updated);
    try {
      localStorage.setItem('offer-draft', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  const addItem = () => {
    const newItem: OfferItem = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    const updatedItems = [...draft.items, newItem];
    const subtotal = calculateSubtotal(updatedItems);
    const total = calculateTotal(subtotal, draft.taxRate);
    saveDraft({ items: updatedItems, subtotal, total });
  };

  const removeItem = (itemId: string) => {
    const updatedItems = draft.items.filter((item) => item.id !== itemId);
    const subtotal = calculateSubtotal(updatedItems);
    const total = calculateTotal(subtotal, draft.taxRate);
    saveDraft({ items: updatedItems, subtotal, total });
  };

  const updateItem = (itemId: string, updates: Partial<OfferItem>) => {
    const updatedItems = draft.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    const subtotal = calculateSubtotal(updatedItems);
    const total = calculateTotal(subtotal, draft.taxRate);
    saveDraft({ items: updatedItems, subtotal, total });
  };

  const calculateSubtotal = (items: OfferItem[]): number => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const calculateTotal = (subtotal: number, taxRate: number): number => {
    return subtotal * (1 + taxRate / 100);
  };

  const handleNext = () => {
    if (step === 'client') {
      if (!draft.clientId) {
        toast({
          title: 'Client required',
          description: 'Please select a client',
          variant: 'destructive',
        });
        return;
      }
      setStep('items');
    } else if (step === 'items') {
      if (draft.items.length === 0) {
        toast({
          title: 'Items required',
          description: 'Please add at least one item',
          variant: 'destructive',
        });
        return;
      }
      setStep('pricing');
    } else if (step === 'pricing') {
      setStep('review');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const input: {
        organizationId: string;
        clientId: string;
        title: string;
        items: OfferItem[];
        subtotal: number;
        taxRate: number;
        total: number;
        validUntil?: Date | undefined;
        createdById: string;
      } = {
        organizationId,
        clientId: draft.clientId,
        title: draft.title || `Offer for ${clients.find((c) => c.id === draft.clientId)?.name || 'Client'}`,
        items: draft.items,
        subtotal: draft.subtotal,
        taxRate: draft.taxRate,
        total: draft.total,
        createdById: userId,
      };
      if (draft.validUntil) {
        input.validUntil = draft.validUntil;
      }
      await createOffer(input);
      
      localStorage.removeItem('offer-draft');
      toast({
        title: 'Offer created',
        description: 'Your offer has been created successfully.',
      });
      router.push('/offers');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create offer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClient = clients.find((c) => c.id === draft.clientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Offer</h1>
          <p className="text-muted-foreground">Step {step === 'client' ? 1 : step === 'items' ? 2 : step === 'pricing' ? 3 : 4} of 4</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/offers')}>
          Cancel
        </Button>
      </div>

      <div className="flex gap-2">
        {(['client', 'items', 'pricing', 'review'] as WizardStep[]).map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <Badge variant={step === s ? 'default' : 'outline'}>
              {idx + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </Badge>
            {idx < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>
            {step === 'client' && 'Select Client'}
            {step === 'items' && 'Add Items'}
            {step === 'pricing' && 'Pricing & Terms'}
            {step === 'review' && 'Review & Submit'}
          </CardTitle>
          <CardDescription>
            {step === 'client' && 'Choose the client for this offer'}
            {step === 'items' && 'Add items to include in the offer'}
            {step === 'pricing' && 'Set pricing and validity period'}
            {step === 'review' && 'Review all details before submitting'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Client Selection */}
          {step === 'client' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <select
                  id="client"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={draft.clientId}
                  onChange={(e) => saveDraft({ clientId: e.target.value })}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `(${client.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Offer Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Q1 2024 Services"
                  value={draft.title}
                  onChange={(e) => saveDraft({ title: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Items */}
          {step === 'items' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button onClick={addItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              {draft.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items added yet. Click &quot;Add Item&quot; to get started.</p>
              ) : (
                <div className="space-y-4">
                  {draft.items.map((item, idx) => (
                    <div key={item.id} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Item {idx + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Name *</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, { name: e.target.value })}
                            placeholder="Item name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            placeholder="Item description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit Price *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Subtotal: ${(item.quantity * item.unitPrice).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 'pricing' && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">${draft.subtotal.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={draft.taxRate}
                    onChange={(e) => {
                      const taxRate = parseFloat(e.target.value) || 0;
                      const total = calculateTotal(draft.subtotal, taxRate);
                      saveDraft({ taxRate, total });
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>${draft.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until (optional)</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={draft.validUntil ? draft.validUntil.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      saveDraft({ validUntil: new Date(e.target.value) });
                    } else {
                      // Remove validUntil by not including it
                      const { validUntil, ...rest } = draft;
                      setDraft(rest);
                      try {
                        localStorage.setItem('offer-draft', JSON.stringify(rest));
                      } catch {
                        // Ignore localStorage errors
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold">Client</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedClient?.name} {selectedClient?.company ? `(${selectedClient.company})` : ''}
                </p>
              </div>
              <div className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold">Title</h3>
                <p className="text-sm text-muted-foreground">{draft.title || 'Untitled Offer'}</p>
              </div>
              <div className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold">Items ({draft.items.length})</h3>
                <div className="space-y-2">
                  {draft.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${draft.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({draft.taxRate}%)</span>
                  <span>${(draft.total - draft.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${draft.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 'items') setStep('client');
                else if (step === 'pricing') setStep('items');
                else if (step === 'review') setStep('pricing');
              }}
              disabled={step === 'client'}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {step !== 'review' ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Offer'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

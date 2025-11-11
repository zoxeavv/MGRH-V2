'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { X, Save, Settings } from 'lucide-react';
import { createTemplate, updateTemplate } from './actions';
import { useToast } from '@/hooks/use-toast';

const templateFormSchema = z.object({
  name: z.string().min(1, 'Title is required').trim(),
  description: z.string().default(''),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

interface TemplateEditorProps {
  organizationId: string;
  userId: string;
  templateId?: string | undefined;
  initialData?: {
    name: string;
    description?: string | null | undefined;
    content?: string | null | undefined;
  } | undefined;
}

export function TemplateEditor({
  organizationId,
  userId,
  templateId,
  initialData,
}: TemplateEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMetaDrawerOpen, setIsMetaDrawerOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(initialData ? [] : []);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      tags: [],
      category: undefined,
    },
  });

  const content = watch('content');

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true);
    try {
      if (templateId) {
        await updateTemplate({
          id: templateId,
          organizationId,
          name: data.name,
          description: data.description || undefined,
          content: data.content || undefined,
          tags: data.tags.length > 0 ? data.tags : undefined,
          category: data.category,
        });
        toast({
          title: 'Template updated',
          description: 'Your template has been updated successfully.',
        });
      } else {
        await createTemplate({
          organizationId,
          name: data.name,
          description: data.description || undefined,
          content: data.content || undefined,
          tags: data.tags.length > 0 ? data.tags : undefined,
          category: data.category,
          createdById: userId,
        });
        toast({
          title: 'Template created',
          description: 'Your template has been created successfully.',
        });
      }
      router.push('/templates');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple markdown preview (sanitized)
  const renderMarkdown = (markdown: string): string => {
    // Basic markdown rendering (in production, use a proper library like marked or remark)
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/gim, '<br>');
    
    // Remove script tags for XSS protection
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    return html;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{templateId ? 'Edit Template' : 'New Template'}</h1>
          <p className="text-muted-foreground">Create and edit offer templates</p>
        </div>
        <div className="flex gap-2">
          <Sheet open={isMetaDrawerOpen} onOpenChange={setIsMetaDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Meta
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Template Metadata</SheetTitle>
                <SheetDescription>Add metadata to organize your templates</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...register('category')}
                    placeholder="e.g., Sales, Marketing"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add a tag"
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                            aria-label={`Remove ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" onClick={() => router.push('/templates')}>
            Cancel
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>Basic information about your template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Title *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Template title"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Brief description"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Markdown Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                {...register('content')}
                className="w-full min-h-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="Write your template content in Markdown..."
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none min-h-[400px] p-4"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content || '') }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : templateId ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </div>
  );
}

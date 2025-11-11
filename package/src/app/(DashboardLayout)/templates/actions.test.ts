import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { normalizeArray, normalizeString } from '@/lib/guards';

const templateSchema = z.object({
  name: z.string().min(1, 'Title is required').transform((val) => val.trim()),
  description: z.string().default('').transform((val) => val.trim()),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
});

describe('templates actions', () => {
  describe('zod schema validation', () => {
    it('should accept minimal valid payload', () => {
      const result = templateSchema.parse({
        name: 'Test Template',
        description: '',
        content: '',
        tags: [],
      });
      expect(result.name).toBe('Test Template');
      expect(result.description).toBe('');
      expect(result.content).toBe('');
      expect(result.tags).toEqual([]);
    });

    it('should reject empty title', () => {
      expect(() => {
        templateSchema.parse({
          name: '',
          description: '',
          content: '',
          tags: [],
        });
      }).toThrow();
    });

    it('should trim whitespace from title', () => {
      const result = templateSchema.parse({
        name: '  Test Template  ',
        description: '',
        content: '',
        tags: [],
      });
      expect(result.name).toBe('Test Template');
    });

    it('should handle optional fields', () => {
      const result = templateSchema.parse({
        name: 'Test',
        description: 'Description',
        content: '# Content',
        tags: ['tag1', 'tag2'],
        category: 'sales',
      });
      expect(result.description).toBe('Description');
      expect(result.content).toBe('# Content');
      expect(result.tags).toEqual(['tag1', 'tag2']);
      expect(result.category).toBe('sales');
    });
  });

  describe('normalization utils', () => {
    it('should normalize undefined to defaults', () => {
      expect(normalizeArray(undefined)).toEqual([]);
      expect(normalizeString(undefined)).toBe('');
    });

    it('should be idempotent', () => {
      const arr = [1, 2, 3];
      expect(normalizeArray(normalizeArray(arr))).toEqual(arr);
      
      const str = 'test';
      expect(normalizeString(normalizeString(str))).toBe(str);
    });

    it('should handle empty arrays', () => {
      expect(normalizeArray([])).toEqual([]);
    });
  });

  describe('slug generation', () => {
    const generateSlug = (name: string): string => {
      return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
    };

    it('should generate slug from name', () => {
      expect(generateSlug('Test Template')).toBe('test-template');
      expect(generateSlug('  My Template  ')).toBe('my-template');
      expect(generateSlug('Template #1')).toBe('template-1');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Template (2024)')).toBe('template-2024');
      expect(generateSlug('Template@#$%')).toBe('template');
    });
  });

  describe('markdown sanitization', () => {
    const sanitizeMarkdown = (markdown: string): string => {
      let html = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\n/gim, '<br>');
      
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      return html;
    };

    it('should remove script tags', () => {
      const markdown = '# Test\n<script>alert("xss")</script>';
      const result = sanitizeMarkdown(markdown);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should render links safely', () => {
      const markdown = '[Link](https://example.com)';
      const result = sanitizeMarkdown(markdown);
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain('target="_blank"');
    });

    it('should render markdown correctly', () => {
      const markdown = '# Title\n**Bold** text';
      const result = sanitizeMarkdown(markdown);
      expect(result).toContain('<h1>Title</h1>');
      expect(result).toContain('<strong>Bold</strong>');
    });
  });
});

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { parseCSV, importClients, type CSVParseResult } from './import-actions';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/components/providers/OrganizationProvider';

interface ImportClientFormProps {
  organizationId: string;
  userId: string;
  onSuccess?: () => void;
}

export function ImportClientForm({ organizationId, userId, onSuccess }: ImportClientFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);

    try {
      const content = await selectedFile.text();
      const result = await parseCSV(content, selectedFile.name);
      setParseResult(result);
    } catch (error) {
      toast({
        title: 'Parse error',
        description: error instanceof Error ? error.message : 'Failed to parse CSV file',
        variant: 'destructive',
      });
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) {
      toast({
        title: 'No valid rows',
        description: 'Please fix errors before importing',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    try {
      const result = await importClients({
        organizationId,
        rows: parseResult.validRows,
        ownerId: userId,
      });

      toast({
        title: 'Import successful',
        description: `Imported ${result.imported} clients${result.duplicates > 0 ? `, ${result.duplicates} duplicates skipped` : ''}`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/clients');
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to import clients',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Import Clients from CSV</CardTitle>
          <CardDescription>
            Upload a CSV file with client data. Required: name OR company. Optional: email, phone, tags (pipe-separated).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="csv-file" className="text-sm font-medium">
              CSV File (max 5MB)
            </label>
            <div className="flex items-center gap-4">
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                disabled={isParsing || isImporting}
              />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {isParsing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Parsing CSV file...</span>
            </div>
          )}

          {parseResult && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Valid rows</span>
                  <Badge variant="default">{parseResult.validRows.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Invalid rows</span>
                  <Badge variant={parseResult.invalidRows.length > 0 ? 'destructive' : 'secondary'}>
                    {parseResult.invalidRows.length}
                  </Badge>
                </div>
              </div>

              {parseResult.validRows.length > 0 && (
                <div className="rounded-lg border">
                  <div className="border-b p-4">
                    <h3 className="font-semibold">Preview (first 5 rows)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left text-sm font-medium">Name</th>
                          <th className="p-3 text-left text-sm font-medium">Company</th>
                          <th className="p-3 text-left text-sm font-medium">Email</th>
                          <th className="p-3 text-left text-sm font-medium">Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.validRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-3 text-sm">{row.name}</td>
                            <td className="p-3 text-sm">{row.company || '—'}</td>
                            <td className="p-3 text-sm">{row.email || '—'}</td>
                            <td className="p-3 text-sm">
                              {row.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {row.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                '—'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {parseResult.invalidRows.length > 0 && (
                <div className="rounded-lg border border-destructive">
                  <div className="border-b border-destructive bg-destructive/10 p-4">
                    <h3 className="font-semibold text-destructive">Invalid Rows</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {parseResult.invalidRows.map((invalid, idx) => (
                      <div key={idx} className="border-b p-4 last:border-b-0">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Row {invalid.row}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {invalid.errors.join(', ')}
                            </p>
                            <pre className="text-xs mt-2 p-2 bg-muted rounded">
                              {JSON.stringify(invalid.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setParseResult(null);
                  }}
                  disabled={isImporting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={parseResult.validRows.length === 0 || isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import {parseResult.validRows.length} clients
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

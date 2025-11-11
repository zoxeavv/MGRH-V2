'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Phone, Building2 } from 'lucide-react';
import type { clients } from '@/lib/db/schema';
import { normalizeArray } from '@/lib/guards';

type Client = typeof clients.$inferSelect;

interface ClientDetailViewProps {
  client: Client;
  organizationId: string;
}

export function ClientDetailView({ client }: ClientDetailViewProps) {
  const notes = normalizeArray(client.notes);
  const files = normalizeArray(client.files);
  const tags = normalizeArray(client.tags);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">Client details and activity</p>
        </div>
        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
          {client.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Info Card */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.company && (
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span>{client.company}</span>
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </CardHeader>
          <CardContent>
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-lg border p-4">
                    <p className="text-sm">{note.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Files Card */}
        {files.length > 0 && (
          <Card className="rounded-2xl md:col-span-2">
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="text-sm">{file.name}</span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

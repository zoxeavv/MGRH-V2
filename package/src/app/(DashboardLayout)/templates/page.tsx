import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getTemplatesByOrganizationId } from '@/lib/db/queries/templates';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default async function TemplatesPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const templatesList = await getTemplatesByOrganizationId(orgData.organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage your offer templates</p>
        </div>
        <Button asChild>
          <Link href="/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          {templatesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No templates yet.</p>
              <Button asChild>
                <Link href="/templates/new">Create your first template</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {templatesList.map((template) => (
                <div key={template.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{template.isDefault ? 'Default' : 'Custom'}</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/templates/${template.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

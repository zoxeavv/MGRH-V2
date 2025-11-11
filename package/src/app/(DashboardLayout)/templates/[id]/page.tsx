import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getTemplateById } from '@/lib/db/queries/templates';
import { redirect, notFound } from 'next/navigation';
import { TemplateEditor } from '../TemplateEditor';

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const { id } = await params;
  const template = await getTemplateById(id, orgData.organization.id);

  if (!template) {
    notFound();
  }

  return (
    <TemplateEditor
      organizationId={orgData.organization.id}
      userId={session.user.id}
      templateId={template.id}
      initialData={{
        name: template.name,
        description: template.description ?? undefined,
        content: template.content ?? undefined,
      }}
    />
  );
}

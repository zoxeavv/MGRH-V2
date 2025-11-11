import { TemplatesTable } from "@/components/templates/TemplatesTable";
import { getTemplates } from "@/lib/db/queries/templates";
import { getOrganizationContext } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function TemplatesPage() {
  const organization = await getOrganizationContext();
  if (!organization) {
    redirect("/authentication/login");
  }

  const templates = await getTemplates(organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Manage your content library and templates
          </p>
        </div>
      </div>
      <TemplatesTable initialTemplates={templates} organizationId={organization.id} />
    </div>
  );
}

import { OffersTable } from "@/components/offers/OffersTable";
import { getOffers } from "@/lib/db/queries/offers";
import { getOrganizationContext } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function OffersPage() {
  const organization = await getOrganizationContext();
  if (!organization) {
    redirect("/authentication/login");
  }

  const offers = await getOffers(organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground">
            Manage your client offers and proposals
          </p>
        </div>
      </div>
      <OffersTable initialOffers={offers} organizationId={organization.id} />
    </div>
  );
}

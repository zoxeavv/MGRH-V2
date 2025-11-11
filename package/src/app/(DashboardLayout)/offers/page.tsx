import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getOffersByOrganizationId } from '@/lib/db/queries/offers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default async function OffersPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const offersList = await getOffersByOrganizationId(orgData.organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Create and manage client offers</p>
        </div>
        <Button asChild>
          <Link href="/offers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Offer
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
        </CardHeader>
        <CardContent>
          {offersList.length === 0 ? (
            <p className="text-muted-foreground">No offers yet. Create your first offer to get started.</p>
          ) : (
            <div className="space-y-4">
              {offersList.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Total: ${offer.total ? parseFloat(offer.total).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={offer.status === 'draft' ? 'secondary' : 'default'}>
                      {offer.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/offers/${offer.id}`}>View</Link>
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

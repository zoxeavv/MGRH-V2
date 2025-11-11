import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Create and manage client offers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Offer
        </Button>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No offers yet. Create your first offer to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}

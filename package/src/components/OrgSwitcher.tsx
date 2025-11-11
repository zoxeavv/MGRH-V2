'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { useOrganization } from '@/components/providers/OrganizationProvider';
import type { OrganizationWithRole } from '@/lib/auth/roles';

interface OrgSwitcherProps {
  organizations: OrganizationWithRole[];
}

export function OrgSwitcher({ organizations }: OrgSwitcherProps) {
  const router = useRouter();
  const { organization } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (orgId: string) => {
    // In a real app, this would update the session/context
    // For now, we'll just reload the page
    router.refresh();
    setIsOpen(false);
  };

  if (!organization) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{organization.name}</span>
            <Badge variant="secondary" className="text-xs">
              {organization.role}
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{org.name}</span>
            </div>
            {org.id === organization.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

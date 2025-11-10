'use server';

import { db } from '@/lib/db/client';
import { activityLog } from '@/lib/db/schema';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';

type ActivityAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'published'
  | 'duplicated'
  | 'invited';

type ActivityEntity = 'client' | 'offer' | 'template' | 'membership' | 'organization';

type LogActivityInput = {
  organizationId?: string;
  actorProfileId?: string;
  action: ActivityAction;
  entityType: ActivityEntity;
  entityId: string;
  metadata?: Record<string, unknown>;
};

export const logActivity = async ({
  organizationId,
  actorProfileId,
  action,
  entityType,
  entityId,
  metadata,
}: LogActivityInput) => {
  const context = await getActiveMembershipOrRedirect();

  const orgId = organizationId ?? context.organization.id;
  const actorId = actorProfileId ?? context.profile.id;

  await db.insert(activityLog).values({
    organizationId: orgId,
    actorProfileId: actorId,
    action,
    entityType,
    entityId,
    metadata: metadata ?? {},
  });
};


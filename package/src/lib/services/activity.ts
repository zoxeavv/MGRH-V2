import { getDbClient } from '@/lib/db/client';
import { activityLog } from '@/lib/db/schema';

type LogActivityInput = {
  organizationId: string;
  actorProfileId: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'published' | 'duplicated' | 'invited';
  entityType: 'client' | 'offer' | 'template' | 'membership' | 'organization';
  entityId: string;
  metadata?: Record<string, unknown>;
};

export const logActivity = async ({
  organizationId,
  actorProfileId,
  action,
  entityType,
  entityId,
  metadata = {},
}: LogActivityInput) => {
  const db = getDbClient();
  await db.insert(activityLog).values({
    organizationId,
    actorProfileId,
    action,
    entityType,
    entityId,
    metadata,
  });
};

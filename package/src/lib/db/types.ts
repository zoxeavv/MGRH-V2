import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  activityLog,
  activityActionEnum,
  activityEntityEnum,
  clients,
  membershipRoleEnum,
  membershipStatusEnum,
  memberships,
  notes,
  offerItems,
  offerVersions,
  offers,
  organizations,
  profiles,
  taskStatusEnum,
  tasks,
  templateAssets,
  templates,
} from './schema';

type TableDefinition<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: never[];
};

type PublicTables = {
  organizations: TableDefinition<
    InferSelectModel<typeof organizations>,
    InferInsertModel<typeof organizations>
  >;
  profiles: TableDefinition<
    InferSelectModel<typeof profiles>,
    InferInsertModel<typeof profiles>
  >;
  memberships: TableDefinition<
    InferSelectModel<typeof memberships>,
    InferInsertModel<typeof memberships>
  >;
  clients: TableDefinition<
    InferSelectModel<typeof clients>,
    InferInsertModel<typeof clients>
  >;
  offers: TableDefinition<
    InferSelectModel<typeof offers>,
    InferInsertModel<typeof offers>
  >;
  offer_versions: TableDefinition<
    InferSelectModel<typeof offerVersions>,
    InferInsertModel<typeof offerVersions>
  >;
  offer_items: TableDefinition<
    InferSelectModel<typeof offerItems>,
    InferInsertModel<typeof offerItems>
  >;
  templates: TableDefinition<
    InferSelectModel<typeof templates>,
    InferInsertModel<typeof templates>
  >;
  template_assets: TableDefinition<
    InferSelectModel<typeof templateAssets>,
    InferInsertModel<typeof templateAssets>
  >;
  notes: TableDefinition<
    InferSelectModel<typeof notes>,
    InferInsertModel<typeof notes>
  >;
  tasks: TableDefinition<
    InferSelectModel<typeof tasks>,
    InferInsertModel<typeof tasks>
  >;
  activity_log: TableDefinition<
    InferSelectModel<typeof activityLog>,
    InferInsertModel<typeof activityLog>
  >;
};

export type MembershipRole = (typeof membershipRoleEnum.enumValues)[number];
export type MembershipStatus = (typeof membershipStatusEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type ActivityAction = (typeof activityActionEnum.enumValues)[number];
export type ActivityEntity = (typeof activityEntityEnum.enumValues)[number];

export type Database = {
  public: {
    Tables: PublicTables;
    Views: Record<string, never>;
    Functions: {
      is_member: {
        Args: { target_org_id: string; target_user_id: string };
        Returns: boolean;
      };
      has_org_role: {
        Args: {
          target_org_id: string;
          target_user_id: string;
          allowed_roles: string[];
        };
        Returns: boolean;
      };
    };
    Enums: {
      membership_role: MembershipRole;
      membership_status: MembershipStatus;
      task_status: TaskStatus;
      activity_action: ActivityAction;
      activity_entity: ActivityEntity;
    };
  };
};

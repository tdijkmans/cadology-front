type CheckId = number;

interface Check {
  checkId: CheckId;
  value: number;
}

type ActivityId = number;

type CheckStore = Map<ActivityId, Check[]>;

export type { ActivityId, Check, CheckId, CheckStore };

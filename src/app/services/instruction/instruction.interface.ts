type Check = {
  checkId: number;
  value: number;
};

type CheckStore = Map<number, Check[]>;

export type { Check, CheckStore };

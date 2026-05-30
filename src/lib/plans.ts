export type PlanId = "free" | "starter" | "pro" | "agency";

const PLAN_RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  agency: 3,
};

export function hasFeature(
  userPlan: string,
  requiredPlan: PlanId
): boolean {
  return (PLAN_RANK[userPlan] ?? 0) >= PLAN_RANK[requiredPlan];
}

// Specific feature checks
export const canUseTones = (plan: string) => hasFeature(plan, "starter");
export const canViewHistory = (plan: string) => hasFeature(plan, "starter");
export const canUseProductionKit = (plan: string) => hasFeature(plan, "pro");

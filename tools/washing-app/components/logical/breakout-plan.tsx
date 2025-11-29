import { BreakoutPlan as BreakoutPlanType } from "@/app/models/player";
import { Card, CardContent } from "@/components/ui/card";

interface BreakoutPlanProps {
  breakoutPlan: BreakoutPlanType;
}

export const BreakoutPlan = ({ breakoutPlan }: BreakoutPlanProps) => {
  return (
    <Card>
      <CardContent>
        <pre>{JSON.stringify(breakoutPlan, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};

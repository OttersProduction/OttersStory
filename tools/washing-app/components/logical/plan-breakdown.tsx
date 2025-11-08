import { Card, CardContent } from "@/components/ui/card";
import { HPWashPlan } from "@/app/models/hp-wash";
import { formatNumber } from "@/app/utils/format";

interface PlanBreakdownProps extends HPWashPlan {}

export const PlanBreakdown = ({
  totalAPResets,
  finalHP,
  finalMP,
  finalInt,
}: PlanBreakdownProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Total AP Resets</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(totalAPResets)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Final HP</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(finalHP)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Final MP</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(finalMP)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Final INT</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(finalInt)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { Card, CardContent } from "@/components/ui/card";
import { WashPlan } from "@/app/models/wash-plan";
import { formatNumber, formatCurrency } from "@/app/utils/format";
import { DEFAULT_PREFERENCES } from "@/app/models/defaults";
import { useMemo } from "react";

interface WashingOverviewProps extends WashPlan {}

export const WashingOverview = ({
  player,
  totalAPResets,
  finalInt,
}: WashingOverviewProps) => {
  const cost = useMemo(() => {
    return totalAPResets * DEFAULT_PREFERENCES.aprCostMeso;
  }, [totalAPResets]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Total AP Resets</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(totalAPResets)} ≈ {formatCurrency(cost)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Int</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(finalInt)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Final HP</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(player.hp)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">Final MP</div>
          <div className="tracking-tight text-3xl font-semibold tabular-nums">
            {formatNumber(player.mp)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

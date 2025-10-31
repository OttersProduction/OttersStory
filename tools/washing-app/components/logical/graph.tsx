import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Job } from "@/app/models/job";

interface GraphProps {
  job: Job;
  data: { level: number; hp: number; mp: number }[];
}
export default function Graph({ job, data }: GraphProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HP and MP Growth Chart</CardTitle>
        <CardDescription>
          Showing HP and MP progression for{" "}
          {job.replace("_", " ").toLowerCase()} from level 1 to 200
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value.toLocaleString(), name]}
                labelFormatter={(level) => `Level ${level}`}
              />
              <Line
                type="monotone"
                dataKey="hp"
                stroke="var(--primary)"
                strokeWidth={2}
                name="HP"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mp"
                stroke="var(--secondary)"
                strokeWidth={2}
                name="MP"
                dot={false}
              />
              <Legend verticalAlign="top" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

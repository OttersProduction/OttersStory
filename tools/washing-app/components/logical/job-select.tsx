import { Job } from "@/app/models/job";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface JobSelectProps {
  job: Job;
  onSelectJob: (job: Job) => void;
}
export const JobSelect = ({ job, onSelectJob }: JobSelectProps) => {
  return (
    <Select value={job} onValueChange={(value) => onSelectJob(value as Job)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a class" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={Job.BEGINNER}>Beginner</SelectItem>
        <SelectItem value={Job.MAGICIAN}>Magician</SelectItem>
        <SelectItem value={Job.DARK_KNIGHT}>Dark Knight</SelectItem>
        <SelectItem value={Job.PALADIN}>Paladin</SelectItem>
        <SelectItem value={Job.HERO}>Hero</SelectItem>
        <SelectItem value={Job.NIGHT_LORD}>Night Lord</SelectItem>
        <SelectItem value={Job.SHADOWER}>Shadower</SelectItem>
        <SelectItem value={Job.BOWMASTER}>Bowmaster</SelectItem>
        <SelectItem value={Job.MARKSMAN}>Marksman</SelectItem>
        <SelectItem value={Job.CORSAIR}>Corsair</SelectItem>
        <SelectItem value={Job.BUCCANEER}>Buccaneer</SelectItem>
      </SelectContent>
    </Select>
  );
};

import { Job } from "@/app/models/job";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCallback } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface JobSelectProps {
  job: Job;
  onSelectJob: (job: Job) => void;
}
export const JobSelect = ({ job, onSelectJob }: JobSelectProps) => {
  const label = useCallback((value: Job) => {
    switch (value) {
      case Job.BEGINNER:
        return "Beginner";
      case Job.MAGICIAN:
        return "Magician";
      case Job.DARK_KNIGHT:
        return "Dark Knight";
      case Job.PALADIN:
        return "Paladin";
      case Job.HERO:
        return "Hero";
      case Job.NIGHT_LORD:
        return "Night Lord";
      case Job.SHADOWER:
        return "Shadower";
      case Job.BOWMASTER:
        return "Bowmaster";
      case Job.MARKSMAN:
        return "Marksman";
      case Job.CORSAIR:
        return "Corsair";
      case Job.BUCCANEER:
        return "Buccaneer";
      default:
        return "Beginner";
    }
  }, []);

  return (
    <Select value={job} onValueChange={(value) => onSelectJob(value as Job)}>
      <SelectTrigger className="w-full">
        <SelectValue>{label(job)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={Job.BEGINNER}>{label(Job.BEGINNER)}</SelectItem>
        <SelectItem value={Job.MAGICIAN}>{label(Job.MAGICIAN)}</SelectItem>
        <SelectItem value={Job.DARK_KNIGHT}>
          {label(Job.DARK_KNIGHT)}
        </SelectItem>
        <SelectItem value={Job.PALADIN}>{label(Job.PALADIN)}</SelectItem>
        <SelectItem value={Job.HERO}>{label(Job.HERO)}</SelectItem>
        <SelectItem value={Job.NIGHT_LORD}>{label(Job.NIGHT_LORD)}</SelectItem>
        <SelectItem value={Job.SHADOWER}>{label(Job.SHADOWER)}</SelectItem>
        <SelectItem value={Job.BOWMASTER}>{label(Job.BOWMASTER)}</SelectItem>
        <SelectItem value={Job.MARKSMAN}>{label(Job.MARKSMAN)}</SelectItem>
        <SelectItem value={Job.CORSAIR}>{label(Job.CORSAIR)}</SelectItem>
        <SelectItem value={Job.BUCCANEER}>{label(Job.BUCCANEER)}</SelectItem>
      </SelectContent>
    </Select>
  );
};

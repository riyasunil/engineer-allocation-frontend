import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertRequest, Priority } from "../Alerts";

function PriorityBadge({ level }: { level: Priority }) {
  const colorMap: Record<Priority, string> = {
    high: "destructive",
    medium: "secondary",
    low: "default",
  };
  return (
    <Badge variant={colorMap[level]} className="capitalize">
      {level} priority
    </Badge>
  );
}

function SkillTag({ skill }: { skill: string }) {
  return (
    <Badge variant="outline" className="text-xs font-medium">
      {skill}
    </Badge>
  );
}

export default function RequestCard({ request }: { request: AlertRequest }) {
  return (
    <Card className="border-muted">
      <CardHeader className="flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-2">
          {request.unread && (
            <Badge variant="destructive" className="text-xs px-2">
              New
            </Badge>
          )}
          <CardTitle>{request.project}</CardTitle>
        </div>
        <PriorityBadge level={request.priority} />
      </CardHeader>

      <CardContent className="space-y-3">
        <CardDescription>Requested by {request.requester}</CardDescription>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <UserCircle2 className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            {request.quantity}× {request.roleNeeded}
          </span>

          <CalendarClock className="ml-6 h-4 w-4 shrink-0" />
          <span>
            Required by&nbsp;
            <span className="font-medium">{request.dueDate}</span>
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {request.skills.map((s) => (
              <SkillTag key={s} skill={s} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">Justification:</p>
          <p className="text-sm leading-relaxed">{request.justification}</p>
        </div>
      </CardContent>

      <CardFooter className="gap-3">
        <Button size="sm" variant="default">
          Approve
        </Button>
        <Button size="sm" variant="destructive">
          Reject
        </Button>
        <Button size="sm" variant="outline">
          Mark as Read
        </Button>
      </CardFooter>
    </Card>
  );
}

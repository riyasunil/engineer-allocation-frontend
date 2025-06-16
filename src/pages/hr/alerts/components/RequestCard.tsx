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
import { CalendarClock, UserCircle2 } from "lucide-react";

function PriorityBadge({ level }: { level: Priority }) {
  const colorMap: Record<Priority, "destructive" | "secondary" | "default"> = {
    high: "destructive",
    medium: "secondary",
    low: "default",
  }

  return (
    <Badge variant={colorMap[level]} className="capitalize">
      {level} Priority
    </Badge>
  )
}

function SkillTag({ skill }: { skill: string }) {
  return (
    <Badge variant="outline" className="text-xs font-medium px-2 py-0.5">
      {skill}
    </Badge>
  )
}

export default function RequestCard({
  request,
  onApprove,
  onReject,
  onMarkAsRead,
}: {
  request: AlertRequest
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onMarkAsRead: (id: number) => void
}) {
  return (
    <Card className="border-muted p-5 shadow-sm transition hover:shadow-md">
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
        <Button size="sm" onClick={() => onApprove(request.id)}>
          Approve
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onReject(request.id)}>
          Reject
        </Button>
        {request.unread && (
          <Button size="sm" variant="outline" onClick={() => onMarkAsRead(request.id)}>
            Mark as Read
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

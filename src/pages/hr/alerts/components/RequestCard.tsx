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
}: {
  request: AlertRequest
}) {
  return (
    <Card className="rounded-2xl border border-muted bg-background shadow-sm hover:shadow-md transition-shadow pt-5 pb-5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {request.unread && (
              <Badge variant="destructive" className="text-xs px-2">
                New
              </Badge>
            )}
            <CardTitle className="text-xl font-semibold">
              {request.project}
            </CardTitle>
          </div>
          <PriorityBadge level={request.priority} />
        </div>
        <CardDescription className="mt-1 text-sm text-muted-foreground">
          Requested by <span className="font-medium">{request.requester}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {request.quantity}× {request.roleNeeded}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Required by <span className="font-medium">{request.dueDate}</span>
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {request.skills.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Justification:</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {request.justification}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3 pt-4">
        <Button size="sm">Approve</Button>
        <Button size="sm" variant="destructive">
          Reject
        </Button>
        <Button size="sm" variant="outline">
          Mark as Read
        </Button>
      </CardFooter>
    </Card>
  )
}
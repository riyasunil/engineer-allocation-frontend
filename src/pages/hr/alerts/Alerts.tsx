import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BadgeAlert,
  BellRing,
  CalendarClock,
  UserCircle2,
} from "lucide-react"

export type Priority = "high" | "medium" | "low"
export interface AlertRequest {
  id: number
  project: string
  requester: string
  roleNeeded: string
  quantity: number
  skills: string[]
  dueDate: string
  requestedDate: string
  priority: Priority
  justification: string
  unread: boolean
}

const requests: AlertRequest[] = [
  {
    id: 1,
    project: "E‑Commerce Platform",
    requester: "John Doe (Project Lead)",
    roleNeeded: "Frontend Developer",
    quantity: 2,
    skills: ["React", "TypeScript", "CSS"],
    dueDate: "Jul 1, 2024",
    requestedDate: "Jun 15, 2024",
    priority: "high",
    justification:
      "Need additional frontend developers to meet the deadline for the mobile‑responsive design implementation.",
    unread: true,
  },
  {
    id: 2,
    project: "Data Analytics Dashboard",
    requester: "Sarah Wilson (Project Manager)",
    roleNeeded: "DevOps Engineer",
    quantity: 1,
    skills: ["AWS", "Docker", "Kubernetes"],
    dueDate: "Jul 15, 2024",
    requestedDate: "Jun 14,2024",
    priority: "medium",
    justification:
      "Infrastructure scaling requirements have increased beyond current capacity.",
    unread: true,
  },
]

/** —————————————————————————————————————————————————————————— */
/** Helper components                                                     */
/** —————————————————————————————————————————————————————————— */


export default function Alerts() {
  const unreadTotal = requests.filter((r) => r.unread).length

  return (
    <section className="space-y-8">
      {/* Page header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Alerts</h1>
          <p className="text-muted-foreground">
            Manage engineer requests from project leads
          </p>
        </div>

        <Button
          size="sm"
          variant="destructive"
          className="flex items-center gap-2"
        >
          <BadgeAlert className="h-4 w-4" />
          {unreadTotal}&nbsp;New
        </Button>
      </header>

      <Separator />

      {/* Pending requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Pending Requests
          <Badge variant="secondary">{unreadTotal}</Badge>
        </h2>

        <div className="space-y-6">
          {requests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </div>

      {/* Stub for “Recent Processed Requests” (optional) */}
      {/* <Separator className="my-8" /> */}
    </section>
  )
}

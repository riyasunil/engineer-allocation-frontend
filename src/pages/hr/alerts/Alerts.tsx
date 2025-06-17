import { useState } from "react";
import RequestCard from "./components/RequestCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgeAlert } from "lucide-react";

export interface ProcessedRequest {
  id: number;
  project: string;
  description: string;
  status: "Approved" | "Rejected";
  date: string;
}

export type Priority = "high" | "medium" | "low";

export interface AlertRequest {
  id: number;
  project: string;
  requester: string;
  roleNeeded: string;
  quantity: number;
  skills: string[];
  dueDate: string;
  requestedDate: string;
  priority: Priority;
  justification: string;
  unread: boolean;
}

export default function Alerts() {
  const [requests, setRequests] = useState<AlertRequest[]>([
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
      requestedDate: "Jun 14, 2024",
      priority: "medium",
      justification:
        "Infrastructure scaling requirements have increased beyond current capacity.",
      unread: true,
    },
  ]);

  const [processed, setProcessed] = useState<ProcessedRequest[]>([]);

  const handleApprove = (id: number) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      setProcessed((prev) => [
        ...prev,
        {
          id: req.id,
          project: req.project,
          description: `${req.quantity}x ${req.roleNeeded} - ${req.requester}`,
          status: "Approved",
          date: new Date().toDateString(),
        },
      ]);
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleMarkAsRead = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, unread: false } : r))
    );
  };

  const unreadTotal = requests.filter((r) => r.unread).length;

  return (
    <section className="space-y-8">
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
          {unreadTotal} New
        </Button>
      </header>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Pending Requests
          <Badge variant="secondary">{unreadTotal}</Badge>
        </h2>
        <div className="space-y-6">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onApprove={handleApprove}
              onReject={handleReject}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      </div>

      <Separator className="my-8" />
      <div className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold mb-4">
          Recent Processed Requests
        </h2>
        <div className="space-y-3">
          {processed.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center rounded-md border px-4 py-3 bg-muted"
            >
              <div>
                <div className="font-semibold">{entry.project}</div>
                <p className="text-sm text-muted-foreground">
                  {entry.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="default">{entry.status}</Badge>
                <span className="text-xs text-muted-foreground">
                  {entry.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

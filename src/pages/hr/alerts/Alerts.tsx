import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertRequest } from "@/utils/types"; // If you prefer, you can move interfaces to a separate file

export default function Notifications() {
  const [unread, setUnread] = useState<AlertRequest[]>([
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

  const [read, setRead] = useState<AlertRequest[]>([]);

  const markAsRead = (id: number) => {
    const notification = unread.find((r) => r.id === id);
    if (!notification) return;
    setUnread((prev) => prev.filter((r) => r.id !== id));
    setRead((prev) => [...prev, { ...notification, unread: false }]);
  };

  return (
    <section className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Engineer requests & system alerts</p>
      </header>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Unread Notifications</h2>
          <Separator />
          {unread.length === 0 ? (
            <p className="text-muted-foreground mt-3">No unread notifications</p>
          ) : (
            <ul className="space-y-4 mt-4">
              {unread.map((n) => (
                <li
                  key={n.id}
                  className="p-4 border rounded-lg bg-muted flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{n.project}</div>
                    <Button size="sm" onClick={() => markAsRead(n.id)}>
                      Mark as Read
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>{n.requester}</strong> requested{" "}
                      <strong>{n.quantity}x {n.roleNeeded}</strong> by{" "}
                      <span>{n.dueDate}</span>.
                    </p>
                    <p>Justification: {n.justification}</p>
                    <p className="text-xs mt-1">Requested on {n.requestedDate}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Read Notifications</h2>
          <Separator />
          {read.length === 0 ? (
            <p className="text-muted-foreground mt-3">No read notifications</p>
          ) : (
            <ul className="space-y-4 mt-4">
              {read.map((n) => (
                <li
                  key={n.id}
                  className="p-4 border rounded-lg bg-muted/50"
                >
                  <div className="font-semibold">{n.project}</div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>{n.requester}</strong> requested{" "}
                      <strong>{n.quantity}x {n.roleNeeded}</strong> by{" "}
                      <span>{n.dueDate}</span>.
                    </p>
                    <p>Justification: {n.justification}</p>
                    <p className="text-xs mt-1">Requested on {n.requestedDate}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

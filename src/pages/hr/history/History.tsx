import { Button } from "@/components/ui/button";
import { HistoryIcon, User } from "lucide-react";
import React, { useState } from "react";
import RequestCard from "./components/RequestCard";
import { SearchFilterBar } from "@/components/ui/searchFilterBar";

export interface AuditLog {
  id: number;
  actor_user_id: number;
  action_type: string;
  timestamp: Date;
  change_summary: string;
}

const users = [
  { id: 1, name: "Ria Sunil" },
  { id: 2, name: "Hritik Koshi" },
];

const logs: AuditLog[] = [
  {
    id: 1,
    actor_user_id: 1,
    action_type: "Project Created",
    timestamp: new Date("2025-03-12T10:15:00"),
    change_summary: "Created project: E‑Commerce Platform",
  },
  {
    id: 2,
    actor_user_id: 2,
    action_type: "Employee Assigned",
    timestamp: new Date("2025-03-13T09:00:00"),
    change_summary: "Assigned Riya Sunil to E‑Commerce Platform",
  },
  {
    id: 3,
    actor_user_id: 1,
    action_type: "Project Updated",
    timestamp: new Date("2025-03-14T14:45:00"),
    change_summary: "Updated deadline for Healthcare CRM to 30th March",
  },
  {
    id: 4,
    actor_user_id: 2,
    action_type: "Employee Unassigned",
    timestamp: new Date("2025-03-15T11:30:00"),
    change_summary: "Removed Hritik Koshi from Inventory Dashboard project",
  },
];

const History = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
  
    "ALL" | "Project Created" | "Employee Assigned" | "Project Updated" | "Employee Unassigned"
  >("ALL");

  const filteredlogs = logs.filter((log) => {
      const actorName = users.find((u) => u.id === log.actor_user_id)?.name || "";
    const matchesSearch = 
    log.action_type.toLowerCase().includes(search.toLowerCase()) ||
    log.change_summary.toLowerCase().includes(search.toLowerCase()) ||
    actorName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "ALL" || log.action_type === filter;
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">System History</h1>
          <p className="text-muted-foreground">
            Audit log of all system operations and changes
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 text-black rounded-xl"
        >
          <HistoryIcon className="h-4 w-4" />
          {logs.length}&nbsp;Records
        </Button>
      </header>

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={filter}
        onFilterChange={(val) => setFilter(val as typeof filter)}
        filterOptions={[
          { value: "ALL", label: "All" },
          { value: "Project Created", label: "Project Created" },
          { value: "Employee Assigned", label: "Employee Assigned" },
          { value: "Project Updated", label: "Project Updated" },
          { value: "Employee Unassigned", label: "Employee Unassigned" },
        ]}
      />

      {/* Audit logs */}
      <div className="space-y-4 border border-muted p-4 rounded-md">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Audit Log
        </h2>

        <div className="space-y-6">
          {filteredlogs.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;

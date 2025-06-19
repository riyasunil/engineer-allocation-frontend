import { Button } from "@/components/ui/button";
import { HistoryIcon, User } from "lucide-react";
import React, { useState } from "react";

import { SearchFilterBar } from "@/components/ui/searchFilterBar";
import { useGetAllLogsQuery } from "@/api-service/auditlogs/auditlogs.api";
import { useGetUserByIdQuery } from "@/api-service/user/user.api";
import RequestCard from "./components/HistoryRequestCard";


export interface AuditLog {
  id: number;
  actor_user_id: string;
  action_type: string;
  timestamp: Date;
  change_summary: string;
}

const History = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    | "ALL"
    | "Project Created"
    | "Employee Assigned"
    | "Project Updated"
    | "Employee Unassigned"
  >("ALL");

  const { data: logs } = useGetAllLogsQuery();

  console.log(logs?.data);

  // const actorName = "ria";

  const filteredlogs = logs?.data?.filter((log) => {
    // const {data : actorName} = useGetUserByIdQuery(log.actor_user_id)

    const matchesSearch =
      log.action_type.toLowerCase().includes(search.toLowerCase()) ||
      log.change_summary.toLowerCase().includes(search.toLowerCase());
    // actorName.toLowerCase().includes(search.toLowerCase());

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
          {logs ? logs?.data.length : 0}&nbsp;Records
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
          {filteredlogs &&
            filteredlogs.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default History;

import React from "react";
import { useGetAdditionalRequestsQuery } from "@/api-service/projects/projects.api";
import RequestCard from "./components/RequestCard";

const Alerts = () => {
  const { data, isLoading, error } = useGetAdditionalRequestsQuery();
  const alerts = data?.data ?? [];

  return (
    <div className="px-6 py-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">HR Alerts</h1>

      {isLoading && (
        <div className="text-gray-600 dark:text-gray-300">Loading alerts...</div>
      )}

      {error && (
        <div className="text-red-500 dark:text-red-400">Error loading alerts</div>
      )}

      {!isLoading && !error && alerts.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400">No pending HR requests.</div>
      )}

      <div className="space-y-4">
        {alerts.map((req) => (
          <RequestCard
            key={req.id}
            request={{
              id: req.id!,
              project: req.project.name,
              skill: req.requirementSkills?.map((s) => s.skill.skill_name).join(", ") || "N/A",
              reason: `Need ${req.required_count} ${req.designation.name}(s)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Alerts;

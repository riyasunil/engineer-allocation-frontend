// Alerts.tsx
import React from "react";
import { useGetAdditionalRequestsQuery } from "@/api-service/projects/projects.api";
import RequestCard from "./components/RequestCard";
// import RequestCard from "./components/RequestCard";

const Alerts = () => {
  const { data, isLoading, error } = useGetAdditionalRequestsQuery();

  console.log("Alerts API data:", data); // Keep for debugging

  if (isLoading) return <div>Loading alerts...</div>;
  if (error) return <div>Error loading alerts</div>;

  const alerts = data?.data ? data.data : []

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Alerts</h1>
      {alerts.length === 0 ? (
        <div>No pending HR requests.</div>
      ) : (
        alerts.map((req) => (
          <RequestCard
            key={req.id}
            request={{
              id: req.id!,
              project: req.project.name,
              skill: req.requirementSkills?.map(s => s.skill.skill_name).join(", ") || "N/A",
              reason: `Need ${req.required_count} ${req.designation.name}(s)`,
              status: "Pending HR Approval"
            }}
          />
        ))
      )}
    </div>
  );
};

export default Alerts;
import React from "react";

export interface ProcessedRequest {
  id: number;
  project: string;
  skill: string;
  experience?: number;
  reason: string;
  status?: string;
}


const RequestCard = ({ request }: { request: ProcessedRequest }) => {
  return (
    <div className="p-4 border rounded-xl shadow bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">{request.project}</h2>
      <p><strong>Skill(s):</strong> {request.skill}</p>
      {request.experience !== undefined && (
        <p><strong>Experience:</strong> {request.experience} years</p>
      )}
      <p><strong>Reason:</strong> {request.reason}</p>
      {request.status && (
        <p><strong>Status:</strong> {request.status}</p>
      )}
    </div>
  );
};

export default RequestCard;

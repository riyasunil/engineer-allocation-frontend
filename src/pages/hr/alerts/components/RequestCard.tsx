import React from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ProcessedRequest {
  id: number;
  project: string;
  projectId: number; // Add projectId to the interface
  skill: string;
  experience?: number;
  reason: string;
}

const RequestCard = ({ request }: { request: ProcessedRequest }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/hr/projects/${request.projectId}`);
  };

  return (
    <div 
      className="w-full p-5 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition space-y-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <Briefcase className="text-blue-600 dark:text-blue-300" size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {request.project}
        </h2>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <p>
          <span className="font-medium text-gray-900 dark:text-white">Skill(s):</span>{" "}
          {request.skill}
        </p>
        {request.experience !== undefined && (
          <p>
            <span className="font-medium text-gray-900 dark:text-white">Experience:</span>{" "}
            {request.experience} years
          </p>
        )}
        <p>
          <span className="font-medium text-gray-900 dark:text-white">Reason:</span>{" "}
          {request.reason}
        </p>
      </div>
    </div>
  );
};

export default RequestCard;
import React from "react";
import { MapPin, Code, Star } from "lucide-react";

interface Engineer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  currentProjects: number;
  maxProjects: number;
  isAvailable: boolean;
  strengths: string[];
  initials: string;
  avatarColor: string;
}

interface EngineerCardProps {
  engineer: Engineer;
  onClick: () => void;
}

const EngineerCard = ({ engineer, onClick }: EngineerCardProps) => {
  const getAvailabilityColor = () => {
    if (engineer.currentProjects === 0)
      return "bg-green-100 text-green-800 border-green-200";
    if (engineer.currentProjects === 1)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getAvailabilityText = () => {
    if (engineer.currentProjects === 0) return "Available";
    if (engineer.currentProjects === 1) return "Partially Available";
    return "Fully Allocated";
  };

  return (
    <div
      className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header with Avatar and Availability Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold text-sm" style={{ backgroundColor: engineer.avatarColor }}>
            {engineer.initials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {engineer.name}
            </h3>
            <p className="text-sm text-muted-foreground">{engineer.email}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor()}`}
        >
          {getAvailabilityText()}
        </span>
      </div>

      {/* Experience and Projects Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{engineer.experience} experience</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Code className="h-4 w-4 mr-2" />
          <span>
            {engineer.currentProjects}/{engineer.maxProjects} Projects
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {engineer.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
          >
            {skill}
          </span>
        ))}
        {engineer.skills.length > 3 && (
          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
            +{engineer.skills.length - 3} more
          </span>
        )}
      </div>

      {/* Strengths */}
      {engineer.strengths.length > 0 && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Star className="h-3 w-3 mr-1" />
          <span>Strengths: {engineer.strengths.slice(0, 2).join(", ")}</span>
        </div>
      )}
    </div>
  );
};

export default EngineerCard;
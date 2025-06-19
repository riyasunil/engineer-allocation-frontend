import { useNavigate } from "react-router-dom";
import { Calendar, Users, AlertTriangle, CheckCircle } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  requiredEngineers: number;
  assignedEngineers: number;
  // techStack: string[];
  isOverStaffed: boolean;
  isUnderStaffed: boolean;
  nearingCompletion: boolean;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hr/projects/${project.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN PROGRESS":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div
      className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {project.name}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            project.status
          )}`}
        >
          {formatStatus(project.status)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{project.duration}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          <span>
            {project.assignedEngineers}/{project.requiredEngineers} Engineers
          </span>
        </div>
      </div>

      {/* <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 3 && (
          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
            +{project.techStack.length - 3} more
          </span>
        )}
      </div> */}

      <div className="flex flex-wrap gap-2">
        {project.nearingCompletion && (
          <div className="flex items-center text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Nearing completion
          </div>
        )}
        {project.isUnderStaffed && (
          <div className="flex items-center text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Under-staffed
          </div>
        )}
        {project.isOverStaffed && (
          <div className="flex items-center text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
            <CheckCircle className="h-3 w-3 mr-1" />
            Over-staffed
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

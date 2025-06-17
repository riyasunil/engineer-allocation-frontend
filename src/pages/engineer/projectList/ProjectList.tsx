import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/pageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock4, CheckCircle } from "lucide-react";

const projectList = {
  current: [
    {
      id: "1",
      title: "E-Commerce Platform",
      role: "Lead",
      status: "IN_PROGRESS",
      description: "Building a comprehensive e-commerce platform with modern tech stack",
      startDate: "Jan 15, 2024",
      duration: "17 months, 10 days",
      teamSize: 5,
      tags: ["React", "Node.js", "PostgreSQL", "AWS"],
      labels: ["IN_PROGRESS"],
    },
    {
      id: "2",
      title: "Mobile App Backend",
      role: "Developer",
      status: "IN_PROGRESS",
      description: "Developing REST APIs for mobile application",
      startDate: "Feb 1, 2024",
      duration: "16 months, 23 days",
      teamSize: 3,
      tags: ["Node.js", "Express", "MongoDB"],
      labels: ["IN_PROGRESS", "Shadow"],
    },
  ],
  past: [
    {
      id: "3",
      title: "CRM System",
      role: "Developer",
      status: "COMPLETED",
      description: "Customer relationship management system for sales team",
      startDate: "Aug 1, 2023 - Dec 15, 2023",
      duration: "4 months, 16 days",
      teamSize: 4,
      tags: ["React", "Django", "PostgreSQL"],
    },
    {
      id: "4",
      title: "Analytics Dashboard",
      role: "Lead",
      status: "COMPLETED",
      description: "Real-time analytics dashboard with data visualization",
      startDate: "May 1, 2023 - Jul 30, 2023",
      duration: "3 months",
      teamSize: 3,
      tags: ["Next.js", "Chart.js", "MySQL"],
    },
  ],
};

const StatusBadge = ({ label }: { label: string }) => {
  const base = "text-xs px-2 py-0.5 rounded-full";
  switch (label) {
    case "IN_PROGRESS":
      return <span className={`${base} bg-green-100 text-green-800`}>IN PROGRESS</span>;
    case "COMPLETED":
      return <span className={`${base} bg-gray-100 text-gray-800`}>✓ Completed</span>;
    case "Shadow":
      return <span className={`${base} bg-muted text-muted-foreground`}>Shadow</span>;
    default:
      return <span className={`${base} bg-slate-200 text-slate-700`}>{label}</span>;
  }
};

const ProjectList = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Projects"
        description="View and manage your current and past projects"
      />

      {/* Status Overview */}
      <div className="flex justify-end gap-6 pr-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock4 className="w-4 h-4 text-green-600" />
          <span>{projectList.current.length} Active</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-gray-500" />
          <span>{projectList.past.length} Completed</span>
        </div>
      </div>

      {/* Current Projects */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Current Projects</h2>
          {projectList.current.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 space-y-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary">{project.role}</Badge>
                    {project.labels?.map((label) => (
                      <StatusBadge key={label} label={label} />
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Started:</strong> {project.startDate}{" "}
                  <span className="ml-4">
                    <strong>Duration:</strong> {project.duration}
                  </span>{" "}
                  <span className="ml-4">
                    <strong>Team:</strong> {project.teamSize} members
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-muted px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Projects */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Past Projects</h2>
          {projectList.past.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 space-y-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary">{project.role}</Badge>
                    <StatusBadge label="COMPLETED" />
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Duration:</strong> {project.duration}{" "}
                  <span className="ml-4">
                    <strong>Team:</strong> {project.teamSize} members
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-muted px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectList;

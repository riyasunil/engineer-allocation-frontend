import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
interface Project {
  id: string;
  name: string;
  status: string;
  completion: number;
  budget: number;
  spent: number;
  timeline: string;
  teamSize: number;
}

interface ProjectStatusData {
  name: string;
  value: number;
  color: string;
}

interface ProjectTrendsData {
  month: string;
  completed: number;
  started: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color?: string;
}

interface ProjectAnalyticsProps {
  selectedProject: string;
  setSelectedProject: (value: string) => void;
}

// Project data
const projects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    status: "In Progress",
    completion: 75,
    budget: 150000,
    spent: 112500,
    timeline: "On Track",
    teamSize: 8,
  },
  {
    id: "2",
    name: "Mobile Banking App",
    status: "Completed",
    completion: 100,
    budget: 200000,
    spent: 195000,
    timeline: "Completed Early",
    teamSize: 12,
  },
  {
    id: "3",
    name: "CRM System",
    status: "Planning",
    completion: 10,
    budget: 100000,
    spent: 15000,
    timeline: "Planning Phase",
    teamSize: 6,
  },
];

const projectStatusData: ProjectStatusData[] = [
  { name: "Completed", value: 25, color: "#22c55e" },
  { name: "In Progress", value: 15, color: "#3b82f6" },
  { name: "Planning", value: 8, color: "#f59e0b" },
  { name: "On Hold", value: 3, color: "#ef4444" },
];

const projectTrendsData: ProjectTrendsData[] = [
  { month: "Jan", completed: 4, started: 6 },
  { month: "Feb", completed: 6, started: 8 },
  { month: "Mar", completed: 5, started: 7 },
  { month: "Apr", completed: 8, started: 9 },
  { month: "May", completed: 7, started: 5 },
  { month: "Jun", completed: 9, started: 8 },
];

// Reusable StatCard component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color = "text-foreground",
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
  selectedProject,
  setSelectedProject,
}) => {
  const selectedData = projects.find((p) => p.id === selectedProject);

  return (
    <div className="space-y-6">
      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Project Overview
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
      </Card>

      {selectedProject === "all" ? (
        // Overall Analytics
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Project Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Project Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="completed" fill="#22c55e" />
                    <Bar dataKey="started" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Specific Project Analytics
        selectedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Project Status"
              value={selectedData.status}
              subtitle={`${selectedData.completion}% Complete`}
              color="text-primary"
            />
            <StatCard
              title="Budget Status"
              value={`$${selectedData.spent.toLocaleString()}`}
              subtitle={`of $${selectedData.budget.toLocaleString()} budget`}
              color="text-green-600"
            />
            <StatCard
              title="Timeline"
              value={selectedData.timeline}
              subtitle="Current status"
              color="text-blue-600"
            />
            <StatCard
              title="Team Size"
              value={selectedData.teamSize}
              subtitle="Engineers assigned"
              color="text-purple-600"
            />
          </div>
        )
      )}
    </div>
  );
};

export default ProjectAnalytics;

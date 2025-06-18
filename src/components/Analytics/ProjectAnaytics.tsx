import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllProjectsQuery } from "@/api-service/projects/projects.api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function ProjectAnalytics() {
  const { data: projects = [], isLoading, error } = useGetAllProjectsQuery();
  const [selectedProject, setSelectedProject] = useState("all");

  const transformedProjects = projects.map((project) => {
    const assignedEngineers = project.projectUsers?.length || 0;
    const requiredEngineers =
      project.requirements?.reduce(
        (sum, req) => sum + (req.required_count || 1),
        0
      ) || 0;

    const duration =
      project.startdate && project.enddate
        ? Math.ceil(
            (new Date(project.enddate).getTime() -
              new Date(project.startdate).getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        : 0;

    return {
      id: project.project_id,
      name: project.name,
      status: project.status || "NEW",
      completion: 0,
      timeline: "N/A",
      teamSize: assignedEngineers,
      duration: duration.toString(),
      requiredEngineers,
      assignedEngineers,
    };
  });

  const selectedProjectData = transformedProjects.find(
    (p) => p.id === selectedProject
  );

  const totalProjects = transformedProjects.length;
  const successRate = "92%";
  const avgDuration =
    transformedProjects.length > 0
      ? (
          transformedProjects.reduce(
            (sum, p) => sum + parseInt(p.duration || "0"),
            0
          ) / transformedProjects.length
        ).toFixed(1)
      : "0.0";

  const statusCounts: Record<string, number> = {};
  transformedProjects.forEach((p) => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });

  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status,
    value,
    color:
      status === "CLOSED"
        ? "#22c55e"
        : status === "IN_PROGRESS"
        ? "#3b82f6"
        : status === "NEW"
        ? "#f59e0b"
        : "#ef4444",
  }));

  const barData = [
    { month: "Jan", completed: 4, started: 6 },
    { month: "Feb", completed: 6, started: 8 },
    { month: "Mar", completed: 5, started: 7 },
    { month: "Apr", completed: 8, started: 9 },
    { month: "May", completed: 7, started: 5 },
    { month: "Jun", completed: 9, started: 8 },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Error loading projects. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                {transformedProjects.map((project) => (
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-sm text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {successRate}
                </div>
                <p className="text-sm text-muted-foreground">
                  Completed on time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDuration}</div>
                <p className="text-sm text-muted-foreground">
                  Months per project
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completed" fill="#22c55e" />
                      <Bar dataKey="started" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        selectedProjectData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {selectedProjectData.status}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedProjectData.completion}% Complete
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Team Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {selectedProjectData.teamSize}
                </div>
                <p className="text-sm text-muted-foreground">
                  Engineers assigned
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Required Engineers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {selectedProjectData.requiredEngineers}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on requirements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {selectedProjectData.timeline}
                </div>
                <p className="text-sm text-muted-foreground">Schedule health</p>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}

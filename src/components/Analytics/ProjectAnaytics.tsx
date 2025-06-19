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

    // Calculate staffing percentage
    const staffingPercentage =
      requiredEngineers > 0
        ? Math.round((assignedEngineers / requiredEngineers) * 100)
        : assignedEngineers > 0
        ? 100
        : 0;

    return {
      id: project.project_id,
      name: project.name,
      status: project.status || "New",
      staffingPercentage,
      teamSize: assignedEngineers,
      duration: duration.toString(),
      requiredEngineers,
      assignedEngineers,
      startDate: project.startdate,
      endDate: project.enddate,
    };
  });

  const selectedProjectData = transformedProjects.find(
    (p) => p.id === selectedProject
  );

  // Calculate actual metrics from data
  const totalProjects = transformedProjects.length;

  // Calculate success rate based on completed projects that are fully staffed
  const fullyStaffedProjects = transformedProjects.filter(
    (p) => p.staffingPercentage >= 100
  );
  const successRate =
    totalProjects > 0
      ? Math.round((fullyStaffedProjects.length / totalProjects) * 100) + "%"
      : "0%";

  // Calculate average duration from projects with dates
  const projectsWithDuration = transformedProjects.filter(
    (p) => parseInt(p.duration) > 0
  );
  const avgDuration =
    projectsWithDuration.length > 0
      ? (
          projectsWithDuration.reduce(
            (sum, p) => sum + parseInt(p.duration),
            0
          ) / projectsWithDuration.length
        ).toFixed(1)
      : "0.0";

  // Calculate average team size
  const avgTeamSize =
    totalProjects > 0
      ? (
          transformedProjects.reduce((sum, p) => sum + p.teamSize, 0) /
          totalProjects
        ).toFixed(1)
      : "0.0";

  // Status distribution for pie chart
  const statusCounts: Record<string, number> = {};
  transformedProjects.forEach((p) => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });

  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status,
    value,
    color:
      status === "Completed"
        ? "#34D399" // Soft Green (CLOSED)
        : status === "Active"
        ? "#60A5FA" // Soft Blue (IN_PROGRESS)
        : status === "New"
        ? "#FBBF24" // Golden Yellow (NEW)
        : "#F87171", // Soft Red (Default/Other)
  }));
  
  

  // Create monthly project data based on start dates
  const monthlyData = transformedProjects.reduce((acc, project) => {
    if (project.startDate) {
      const month = new Date(project.startDate).toLocaleDateString("en-US", {
        month: "short",
      });
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.started += 1;
        if (project.status === "Completed") {
          existing.completed += 1;
        }
      } else {
        acc.push({
          month,
          started: 1,
          completed: project.status === "Completed" ? 1 : 0,
        });
      }
    }
    return acc;
  }, [] as Array<{ month: string; started: number; completed: number }>);

  // If no date-based data, create summary data
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const sortedMonthlyData = monthlyData.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );

  const barData =
    sortedMonthlyData.length > 0
      ? sortedMonthlyData
      : [
          {
            month: "Overall",
            started: transformedProjects.length,
            completed: transformedProjects.filter((p) => p.status === "Closed")
              .length,
          },
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
                <CardTitle>Project Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="completed"
                        fill="#22c55e"
                        name="Completed"
                      />
                      <Bar dataKey="started" fill="#3b82f6" name="Started" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

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
                <CardTitle className="text-sm">Staffing Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {successRate}
                </div>
                <p className="text-sm text-muted-foreground">
                  Fully staffed projects
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

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Team Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {avgTeamSize}
                </div>
                <p className="text-sm text-muted-foreground">
                  Engineers per project
                </p>
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
                <p className="text-sm text-muted-foreground">Current status</p>
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
                <CardTitle className="text-sm">Staffing Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    selectedProjectData.staffingPercentage >= 100
                      ? "text-green-600"
                      : selectedProjectData.staffingPercentage >= 75
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedProjectData.staffingPercentage}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Staffing percentage
                </p>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}

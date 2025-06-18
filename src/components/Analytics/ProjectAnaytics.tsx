import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// Mock project data
const projectsOverview = [
  { name: "Completed", value: 25, color: "#22c55e" },
  { name: "In Progress", value: 15, color: "#3b82f6" },
  { name: "Planning", value: 8, color: "#f59e0b" },
  { name: "On Hold", value: 3, color: "#ef4444" },
];

const projects = [
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

const chartConfig = {
  completed: { label: "Completed", color: "#22c55e" },
  inProgress: { label: "In Progress", color: "#3b82f6" },
  planning: { label: "Planning", color: "#f59e0b" },
  onHold: { label: "On Hold", color: "#ef4444" },
};

const ProjectAnalytics = () => {
  const [selectedProject, setSelectedProject] = useState("all");

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  const projectPerformanceData = [
    { month: "Jan", completed: 4, started: 6 },
    { month: "Feb", completed: 6, started: 8 },
    { month: "Mar", completed: 5, started: 7 },
    { month: "Apr", completed: 8, started: 9 },
    { month: "May", completed: 7, started: 5 },
    { month: "Jun", completed: 9, started: 8 },
  ];

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
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectsOverview}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {projectsOverview.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Project Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Project Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "#22c55e" },
                  started: { label: "Started", color: "#3b82f6" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectPerformanceData}>
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
      ) : (
        // Specific Project Analytics
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
                <CardTitle className="text-sm">Budget Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${selectedProjectData.spent.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  of ${selectedProjectData.budget.toLocaleString()} budget
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
          </div>
        )
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">51</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-sm text-muted-foreground">Completed on time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-sm text-muted-foreground">Months per project</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-sm text-muted-foreground">Allocated this year</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectAnalytics;

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";

// Mock engineer data
const engineers = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Frontend Developer",
    projectsCompleted: 12,
    currentProjects: 2,
    efficiency: 95,
    skills: ["React", "TypeScript", "Node.js"],
    performance: "Excellent",
  },
  {
    id: "2",
    name: "Mike Chen",
    role: "Backend Developer",
    projectsCompleted: 8,
    currentProjects: 3,
    efficiency: 87,
    skills: ["Python", "PostgreSQL", "Docker"],
    performance: "Good",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    projectsCompleted: 15,
    currentProjects: 1,
    efficiency: 92,
    skills: ["Vue.js", "Laravel", "MySQL"],
    performance: "Excellent",
  },
];

const skillDistribution = [
  { skill: "React", count: 15 },
  { skill: "Node.js", count: 12 },
  { skill: "Python", count: 10 },
  { skill: "TypeScript", count: 14 },
  { skill: "PostgreSQL", count: 8 },
  { skill: "Docker", count: 9 },
];

const performanceData = [
  { month: "Jan", efficiency: 88, projects: 5 },
  { month: "Feb", efficiency: 92, projects: 7 },
  { month: "Mar", efficiency: 89, projects: 6 },
  { month: "Apr", efficiency: 94, projects: 8 },
  { month: "May", efficiency: 91, projects: 7 },
  { month: "Jun", efficiency: 95, projects: 9 },
];

const chartConfig = {
  efficiency: { label: "Efficiency %", color: "#3b82f6" },
  projects: { label: "Projects Completed", color: "#22c55e" },
  count: { label: "Engineers", color: "#8b5cf6" },
};

const EngineerAnalytics = () => {
  const [selectedEngineer, setSelectedEngineer] = useState("all");

  const selectedEngineerData = engineers.find((e) => e.id === selectedEngineer);

  return (
    <div className="space-y-6">
      {/* Engineer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Engineer Overview
            <Select
              value={selectedEngineer}
              onValueChange={setSelectedEngineer}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select an engineer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Engineers</SelectItem>
                {engineers.map((engineer) => (
                  <SelectItem key={engineer.id} value={engineer.id}>
                    {engineer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
      </Card>

      {selectedEngineer === "all" ? (
        // Overall Engineer Analytics
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="projects"
                        stroke="#22c55e"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Engineers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">
                  Active team members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">91%</div>
                <p className="text-sm text-muted-foreground">
                  Team performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Projects per Engineer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.1</div>
                <p className="text-sm text-muted-foreground">
                  Average workload
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Skill Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-sm text-muted-foreground">
                  Technology requirements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Engineer List */}
          <Card>
            <CardHeader>
              <CardTitle>Engineer Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engineers.map((engineer) => (
                  <div
                    key={engineer.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{engineer.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {engineer.role}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {engineer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">
                          {engineer.projectsCompleted}
                        </span>{" "}
                        projects completed
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          {engineer.efficiency}%
                        </span>{" "}
                        efficiency
                      </div>
                      <Badge
                        variant={
                          engineer.performance === "Excellent"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {engineer.performance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Specific Engineer Analytics
        selectedEngineerData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Projects Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedEngineerData.projectsCompleted}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Current Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedEngineerData.currentProjects}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Active assignments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Efficiency Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedEngineerData.efficiency}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Performance score
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedEngineerData.performance}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overall rating
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedEngineerData.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
};

export default EngineerAnalytics;

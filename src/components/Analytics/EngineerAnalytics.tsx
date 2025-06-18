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
import { useGetEngineersQuery } from "@/api-service/user/user.api";

// Configuration for charts including labels and colors
const chartConfig = {
  efficiency: { label: "Efficiency %", color: "#3b82f6" },
  projects: { label: "Projects Completed", color: "#22c55e" },
  count: { label: "Engineers", color: "#8b5cf6" },
};

const EngineerAnalytics = () => {
  const [selectedEngineer, setSelectedEngineer] = useState("all");
  const { data: engineersData = [] } = useGetEngineersQuery();

  // Transforming API data into local state shape
  const engineers = engineersData
    .filter((user) => user.role.role_name === "ENGINEER")
    .map((user) => ({
      id: user.user_id,
      name: user.name,
      role: user.designations?.[0]?.designation?.name || "Engineer",
      projectsCompleted: user.projectUsers?.length || 0,
      currentProjects: user.projectUsers?.length || 0,
      efficiency: 90, // hardcoded
      skills: user.userSkills?.map((s) => s.skill.skill_name) || [],
      performance: "Good", // hardcoded
    }));

  // Finding the selected engineer for individual view
  const selectedEngineerData = engineers.find((e) => e.id === selectedEngineer);

  // Calculating skill distribution from engineers' skill lists
  const skillCount: Record<string, number> = {};
  engineers.forEach((e) => {
    e.skills.forEach((s) => {
      skillCount[s] = (skillCount[s] || 0) + 1;
    });
  });

  const skillDistribution = Object.entries(skillCount).map(
    ([skill, count]) => ({
      skill,
      count,
    })
  );

  // Dummy data for line chart representing team performance trends
  const performanceData = [
    { month: "Jan", efficiency: 88, projects: 5 },
    { month: "Feb", efficiency: 92, projects: 7 },
    { month: "Mar", efficiency: 89, projects: 6 },
    { month: "Apr", efficiency: 94, projects: 8 },
    { month: "May", efficiency: 91, projects: 7 },
    { month: "Jun", efficiency: 95, projects: 9 },
  ];

  // Calculated stats for summary section
  const totalEngineers = engineers.length;
  const averageEfficiency = "90%"; // hardcoded
  const avgProjects = (
    engineers.reduce((acc, e) => acc + e.projectsCompleted, 0) /
    (engineers.length || 1)
  ).toFixed(1);
  const skillCoverage = skillDistribution.length > 0 ? "89%" : "0%";

  return (
    <div className="space-y-6">
      {/* Dropdown to select an individual engineer or all */}
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

      {/* Conditional UI for all engineers or specific engineer */}
      {selectedEngineer === "all" ? (
        <div className="space-y-6">
          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart for skill distribution */}
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

            {/* Line chart for performance over time */}
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

          {/* Summary statistics section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Engineers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEngineers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {averageEfficiency}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Projects per Engineer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgProjects}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Skill Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{skillCoverage}</div>
              </CardContent>
            </Card>
          </div>

          {/* List of engineers with brief stats */}
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
                      <Badge variant="secondary">{engineer.performance}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        selectedEngineerData && (
          <div className="space-y-6">
            {/* Detailed view for selected engineer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Projects Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedEngineerData.projectsCompleted}
                  </div>
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
                </CardContent>
              </Card>
            </div>
            {/* List of skills for the engineer */}
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

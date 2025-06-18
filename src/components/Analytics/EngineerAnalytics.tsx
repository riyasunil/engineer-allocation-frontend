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
  utilization: { label: "Utilization %", color: "#3b82f6" },
  projects: { label: "Projects", color: "#22c55e" },
  count: { label: "Engineers", color: "#8b5cf6" },
};

const EngineerAnalytics = () => {
  const [selectedEngineer, setSelectedEngineer] = useState("all");
  const { data: engineersData = [] } = useGetEngineersQuery();

  // Transform API data with calculated metrics
  const engineers = engineersData
    .filter((user) => user.role.role_name === "ENGINEER")
    .map((user) => {
      const totalProjects = user.projectUsers?.length || 0;
      const activeProjects = user.projectUsers?.filter(pu => !pu.end_date)?.length || 0;
      const completedProjects = user.projectUsers?.filter(pu => pu.end_date)?.length || 0;
      
      // Calculate experience-based performance rating
      const experience = user.experience || 0;
      let performanceRating = "New";
      let utilizationScore = 0;
      
      if (experience >= 5) {
        performanceRating = "Expert";
        utilizationScore = Math.min(90 + (activeProjects * 5), 100);
      } else if (experience >= 3) {
        performanceRating = "Senior";
        utilizationScore = Math.min(80 + (activeProjects * 7), 95);
      } else if (experience >= 1) {
        performanceRating = "Intermediate";
        utilizationScore = Math.min(70 + (activeProjects * 10), 90);
      } else {
        performanceRating = "Junior";
        utilizationScore = Math.min(60 + (activeProjects * 15), 85);
      }

      return {
        id: user.user_id,
        name: user.name,
        role: user.designations?.[0]?.designation?.name || "ENGINEER",
        totalProjects,
        activeProjects,
        completedProjects,
        utilization: utilizationScore,
        skills: user.userSkills?.map((s) => s.skill.skill_name) || [],
        experience: experience,
        performance: performanceRating,
        joinedAt: user.joined_at,
      };
    });

  const selectedEngineerData = engineers.find((e) => e.id === selectedEngineer);

  // Calculate skill distribution
  const skillCount: Record<string, number> = {};
  engineers.forEach((e) => {
    e.skills.forEach((s) => {
      skillCount[s] = (skillCount[s] || 0) + 1;
    });
  });

  const skillDistribution = Object.entries(skillCount)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 skills

  // Calculate experience distribution for trends
  const experienceData = engineers.reduce((acc, engineer) => {
    const expRange = engineer.experience >= 5 ? "5+ years" 
                   : engineer.experience >= 3 ? "3-5 years"
                   : engineer.experience >= 1 ? "1-3 years" 
                   : "< 1 year";
    
    const existing = acc.find(item => item.range === expRange);
    if (existing) {
      existing.count += 1;
      existing.avgProjects = Math.round((existing.avgProjects * (existing.count - 1) + engineer.totalProjects) / existing.count);
      existing.avgUtilization = Math.round((existing.avgUtilization * (existing.count - 1) + engineer.utilization) / existing.count);
    } else {
      acc.push({
        range: expRange,
        count: 1,
        avgProjects: engineer.totalProjects,
        avgUtilization: engineer.utilization
      });
    }
    return acc;
  }, [] as Array<{range: string; count: number; avgProjects: number; avgUtilization: number}>);

  // Calculate summary statistics
  const totalEngineers = engineers.length;
  const averageUtilization = totalEngineers > 0 
    ? Math.round(engineers.reduce((sum, e) => sum + e.utilization, 0) / totalEngineers) + "%"
    : "0%";
  
  const avgProjectsPerEngineer = totalEngineers > 0
    ? (engineers.reduce((sum, e) => sum + e.totalProjects, 0) / totalEngineers).toFixed(1)
    : "0.0";

  const avgExperience = totalEngineers > 0
    ? (engineers.reduce((sum, e) => sum + e.experience, 0) / totalEngineers).toFixed(1)
    : "0.0";

  const skillCoverage = skillDistribution.length;

  return (
    <div className="space-y-6">
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="skill" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience vs Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={experienceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="avgUtilization"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Avg Utilization %"
                      />
                      <Line
                        type="monotone"
                        dataKey="avgProjects"
                        stroke="#22c55e"
                        strokeWidth={2}
                        name="Avg Projects"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Engineers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEngineers}</div>
                <p className="text-sm text-muted-foreground">Active engineers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {averageUtilization}
                </div>
                <p className="text-sm text-muted-foreground">Project utilization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Projects per Engineer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgProjectsPerEngineer}</div>
                <p className="text-sm text-muted-foreground">Average workload</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Unique Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{skillCoverage}</div>
                <p className="text-sm text-muted-foreground">Different skills</p>
              </CardContent>
            </Card>
          </div>

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
                        {engineer.role} • {engineer.experience} years experience
                      </p>
                      <div className="flex gap-1 mt-2">
                        {engineer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {engineer.skills.length > 3 && (
                          <Badge variant="outline">
                            +{engineer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="font-medium text-green-600">
                          {engineer.activeProjects}
                        </span>{" "}
                        active • {" "}
                        <span className="font-medium">
                          {engineer.completedProjects}
                        </span>{" "}
                        completed
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-blue-600">
                          {engineer.utilization}%
                        </span>{" "}
                        utilization
                      </div>
                      <Badge 
                        variant={
                          engineer.performance === "Expert" ? "default" :
                          engineer.performance === "Senior" ? "secondary" :
                          "outline"
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
        selectedEngineerData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedEngineerData.totalProjects}
                  </div>
                  <p className="text-sm text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedEngineerData.activeProjects}
                  </div>
                  <p className="text-sm text-muted-foreground">Currently working</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Utilization Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedEngineerData.utilization}%
                  </div>
                  <p className="text-sm text-muted-foreground">Capacity usage</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Experience Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedEngineerData.experience}
                  </div>
                  <p className="text-sm text-muted-foreground">Years experience</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {selectedEngineerData.skills.length === 0 && (
                      <p className="text-sm text-muted-foreground">No skills recorded</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Performance Level:</span>
                      <Badge variant="default">{selectedEngineerData.performance}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Completed Projects:</span>
                      <span className="font-medium">{selectedEngineerData.completedProjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Skills Count:</span>
                      <span className="font-medium">{selectedEngineerData.skills.length}</span>
                    </div>
                    {selectedEngineerData.joinedAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Joined:</span>
                        <span className="font-medium">
                          {new Date(selectedEngineerData.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default EngineerAnalytics;
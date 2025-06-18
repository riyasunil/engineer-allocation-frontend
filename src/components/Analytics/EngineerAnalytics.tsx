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
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// Types
interface Engineer {
  id: string;
  name: string;
  efficiency: number;
  projectsAssigned: number;
  avgDuration: number;
  primarySkill: string;
}

interface PerformanceData {
  month: string;
  efficiency: number;
}

interface AllocationData {
  month: string;
  projects: number;
}

interface EngineerAnalyticsProps {
  selectedEngineer: string;
  setSelectedEngineer: (value: string) => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color?: string;
}

// Dummy Data
const engineers: Engineer[] = [
  {
    id: "1",
    name: "Alice Johnson",
    efficiency: 95,
    projectsAssigned: 3,
    avgDuration: 4.2,
    primarySkill: "React",
  },
  {
    id: "2",
    name: "Bob Smith",
    efficiency: 89,
    projectsAssigned: 2,
    avgDuration: 5.0,
    primarySkill: "Node.js",
  },
  {
    id: "3",
    name: "Carol Lee",
    efficiency: 92,
    projectsAssigned: 4,
    avgDuration: 3.8,
    primarySkill: "Python",
  },
];

const performanceTrends: PerformanceData[] = [
  { month: "Jan", efficiency: 88 },
  { month: "Feb", efficiency: 91 },
  { month: "Mar", efficiency: 90 },
  { month: "Apr", efficiency: 94 },
  { month: "May", efficiency: 93 },
  { month: "Jun", efficiency: 95 },
];

const allocationTrends: AllocationData[] = [
  { month: "Jan", projects: 2 },
  { month: "Feb", projects: 3 },
  { month: "Mar", projects: 2 },
  { month: "Apr", projects: 3 },
  { month: "May", projects: 4 },
  { month: "Jun", projects: 3 },
];

// Reusable StatCard
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

const EngineerAnalytics: React.FC<EngineerAnalyticsProps> = ({
  selectedEngineer,
  setSelectedEngineer,
}) => {
  const selectedData =
    selectedEngineer !== "all"
      ? engineers.find((e) => e.id === selectedEngineer)
      : null;

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Efficiency Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Team Efficiency Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Project Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Project Allocation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allocationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="projects" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        selectedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Efficiency"
              value={`${selectedData.efficiency}%`}
              subtitle="Current performance"
              color="text-green-600"
            />
            <StatCard
              title="Projects Assigned"
              value={selectedData.projectsAssigned}
              subtitle="Active & completed"
              color="text-blue-600"
            />
            <StatCard
              title="Avg. Project Duration"
              value={`${selectedData.avgDuration} mo`}
              subtitle="Per project"
            />
            <StatCard
              title="Primary Skill"
              value={selectedData.primarySkill}
              subtitle="Based on assignment"
              color="text-purple-600"
            />
          </div>
        )
      )}
    </div>
  );
};

export default EngineerAnalytics;

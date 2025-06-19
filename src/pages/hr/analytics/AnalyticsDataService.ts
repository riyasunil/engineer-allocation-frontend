// services/analyticsDataService.ts
import { useGetEngineersQuery } from "@/api-service/user/user.api";
import { useGetAllProjectsQuery } from "@/api-service/projects/projects.api";
import { Project, User } from "@/utils/types";

// Types for transformed data
export interface TransformedEngineer {
  id: string;
  name: string;
  role: string;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  utilization: number;
  skills: string[];
  experience: number;
  performance: string;
  joinedAt?: Date;
}

export interface TransformedProject {
  id: string;
  name: string;
  status: string;
  staffingPercentage: number;
  teamSize: number;
  duration: string;
  requiredEngineers: number;
  assignedEngineers: number;
  startDate?: Date;
  endDate?: Date;
}

export interface SkillDistribution {
  skill: string;
  count: number;
}

export interface EngineerSummary {
  totalEngineers: number;
  averageUtilization: number;
  experienceDistribution: Record<string, number>;
  performanceDistribution: Record<string, number>;
}

// CSV Export Utility Functions
export const convertToCSV = (data: any[], headers: string[]): string => {
  const csvHeaders = headers.join(",");
  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || "";
      })
      .join(",")
  );
  return [csvHeaders, ...csvRows].join("\n");
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Data transformation functions
export const transformEngineersData = (
  engineersData: User[]
): TransformedEngineer[] => {
  return engineersData
    .filter((user) => user.role.role_name === "ENGINEER")
    .map((user) => {
      const totalProjects = user.projectUsers?.length || 0;
      const activeProjects =
        user.projectUsers?.filter((pu) => !pu.end_date)?.length || 0;
      const completedProjects =
        user.projectUsers?.filter((pu) => pu.end_date)?.length || 0;

      const experience = user.experience || 0;
      let performanceRating = "New";
      let utilizationScore = 0;

      if (experience >= 5) {
        performanceRating = "Expert";
        utilizationScore = Math.min(90 + activeProjects * 5, 100);
      } else if (experience >= 3) {
        performanceRating = "Senior";
        utilizationScore = Math.min(80 + activeProjects * 7, 95);
      } else if (experience >= 1) {
        performanceRating = "Intermediate";
        utilizationScore = Math.min(70 + activeProjects * 10, 90);
      } else {
        performanceRating = "Junior";
        utilizationScore = Math.min(60 + activeProjects * 15, 85);
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
};

export const transformProjectsData = (
  projectsData: Project[]
): TransformedProject[] => {
  return projectsData.map((project) => {
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

    const staffingPercentage =
      requiredEngineers > 0
        ? Math.round((assignedEngineers / requiredEngineers) * 100)
        : assignedEngineers > 0
        ? 100
        : 0;

    return {
      id: project.project_id,
      name: project.name,
      status: project.status || "NEW",
      staffingPercentage,
      teamSize: assignedEngineers,
      duration: duration.toString(),
      requiredEngineers,
      assignedEngineers,
      startDate: project.startdate,
      endDate: project.enddate,
    };
  });
};

// Custom hook for analytics data
export const useAnalyticsData = () => {
  const { data: engineersData = [], isLoading: engineersLoading } =
    useGetEngineersQuery();
  const { data: projectsData = [], isLoading: projectsLoading } =
    useGetAllProjectsQuery();

  const engineers = transformEngineersData(engineersData);
  const projects = transformProjectsData(projectsData);

  // Calculate skill distribution
  const skillCount: Record<string, number> = {};
  engineers.forEach((e) => {
    e.skills.forEach((s) => {
      skillCount[s] = (skillCount[s] || 0) + 1;
    });
  });

  const skillDistribution: SkillDistribution[] = Object.entries(skillCount)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate engineer summary metrics
  const engineerSummary: EngineerSummary = {
    totalEngineers: engineers.length,
    averageUtilization:
      engineers.reduce((sum, e) => sum + e.utilization, 0) /
      Math.max(engineers.length, 1),
    experienceDistribution: engineers.reduce((acc, engineer) => {
      const expRange =
        engineer.experience >= 5
          ? "5+ years"
          : engineer.experience >= 3
          ? "3-5 years"
          : engineer.experience >= 1
          ? "1-3 years"
          : "< 1 year";
      acc[expRange] = (acc[expRange] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    performanceDistribution: engineers.reduce((acc, engineer) => {
      acc[engineer.performance] = (acc[engineer.performance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return {
    engineers,
    projects,
    skillDistribution,
    engineerSummary,
    isLoading: engineersLoading || projectsLoading,
  };
};

// Export function - only for all engineers data + skill distribution
export const exportEngineersData = (
  engineers: TransformedEngineer[],
  skillDistribution: SkillDistribution[]
): void => {
  // Engineer summary CSV
  const engineerHeaders = [
    "name",
    "role",
    "experience",
    "performance",
    "totalProjects",
    "activeProjects",
    "completedProjects",
    "utilization",
    "skillsCount",
    "skills",
    "joinedAt",
  ];

  const engineerData = engineers.map((engineer) => ({
    name: engineer.name,
    role: engineer.role,
    experience: engineer.experience,
    performance: engineer.performance,
    totalProjects: engineer.totalProjects,
    activeProjects: engineer.activeProjects,
    completedProjects: engineer.completedProjects,
    utilization: `${engineer.utilization}%`,
    skillsCount: engineer.skills.length,
    skills: engineer.skills.join("; "),
    joinedAt: engineer.joinedAt
      ? new Date(engineer.joinedAt).toISOString().split("T")[0]
      : "N/A",
  }));

  // Skills distribution CSV
  const skillHeaders = ["skill", "engineerCount", "percentage"];
  const totalEngineers = engineers.length;
  const skillData = skillDistribution.map(({ skill, count }) => ({
    skill,
    engineerCount: count,
    percentage: `${Math.round((count / totalEngineers) * 100)}%`,
  }));

  const engineerCSV = convertToCSV(engineerData, engineerHeaders);
  const skillCSV = convertToCSV(skillData, skillHeaders);

  downloadCSV(engineerCSV, "engineers-summary.csv");
  downloadCSV(skillCSV, "skills-distribution.csv");
};

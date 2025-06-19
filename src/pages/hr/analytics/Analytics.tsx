import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ProjectAnalytics from "@/components/Analytics/ProjectAnaytics";
import EngineerAnalytics from "@/components/Analytics/EngineerAnalytics";
import { toast } from "sonner";



// Types
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color?: string;
}

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

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "engineers">(
    "projects"
  );
  const [selectedEngineer, setSelectedEngineer] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:5000/report/download", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "engineer_insights_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download report");
    } finally {
      setIsGenerating(false);
    }
  };




  const handleExport = () => {
    toast(`Exporting ${activeTab} analytics data...`);

    // Mock export functionality
    setTimeout(() => {
      toast(`Exported ${activeTab} analytics data successfully.`);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into projects and engineer performance
          </p>
        </div>
        <div className="flex gap-2">
        <Button
          onClick={handleDownloadReport}
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          <Download className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Download AI Report"}
        </Button>


          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="w-full">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "projects"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Project Analytics
          </button>
          <button
            onClick={() => setActiveTab("engineers")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "engineers"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Engineer Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "projects" ? (
            <ProjectAnalytics
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            />
          ) : (
            <EngineerAnalytics
              selectedEngineer={selectedEngineer}
              setSelectedEngineer={setSelectedEngineer}
            />
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeTab === "projects" ? (
          <>
            <StatCard title="Total Projects" value="51" subtitle="All time" />
            <StatCard
              title="Success Rate"
              value="92%"
              subtitle="Completed on time"
              color="text-green-600"
            />
            <StatCard
              title="Average Duration"
              value="4.2"
              subtitle="Months per project"
            />
            <StatCard
              title="Total Budget"
              value="$2.4M"
              subtitle="Allocated this year"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Engineers"
              value="24"
              subtitle="Active team members"
            />
            <StatCard
              title="Average Efficiency"
              value="91%"
              subtitle="Team performance"
              color="text-green-600"
            />
            <StatCard
              title="Projects per Engineer"
              value="2.1"
              subtitle="Average workload"
            />
            <StatCard
              title="Skill Coverage"
              value="89%"
              subtitle="Technology requirements"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;

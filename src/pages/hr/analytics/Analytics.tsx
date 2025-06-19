import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

import EngineerAnalytics from "@/components/Analytics/EngineerAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportEngineersData, useAnalyticsData } from "./AnalyticsDataService";
import ProjectAnalytics from "@/components/Analytics/ProjectAnaytics";

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("projects");

  const { engineers, projects, skillDistribution, engineerSummary, isLoading } =
    useAnalyticsData();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = (): void => {
    if (isLoading) {
      toast.error("Data is still loading, please wait...");
      return;
    }

    //toast("Exporting engineers analytics data...");

    try {
      exportEngineersData(engineers, skillDistribution);
      toast.success(
        "Engineers data exported successfully! Check your downloads folder for 2 CSV files."
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data. Please try again.");
    }
  };

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
      toast.success(
        "AI report exported successfully! Check your downloads folder for the report."
      );
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
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

        <Button
          onClick={handleExport}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          {isLoading ? "Loading..." : "Export Engineers Data"}
        </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Project Analytics</TabsTrigger>
          <TabsTrigger value="engineers">Engineer Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <ProjectAnalytics />
        </TabsContent>

        <TabsContent value="engineers" className="space-y-6">
          <EngineerAnalytics />
        </TabsContent>
      </Tabs>

      
    </div>
  );
};

export default Analytics;

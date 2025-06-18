import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import ProjectAnalytics from "@/components/Analytics/ProjectAnaytics";
import EngineerAnalytics from "@/components/Analytics/EngineerAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Analytics = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const handleExport = () => {
    toast(`Exporting ${activeTab} analytics data...`,
    );

    // Mock export functionality
    setTimeout(() => {
      toast(
        `${activeTab} analytics data has been exported successfully.`,
      );
    }, 2000);
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
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
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

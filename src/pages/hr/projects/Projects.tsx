import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/pageHeader";
import { SearchFilterBar } from "@/components/ui/searchFilterBar";
import ProjectCard from "@/components/ui/projectCard";
import { Project } from "@/utils/types";
import { useGetAllProjectsQuery } from "@/api-service/projects/projects.api";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "NEW" | "IN PROGRESS" | "CLOSED"
  >("ALL");

  // Fetch projects data from API
  const { data: projects = [], isLoading, error } = useGetAllProjectsQuery(undefined, {refetchOnMountOrArgChange: false});
  console.log("Projects data:", projects);

  // Transform API data to match the expected format for the UI
  const transformedProjects = projects.map((project: Project) => {
    const assignedEngineers = project.projectUsers?.length || 0;
    const requiredEngineers =
      project.requirements?.reduce(
        (sum, req) => sum + (req.required_count || 1),
        0
      ) || 0;

    // Calculate duration if start and end dates are available
    const duration =
      project.startdate && project.enddate
        ? Math.ceil(
            (new Date(project.enddate).getTime() -
              new Date(project.startdate).getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          ) + " months"
        : "N/A";

    // Check if project is nearing completion (within 30 days of end date)
    const nearingCompletion = project.enddate
      ? new Date(project.enddate).getTime() - new Date().getTime() <=
        30 * 24 * 60 * 60 * 1000
      : false;

    return {
      id: project.id,
      name: project.name,
      status: project.status || "NEW",
      duration,
      startDate: project.startdate
        ? new Date(project.startdate).toISOString().split("T")[0]
        : "",
      endDate: project.enddate
        ? new Date(project.enddate).toISOString().split("T")[0]
        : "",
      requiredEngineers,
      assignedEngineers,
      // techStack:
      //   project.requirements
      //     ?.map((req) =>
      //       req.requirementSkills?.map((skill) => skill.skill.skill_name)
      //     )
      //     .flat()
      //     .filter(Boolean) || [],
      isOverStaffed: assignedEngineers > requiredEngineers,
      isUnderStaffed: assignedEngineers < requiredEngineers,
      nearingCompletion,
      pm: project.pm,
      lead: project.lead,
    };
  });

  const filteredProjects = transformedProjects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const total = transformedProjects.length;
  const newCount = transformedProjects.filter((p) => p.status === "NEW").length;
  const activeCount = transformedProjects.filter(
    (p) => p.status === "IN PROGRESS"
  ).length;
  const closedCount = transformedProjects.filter(
    (p) => p.status === "CLOSED"
  ).length;
  const avgEngineers =
    transformedProjects.length > 0
      ? (
          transformedProjects.reduce((sum, p) => sum + p.assignedEngineers, 0) /
          transformedProjects.length
        ).toFixed(1)
      : "0.0";

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* <PageHeader
          title="Projects"
          description="Manage project status, assignment, and resources"
          buttonText="Add Project"
          onButtonClick={() => navigate}
        /> */}
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        {/* <PageHeader
          title="Projects"
          description="Manage project status, assignment, and resources"
          buttonText="Add Project"
          onButtonClick={() => console.log("Add project")}
        /> */}
        <div className="text-center py-12">
          <p className="text-red-600">
            Error loading projects. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage project status, assignment, and resources"
        buttonText="Add Project"
        onButtonClick={() => navigate('create')}
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={filter}
        onFilterChange={(val) => setFilter(val as typeof filter)}
        filterOptions={[
          { value: "ALL", label: "All" },
          { value: "NEW", label: "New" },
          { value: "IN PROGRESS", label: "In Progress" },
          { value: "CLOSED", label: "Closed" },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Projects</p>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">New</p>
            <p className="text-2xl font-bold text-blue-600">{newCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Closed</p>
            <p className="text-2xl font-bold text-gray-600">{closedCount}</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Avg. Engineers Assigned
            </p>
            <p className="text-2xl font-bold text-purple-600">{avgEngineers}</p>
          </CardContent>
        </Card> */}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
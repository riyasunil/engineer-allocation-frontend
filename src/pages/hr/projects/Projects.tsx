import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/pageHeader";
import { SearchFilterBar } from "@/components/ui/searchFilterBar";
import ProjectCard from "@/components/ui/projectCard";
import { useNavigate, useNavigation } from "react-router-dom";

const projects = [
  {
    id: "1",
    name: "Project Alpha",
    status: "NEW",
    duration: "6 months",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    requiredEngineers: 5,
    assignedEngineers: 3,
    techStack: ["Node.js", "React", "PostgreSQL"],
    isOverStaffed: false,
    isUnderStaffed: true,
    nearingCompletion: false,
  },
  {
    id: "2",
    name: "Project Beta",
    status: "CLOSED",
    duration: "3 months",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    requiredEngineers: 4,
    assignedEngineers: 4,
    techStack: ["Django", "Vue.js", "MySQL"],
    isOverStaffed: false,
    isUnderStaffed: false,
    nearingCompletion: false,
  },
  {
    id: "3",
    name: "Project Gamma",
    status: "IN_PROGRESS",
    duration: "2 months",
    startDate: "2025-05-01",
    endDate: "2025-06-30",
    requiredEngineers: 4,
    assignedEngineers: 5,
    techStack: ["Go", "Svelte", "MongoDB", "Redis"],
    isOverStaffed: true,
    isUnderStaffed: false,
    nearingCompletion: true,
  },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "NEW" | "IN_PROGRESS" | "CLOSED"
  >("ALL");
  const navigate = useNavigate();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const total = projects.length;
  const newCount = projects.filter((p) => p.status === "NEW").length;
  const activeCount = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const closedCount = projects.filter((p) => p.status === "CLOSED").length;
  const avgEngineers = (
    projects.reduce((sum, p) => sum + p.assignedEngineers, 0) / projects.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage project status, assignment, and resources"
        buttonText="Add Project"
        onButtonClick={() => {navigate(`/hr/projects/create`);}}
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={filter}
        onFilterChange={(val) => setFilter(val as typeof filter)}
        filterOptions={[
          { value: "ALL", label: "All" },
          { value: "NEW", label: "New" },
          { value: "IN_PROGRESS", label: "In Progress" },
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

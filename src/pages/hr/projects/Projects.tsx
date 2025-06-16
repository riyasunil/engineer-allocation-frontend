import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
  TypographyP,
} from "@/components/ui/typography";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const projects = [
    {
      id: "1",
      name: "E-Commerce Platform",
      status: "IN_PROGRESS" as const,
      duration: "3 months",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      requiredEngineers: 5,
      assignedEngineers: 4,
      techStack: ["React", "Node.js", "PostgreSQL", "AWS"],
      isOverStaffed: false,
      isUnderStaffed: true,
      nearingCompletion: false,
    },
    {
      id: "2",
      name: "Mobile Banking App",
      status: "NEW" as const,
      duration: "4 months",
      requiredEngineers: 6,
      assignedEngineers: 0,
      techStack: ["Flutter", "Firebase", "Node.js"],
      isOverStaffed: false,
      isUnderStaffed: false,
      nearingCompletion: false,
    },
    {
      id: "3",
      name: "Analytics Dashboard",
      status: "IN_PROGRESS" as const,
      duration: "2 months",
      startDate: "2024-03-01",
      endDate: "2024-05-01",
      requiredEngineers: 3,
      assignedEngineers: 4,
      techStack: ["React", "D3.js", "Python", "MongoDB"],
      isOverStaffed: true,
      isUnderStaffed: false,
      nearingCompletion: true,
    },
    {
      id: "4",
      name: "Customer Portal",
      status: "CLOSED" as const,
      duration: "2 months",
      startDate: "2023-11-01",
      endDate: "2024-01-01",
      requiredEngineers: 4,
      assignedEngineers: 4,
      techStack: ["Vue.js", "Laravel", "MySQL"],
      isOverStaffed: false,
      isUnderStaffed: false,
      nearingCompletion: false,
    },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div>
      <div className="title-header-group flex flex-row align-middle justify-between w-full">
        <div className="title-text-group flex flex-col">
          <TypographyH2 text="Projects" />
          <TypographyP muted text="Manage all projects and their allocations" />
        </div>
        <Button variant={"default"} onClick={() => navigate("/hr/projects/create")}>Create Project</Button>
      </div>
    </div>
  );
};

export default Projects;

import { Card, CardContent } from "@/components/ui/card";
import EngineerCard from "@/components/ui/engineerCard";
import { PageHeader } from "@/components/ui/pageHeader";
import { SearchFilterBar } from "@/components/ui/searchFilterBar";
import React, { useState } from "react";

const engineers = [
  {
    id: "1",
    name: "Javad",
    experience: "3 years",
    designation: "Backend Developer",
    skills: ["Node.js", "PostgreSQL", "TypeScript"],
    availability: "AVAILABLE",
    allocations: 1,
    email: "javed.shaikh@example.com",
    currentProjects: 1,
    maxProjects: 2,
    isAvailable: true,
    strengths: ["API Design", "Database Optimization"],
  },
  {
    id: "2",
    name: "Sara Khan",
    experience: "2 years",
    designation: "Frontend Developer",
    skills: ["React", "Tailwind", "JavaScript"],
    availability: "FULLY_ALLOCATED",
    allocations: 2,
    email: "sara.khan@example.com",
    currentProjects: 2,
    maxProjects: 2,
    isAvailable: false,
    strengths: ["UI/UX", "Responsive Design"],
  },
];

export default function Engineers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredEngineers = engineers.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || e.availability === filter;
    return matchesSearch && matchesFilter;
  });

  const total = engineers.length;
  const available = engineers.filter(
    (e) => e.availability === "AVAILABLE"
  ).length;
  const fullyAllocated = engineers.filter(
    (e) => e.availability === "FULLY_ALLOCATED"
  ).length;
  const avgProjects = (
    engineers.reduce((sum, e) => sum + e.currentProjects, 0) / engineers.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineers"
        description="Manage engineer profiles and availability"
        buttonText="Add Engineer"
        onButtonClick={() => console.log("Add engineer")}
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={filter}
        onFilterChange={setFilter}
        filterOptions={[
          { value: "ALL", label: "All" },
          { value: "AVAILABLE", label: "Available" },
          { value: "FULLY_ALLOCATED", label: "Fully Allocated" },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Engineers</p>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold text-green-600">{available}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Fully Allocated</p>
            <p className="text-2xl font-bold text-red-600">{fullyAllocated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Projects</p>
            <p className="text-2xl font-bold text-blue-600">{avgProjects}</p>
          </CardContent>
        </Card>
      </div>

      {filteredEngineers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No engineers found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEngineers.map((engineer) => (
            <EngineerCard
              key={engineer.id}
              engineer={engineer}
              onClick={() => console.log(engineer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

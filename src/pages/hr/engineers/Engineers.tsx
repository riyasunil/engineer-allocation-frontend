import { Card, CardContent } from "@/components/ui/card";
import EngineerCard from "@/components/ui/engineerCard";
import { PageHeader } from "@/components/ui/pageHeader";
import { SearchFilterBar } from "@/components/ui/searchFilterBar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "@/utils/types";
import { useGetEngineersQuery } from "@/api-service/user/user.api";

export default function Engineers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  // Fetch engineers data from API
  const { data: engineers = [], isLoading, error } = useGetEngineersQuery();

  // Transform API data to match the expected format for the UI
  const transformedEngineers = engineers
    .filter((user: User) => user.role.role_name === "ENGINEER")
    .map((user: User) => ({
      id: user.user_id,
      name: user.name,
      experience: user.experience ? `${user.experience} years` : "N/A",
      designation: user.designations?.[0]?.designation?.name || "Engineer", // Assuming first designation
      skills: user.userSkills?.map((skill) => skill.skill.skill_name) || [],
      // Calculate availability based on current vs max projects
      availability: user.projectUsers?.length
        ? user.projectUsers?.length >= 2
          ? "FULLY_ALLOCATED"
          : "AVAILABLE"
        : "AVAILABLE",
      allocations: user.projectUsers?.length || 0,
      email: user.email,
      currentProjects: user.projectUsers?.length || 0,
      maxProjects: 2, // Default max projects
      isAvailable: (user.projectUsers?.length || 0) < 2,
      strengths:
        user.userSkills?.slice(0, 2).map((skill) => skill.skill.skill_name) ||
        [], // Take first 2 skills as strengths
    }));

  const filteredEngineers = transformedEngineers.filter(
    (e: { name: string; availability: string }) => {
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "ALL" || e.availability === filter;
      return matchesSearch && matchesFilter;
    }
  );

  const total = transformedEngineers.length;
  const available = transformedEngineers.filter(
    (e: { availability: string }) => e.availability === "AVAILABLE"
  ).length;
  const fullyAllocated = transformedEngineers.filter(
    (e: { availability: string }) => e.availability === "FULLY_ALLOCATED"
  ).length;
  const avgProjects =
    transformedEngineers.length > 0
      ? (
          transformedEngineers.reduce(
            (sum: any, e: { currentProjects: any }) => sum + e.currentProjects,
            0
          ) / transformedEngineers.length
        ).toFixed(1)
      : "0.0";

  // Handle engineer card click to navigate to details page
  const handleEngineerClick = (engineer: any) => {
    navigate(`/hr/engineers/${engineer.id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Engineers"
          description="Manage engineer profiles and availability"
          buttonText="Add Engineer"
          onButtonClick={() => navigate("/hr/addengineer")}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading engineers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Engineers"
          description="Manage engineer profiles and availability"
          buttonText="Add Engineer"
          onButtonClick={() => navigate("/hr/addengineer")}
        />
        <div className="text-center py-12">
          <p className="text-red-600">
            Error loading engineers. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineers"
        description="Manage engineer profiles and availability"
        buttonText="Add Engineer"
        onButtonClick={() => navigate("/hr/addengineer")}
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
              onClick={() => navigate(`/hr/engineers/${engineer.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
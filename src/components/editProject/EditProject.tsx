import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  useAssignEngineerToProjectMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/api-service/projects/projects.api";
import { useGetDesignationQuery } from "@/api-service/designation/designation.api";
import { useGetSkillsQuery } from "@/api-service/skill/skill.api";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/api-service/projects/projects.api";
import {
  useGetAllAvailableUsersQuery,
  useGetAssignableUsersQuery,
  useLazyGetAssignableUsersQuery,
  userApi,
} from "@/api-service/user/user.api";
import { useGetEngineersQuery } from "@/api-service/user/user.api";
import { Separator } from "@radix-ui/react-separator";
import {
  useCreateRequirementMutation,
  useDeleteRequirementMutation,
  useLazyGetSkillbyRequirementIdQuery,
  useUpdateRequirementMutation,
} from "@/api-service/projectRequirements/projectRequirements.api";

interface AssignableUserPayload {
  designation: string;
  skills: number[];
}

interface Skill {
  id: number;
  name: string;
}

interface ProjectRequirement {
  designation: string;
  designation_id: number;
  skills: { id: number; name: string }[]; // Changed to skills object array
  count: number;
  engineers: number[];
}

interface CreateRequirementDto {
  project_id: number;
  designation_id: number;
  required_count: number;
  skills: { id: number; name: string }[]; // Changed to skills object array
  // engineers?: number[];
}

interface UpdateProjectDto {
  name?: string;
  startdate?: string;
  enddate?: string;
  status?: string;
  pmId?: number;
  leadId?: number;
}

const projectStatuses = ["NEW", "IN PROGRESS", "CLOSED"];

const EditProject = () => {
  const navigate = useNavigate();
  const [updateProject, { isLoading: isUpdatingProject }] =
    useUpdateProjectMutation();
  const { data: designationsWithIds } = useGetDesignationQuery();
  const { data: skillsWithIds } = useGetSkillsQuery();
  const { data: availableEngineers } = useGetAllAvailableUsersQuery();
  // const [fetchSkillsForRequirement, {isLoading: isLoadingSkills}] = useLazyGetSkillbyRequirementIdQuery();

  const [requirementSkills, setRequirementSkills] = useState<
    Record<number, string[]>
  >({});
  const [selectedEngineersForAssignment, setSelectedEngineersForAssignment] = useState<{
  [requirementId: number]: number[]
}>({});


  const unassignEngineer = async (...args: any[]) => {
    console.log("Mock unassignEngineer called with:", args);
    return { data: { message: "Engineer unassigned (mock)" } };
  };

  const [createRequirement, { isLoading: isCreatingRequirement }] =
    useCreateRequirementMutation();
  const [updateRequirement, { isLoading: isUpdatingRequirement }] =
    useUpdateRequirementMutation();
  const [deleteRequirement, { isLoading: isDeletingRequirement }] =
    useDeleteRequirementMutation();
  const [assignEngineer, { isLoading: isAssigningEngineer }] =
    useAssignEngineerToProjectMutation();

  const [trigger, { data: assignableEngineers }] =
    useLazyGetAssignableUsersQuery();

  const [deletingRequirements, setDeletingRequirements] = useState<Set<number>>(
    new Set()
  );
  const [assigningToRequirements, setAssigningToRequirements] = useState<
    Set<number>
  >(new Set());
  const [unassigningAssignments, setUnassigningAssignments] = useState<
    Set<number>
  >(new Set());

  console.log("Assignale engineers", assignableEngineers);
  const { id } = useParams();
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
    refetch: refetchProject,
  } = useGetProjectByIdQuery(id!, {
    skip: !id,
  });

  console.log("project", project);

  const {
    data: engineers = [],
    isLoading: isEngineerLoading,
    error,
  } = useGetEngineersQuery();
  const filteredEngineers = engineers.filter(
    (user) => user.role.role_name === "ENGINEER"
  );

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    project_id: "",
    name: "",
    startdate: undefined,
    enddate: undefined,
    status: "",
    pmId: 0,
    leadId: 0,
    requirements: [],
  });

  const [originalRequirements, setOriginalRequirements] = useState<any[]>([]);
  // const [editingRequirement, setEditingRequirement] = useState<{
  //   index: number;
  //   data: any;
  // } | null>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        startdate: project.startdate
          ? new Date(project.startdate).toISOString().split("T")[0]
          : undefined,
        enddate: project.enddate
          ? new Date(project.enddate).toISOString().split("T")[0]
          : undefined,
        status: project.status || "",
        pmId: project.pm?.id || 0,
        leadId: project.lead?.id || 0,
        requirements: [],
      });
      setOriginalRequirements(project.requirements || []);
    }
  }, [project]);

  console.log(formData);

  const [newReq, setNewReq] = useState<ProjectRequirement>({
    designation: "",
    designation_id: 0,
    skills: [], // Now array of skill objects
    count: 1,
    engineers: [],
  });
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showEngineerCard, setShowEngineerCard] = useState(false);
  const [newReqEngineers, setNewReqEngineers] = useState<number[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["pmId", "leadId"].includes(name) ? parseInt(value) : value,
    }));
  };

  const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDesignation = designationsWithIds?.find(
      (d) => d.id === parseInt(e.target.value)
    );
    setNewReq((prev) => ({
      ...prev,
      designation: selectedDesignation?.name || "",
      designation_id: selectedDesignation?.id || 0,
    }));
  };

  // Fixed: Remove skill by id
  const handleRemoveSkillFromRequirement = (skillId: number) => {
    setNewReq((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== skillId),
    }));
  };

  const handleConfirmRequirement = () => {
    if (newReq.designation && newReq.designation_id && newReq.count > 0) {
      setShowEngineerCard(true);
      const skillIds = newReq.skills.map((s) => s.id);
      handleGetAssignableEngineers(newReq.designation, skillIds);
    }
  };

  const handleClearRequirement = () => {
    setNewReq({
      designation: "",
      designation_id: 0,
      skills: [],
      count: 1,
      engineers: [],
    });
    setSelectedSkill("");
    setShowEngineerCard(false);
    setNewReqEngineers([]);
  };

  const handleAddSkillToRequirement = (skillId: string) => {
    const skill = skillsWithIds?.find((s) => s.id === parseInt(skillId));
    const skillExists = newReq.skills.some((s) => s.id === parseInt(skillId));

    if (skill && !skillExists) {
      setNewReq((prev) => ({
        ...prev,
        skills: [...prev.skills, { id: skill.id, name: skill.skill_name }],
      }));
    }
    setSelectedSkill(""); // Reset the select input
  };

  const handleAddRequirement = async () => {
    try {
      // Prepare the request data in the required format
      const createReqData = {
        project_id: parseInt(id!),
        designation_id: newReq.designation_id,
        required_count: newReq.count,
        is_requested: false,
        requirement_skills: newReq.skills.map((skill) => ({
          skill_id: skill.id,
        })),
      };

      console.log("Creating requirement with data:", createReqData);
      const res = await createRequirement(createReqData).unwrap();
      console.log("API Response:", res);

      // If engineers were selected, assign them to the requirement
      if (newReqEngineers.length > 0 && res.data?.id) {
        // Get user_id as string from assignableEngineers
        const engineersWithUserIds = newReqEngineers.map((engineerId) => {
          const engineer = assignableEngineers?.find(
            (eng) => eng.id === engineerId
          );
          if (!engineer) {
            throw new Error(
              `Engineer with id ${engineerId} not found in assignable engineers`
            );
          }
          return {
            user_id: engineer.user_id, // Keep as string - matches backend expectation
            requirement_id: res.data.id,
          };
        });

        console.log("Assigning engineers with payload:", {
          engineers: engineersWithUserIds,
        });
        await assignEngineer({
          id: parseInt(id!),
          engineers: engineersWithUserIds,
        }).unwrap();
      }

      refetchProject();
      handleClearRequirement();
      alert("Requirement added successfully");
    } catch (error: any) {
      console.error("Error creating requirement:", error);
      alert(error?.data?.message || "Failed to create requirement");
    }
  };

  const handleRemoveRequirement = async (requirementId: number) => {
    if (window.confirm("Are you sure you want to delete this requirement?")) {
      try {
        await deleteRequirement(requirementId).unwrap();
        refetchProject();
        alert("Requirement deleted successfully");
      } catch (error: any) {
        console.error("Error deleting requirement:", error);
        alert(error?.data?.message || "Failed to delete requirement");
      }
    }
  };

  const handleAddEngineerToNewReq = (engineerId: number) => {
    if (!newReqEngineers.includes(engineerId)) {
      setNewReqEngineers((prev) => [...prev, engineerId]);
    }
  };

  const handleRemoveEngineerFromNewReq = (engineerId: number) => {
    setNewReqEngineers((prev) => prev.filter((id) => id !== engineerId));
  };

  const handleAssignEngineerToProject = async (
    engineerId: number,
    requirementId: number
  ) => {
    try {
      // Find the engineer to get their user_id (string format)
      const engineer = availableEngineers?.find((eng) => eng.id === engineerId);
      if (!engineer) {
        throw new Error(`Engineer with id ${engineerId} not found`);
      }

      await assignEngineer({
        id: parseInt(id!),
        engineers: [
          {
            user_id: engineer.user_id, // Use string user_id from engineer object
            requirement_id: requirementId,
          },
        ],
      }).unwrap();

      refetchProject();
      alert("Engineer assigned successfully");
    } catch (error: any) {
      console.error("Error assigning engineer:", error);
      alert(error?.data?.message || "Failed to assign engineer");
    }
  };

  const handleUnassignEngineerFromProject = async (assignmentId: number) => {
    if (window.confirm("Are you sure you want to unassign this engineer?")) {
      try {
        await unassignEngineer(assignmentId).unwrap();
        refetchProject();
        alert("Engineer unassigned successfully");
      } catch (error: any) {
        console.error("Error unassigning engineer:", error);
        alert(error?.data?.message || "Failed to unassign engineer");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.pmId || !formData.leadId) {
      alert("Please fill in all required fields (Name, PM, and Lead)");
      return;
    }

    try {
      const updateData: UpdateProjectDto = {};

      const formatDate = (date?: string) => date?.toString().split("T")[0];

      // Compare and add only changed fields
      if (formData.name !== project?.name) {
        updateData.name = formData.name;
      }

      // Fixed: Consistent date formatting for comparison
      const formattedStart = formatDate(formData.startdate);
      const projectStart = project?.startdate
        ? new Date(project.startdate).toISOString().split("T")[0]
        : undefined;

      if (formattedStart !== projectStart) {
        updateData.startdate = formattedStart;
      }

      const formattedEnd = formatDate(formData.enddate);
      const projectEnd = project?.enddate
        ? new Date(project.enddate).toISOString().split("T")[0]
        : undefined;

      if (formattedEnd !== projectEnd) {
        updateData.enddate = formattedEnd;
      }

      if (formData.status !== project?.status) {
        updateData.status = formData.status;
      }

      if (formData.pmId !== project?.pm?.id) {
        updateData.pmId = formData.pmId;
      }

      if (formData.leadId !== project?.lead?.id) {
        updateData.leadId = formData.leadId;
      }

      console.log("updateData", updateData);

      await updateProject({
        id: parseInt(id!),
        data: updateData,
      });

      alert("Project updated successfully");
      navigate("/hr/projects");
    } catch (error: any) {
      console.error("Error updating project:", error);
      alert(error?.data?.message || "Failed to update project");
    }
  };

  const handleGetAssignableEngineers = (
    designation: string,
    skills: number[]
  ) => {
    console.log(designation, skills);
    const payload: AssignableUserPayload = { designation, skills };
    trigger(payload);
  };

  useEffect(() => {
    console.log("Assignable engineers:", assignableEngineers);
  }, [assignableEngineers]);

  const startEditingRequirement = (index: number, requirement: any) => {};

  console.log("originalRequirements", originalRequirements);
  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
        <p className="text-muted-foreground">
          Update project details, assign leads, and set requirements
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Project Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Project Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium mb-2">
                Project Name<span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">
                Project ID
              </label>
              <input
                value={project?.project_id || ""}
                disabled
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Project ID cannot be changed
              </p>
            </div>
            <div>
              <label className="block text-base font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startdate"
                value={formData.startdate || ""}
                onChange={handleChange}
                min={today}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                name="enddate"
                value={formData.enddate || ""}
                onChange={handleChange}
                min={formData.startdate || today}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Management Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Project Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium mb-2">
                Project Manager<span className="text-red-500">*</span>
              </label>
              <select
                name="pmId"
                value={formData.pmId}
                onChange={handleChange}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Project Manager</option>
                {filteredEngineers.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2">
                Team Lead<span className="text-red-500">*</span>
              </label>
              <select
                name="leadId"
                value={formData.leadId}
                onChange={handleChange}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Team Lead</option>
                {filteredEngineers.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-3">
          <Button type="submit" className="w-48" disabled={isUpdatingProject}>
            {isUpdatingProject ? "Updating..." : "Update Project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/hr/projects")}
            className="w-48"
          >
            Cancel
          </Button>
        </div>

        {/* Project Requirements Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Project Requirements
          </h2>

          {/* Add New Requirement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={newReq.designation_id}
                onChange={handleDesignationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Role</option>
                {designationsWithIds?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Required Skill
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSkill(value);
                  if (value) {
                    handleAddSkillToRequirement(value);
                    setSelectedSkill("");
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Skill</option>
                {skillsWithIds
                  ?.filter(
                    (s) => !newReq.skills.some((skill) => skill.id === s.id)
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.skill_name}
                    </option>
                  ))}
              </select>
              {newReq.skills.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {newReq.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {skill.name}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveSkillFromRequirement(skill.id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Count</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={newReq.count}
                  onChange={(e) =>
                    setNewReq({ ...newReq, count: parseInt(e.target.value) })
                  }
                  placeholder="Count"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleConfirmRequirement}
                  className="p-2 bg-black text-white rounded-lg hover:bg-green-600 transition-colors"
                  title="Confirm requirement"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={handleClearRequirement}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Clear fields"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Engineer Selection Card */}
          {showEngineerCard && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="text-sm font-medium mb-3 text-blue-800">
                Assign Engineers
              </h4>
              <div className="mb-3">
                <select
                  onChange={(e) => {
                    const engineerId = parseInt(e.target.value);
                    if (engineerId) {
                      handleAddEngineerToNewReq(engineerId);
                      e.target.value = "";
                    }
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select Engineer</option>
                  {assignableEngineers &&
                    assignableEngineers
                      .filter((eng) => !newReqEngineers.includes(eng.id))
                      .map((eng) => (
                        <option key={eng.id} value={eng.id}>
                          {eng.name}
                        </option>
                      ))}
                </select>
              </div>

              {newReqEngineers.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {newReqEngineers.map((engineerId) => {
                    const engineer = filteredEngineers.find(
                      (eng) => eng.id === engineerId
                    );
                    return (
                      <span
                        key={engineerId}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {engineer?.name || "Unknown Engineer"}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveEngineerFromNewReq(engineerId)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {showEngineerCard && (
            <Button
              type="button"
              onClick={handleAddRequirement}
              className="mb-4"
              disabled={isCreatingRequirement}
            >
              {isCreatingRequirement ? "Adding..." : "Add Requirement"}
            </Button>
          )}

          {/* Current Requirements */}
          <h3 className="text-md font-semibold mb-3 text-gray-800">
            Current Requirements
          </h3>
          {originalRequirements?.map((req, i) => {
            const designationName =
              designationsWithIds?.find((d) => d.id === req.designation_id)
                ?.name ||
              req.designation?.name ||
              "Unknown";

            const requiredCount = req.required_count || req.count;
            const assignedCount = req.projectAssignments?.length || 0;
            const isUnderStaffed = assignedCount < requiredCount;
            const isDeleting = deletingRequirements.has(req.id);
            const isAssigning = assigningToRequirements.has(req.id);

            return (
              <div
                key={req.id || i}
                className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">
                        {requiredCount} × {designationName}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isUnderStaffed
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {assignedCount}/{requiredCount} assigned
                      </span>
                    </div>

                    {/* Display assigned engineers */}
                    {req.projectAssignments?.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-600">
                          Assigned Engineers:{" "}
                        </span>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {req.projectAssignments.map((assignment) => (
                            <span
                              key={assignment.id}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            >
                              {assignment.user.name} ({assignment.user.user_id})
                              <button
                                type="button"
                                onClick={() =>
                                  handleUnassignEngineerFromProject(
                                    assignment.id
                                  )
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(req.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {isUnderStaffed && (
  <div className="mt-3 pt-3 border-t border-gray-200">
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Need {requiredCount - assignedCount} more engineer(s):
        </span>
        <select
          onChange={(e) => {
            const engineerId = parseInt(e.target.value);
            if (engineerId) {
              setSelectedEngineersForAssignment(prev => ({
                ...prev,
                [req.id]: [...(prev[req.id] || []), engineerId]
              }));
              e.target.value = "";
            }
          }}
          className="flex-1 max-w-xs px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isAssigningEngineer}
        >
          <option value="">Select Engineer to Assign</option>
          {availableEngineers
            ?.filter(
              (eng) =>
                eng.role.role_name === "ENGINEER" &&
                !req.projectAssignments?.some(
                  (pa) => pa.user.id === eng.id
                ) &&
                !(selectedEngineersForAssignment[req.id] || []).includes(eng.id)
            )
            .map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name} ({eng.user_id})
              </option>
            ))}
        </select>
      </div>

      {selectedEngineersForAssignment[req.id]?.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Selected Engineers to Assign:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedEngineersForAssignment(prev => ({
                  ...prev,
                  [req.id]: []
                }));
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex gap-1 flex-wrap mb-3">
            {selectedEngineersForAssignment[req.id].map((engineerId) => {
              const engineer = availableEngineers?.find(
                (eng) => eng.id === engineerId
              );
              return (
                <span
                  key={engineerId}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {engineer?.name} ({engineer?.user_id})
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEngineersForAssignment(prev => ({
                        ...prev,
                        [req.id]: (prev[req.id] || []).filter(id => id !== engineerId)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                const engineersToAssign = selectedEngineersForAssignment[req.id] || [];
                
                try {
                  for (const engineerId of engineersToAssign) {
                    await handleAssignEngineerToProject(engineerId, req.id);
                  }
                  
                  setSelectedEngineersForAssignment(prev => ({
                    ...prev,
                    [req.id]: []
                  }));
                  
                } catch (error) {
                  console.error("Error assigning engineers:", error);
                }
              }}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              disabled={isAssigningEngineer || !selectedEngineersForAssignment[req.id]?.length}
            >
              {isAssigningEngineer ? "Assigning..." : `Assign ${selectedEngineersForAssignment[req.id]?.length || 0} Engineer(s)`}
            </button>
            
            <span className="text-xs text-gray-600 self-center">
              {selectedEngineersForAssignment[req.id]?.length || 0} of {requiredCount - assignedCount} needed
            </span>
          </div>
        </div>
      )}

      {isAssigningEngineer && (
        <span className="text-xs text-gray-500">
          Assigning engineer(s)...
        </span>
      )}
    </div>
  </div>
)}
                {!isUnderStaffed && assignedCount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="text-sm">
                        ✓ Requirement fully satisfied
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {originalRequirements?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No requirements added yet</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProject;

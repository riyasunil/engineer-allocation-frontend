import React, { useState, useEffect } from "react";
import {
  Save,
  UserPlus,
  X,
  ChevronDown,
  Check,
  Code,
  User,
  Database,
  Cloud,
  Smartphone,
  Settings,
  Monitor,
  Server,
} from "lucide-react";
import { useGetSkillsQuery } from "@/api-service/skill/skill.api";
import { Designation, Skill } from "@/utils/types";

import { useGetDesignationQuery } from "@/api-service/designation/designation.api";
import { useAddEngineerMutation } from "@/api-service/user/user.api";

interface MultiSelectDropdownProps {
  field: "skills" | "designations";
  options: Array<{
    id: string | number;
    name: string;
    icon: React.ElementType;
  }>;
  label: string;
  placeholder: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: any;
}

const EngineerForm = ({
  mode = "add", // "add" or "edit"
  initialData = null,
  onSubmit = (submitData: { skills: string; designations: string; name: string; user_id: string; email: string; password: string; joined_at: string; experience: number; notes: string; }, p0: string) => {},
  onCancel = () => {},
}) => {
  const [formData, setFormData] = useState({
    name: "",
    user_id: "",
    email: "",
    password: "",
    joined_at: new Date().toISOString().split("T")[0],
    experience: 0,
    skills: [],
    designations: [],
    notes: "",
  });

  // API queries
  const {
    data: skillsData,
    isLoading: skillsLoading,
    error: skillsError,
  } = useGetSkillsQuery();

  const {
    data: designationsData,
    isLoading: designationsLoading,
    error: designationsError,
  } = useGetDesignationQuery();

  const [
    addEngineer,
    { isLoading: isAddingEngineer, error: addEngineerError },
  ] = useAddEngineerMutation();
  
  // Icon mapping for skills
  const getSkillIcon = (skillName: string) => {
    const iconMap = {
      VUEJS: Code,
      NEXTJS: Code,
      JAVASCRIPT: Code,
      TYPESCRIPT: Code,
      NODE: Server,
      PYTHON: Code,
      JAVA: Code,
      "C#": Code,
      FLUTTER: Smartphone,
      "HTML/CSS": Monitor,
      AWS: Cloud,
      AZURE: Cloud,
      "GOOGLE CLOUD": Cloud,
      DOCKER: Settings,
      KUBERNETES: Settings,
    };
    return iconMap[skillName as keyof typeof iconMap] || Code;
  };

  // Icon mapping for designations
  const getDesignationIcon = (designationName: string) => {
    const iconMap = {
      QA: User,
      DEVELOPER: Code,
      DESIGNER: Monitor,
    };
    return iconMap[designationName as keyof typeof iconMap] || User;
  };

  // Transform API data to options format
  const skillOptions =
    skillsData?.map((skill: Skill) => ({
      id: skill.skill_id,
      name: skill.skill_name,
      icon: getSkillIcon(skill.skill_name),
    })) || [];

  const designationOptions =
    designationsData?.map((designation: Designation) => ({
      id: designation.id,
      name: designation.name,
      icon: getDesignationIcon(designation.name),
    })) || [];

  type FormErrors = {
    name?: string;
    user_id?: string;
    email?: string;
    password?: string;
    role_id?: string;
    [key: string]: string | undefined;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [designationsDropdownOpen, setDesignationsDropdownOpen] =
    useState(false);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMultiSelectChange = (field: "skills" | "designations", optionName: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(optionName)
        ? prev[field].filter((item: string) => item !== optionName)
        : [...prev[field], optionName],
    }));
  };

  const removeSelectedItem = (field: "skills" | "designations", item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((selected: string) => selected !== item),
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.user_id.trim()) newErrors.user_id = "User ID is required";
    if (mode === "add" && !formData.password.trim())
      newErrors.password = "Password is required";
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        skills: formData.skills.join(", "),
        designations: formData.designations.join(", "),
      };
      onSubmit(submitData, "save");
    }
  };

  const handleSaveAndAddAnother = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        skills: formData.skills.join(", "),
        designations: formData.designations.join(", "),
      };
      onSubmit(submitData, "saveAndAdd");
      // Reset form for add mode
      if (mode === "add") {
        setFormData({
          name: "",
          user_id: "",
          email: "",
          password: "",
          joined_at: new Date().toISOString().split("T")[0],
          experience: 0,
          skills: [],
          designations: [],
          notes: "",
        });
        setErrors({});
      }
    }
  };


  const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    field,
    options,
    label,
    placeholder,
    isOpen,
    setIsOpen,
    isLoading,
    error,
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between ${
            isLoading ? "bg-gray-100 cursor-not-allowed" : ""
          } ${errors[field] ? "border-red-500" : "border-gray-300"}`}
        >
          <span className="text-gray-500">
            {isLoading
              ? "Loading..."
              : error
              ? "Error loading options"
              : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && !isLoading && !error && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => {
                const IconComponent = option.icon;
                const isSelected = formData[field].includes(option.name);
                return (
                  <div
                    key={option.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                      isSelected ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleMultiSelectChange(field, option.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${
                            isSelected ? "text-blue-600" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {option.name}
                      </span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected items count */}
      {formData[field].length > 0 && (
        <div className="mt-2">
          <span className="text-sm text-gray-600">
            {formData[field].length} selected
          </span>
        </div>
      )}

      {/* Selected items as tags */}
      {formData[field].length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {formData[field].map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
            >
              {item}
              <button
                type="button"
                onClick={() => removeSelectedItem(field, item)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">
          Failed to load {label.toLowerCase()}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "edit" ? "Edit Engineer" : "Add New Engineer"}
            </h1>
            <p className="text-gray-600">
              {mode === "edit"
                ? "Update engineer profile information"
                : "Create a new engineer profile with complete information"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID *
                </label>
                <input
                  type="text"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  disabled={mode === "edit"}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    mode === "edit" ? "bg-gray-100 cursor-not-allowed" : ""
                  } ${errors.user_id ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter user ID"
                />
                {errors.user_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {mode === "add" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Professional Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joined Date
                </label>
                <input
                  type="date"
                  name="joined_at"
                  value={formData.joined_at}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter years of experience"
                />
              </div>

              <MultiSelectDropdown
                field="designations"
                options={designationOptions}
                label="Designations"
                placeholder="Select designations"
                isOpen={designationsDropdownOpen}
                setIsOpen={setDesignationsDropdownOpen}
                isLoading={designationsLoading}
                error={designationsError}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Skills and Expertise
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <MultiSelectDropdown
                field="skills"
                options={skillOptions}
                label="Technical Skills"
                placeholder="Select technical skills"
                isOpen={skillsDropdownOpen}
                setIsOpen={setSkillsDropdownOpen}
                isLoading={skillsLoading}
                error={skillsError}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes or comments"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          {mode === "add" && (
            <button
              type="button"
              onClick={handleSaveAndAddAnother}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save & Add Another
            </button>
          )}
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === "edit" ? "Update Engineer" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngineerForm;
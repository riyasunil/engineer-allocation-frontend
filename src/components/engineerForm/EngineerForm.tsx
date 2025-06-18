import React, { useState, useEffect, useRef } from "react";
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
import { Designation, Skill, UserData } from "@/utils/types";
import { useGetSkillsQuery } from "@/api-service/skill/skill.api";
import { useGetDesignationQuery } from "@/api-service/designation/designation.api";
import { useAddEngineerMutation } from "@/api-service/user/user.api";
import { useNavigate } from "react-router-dom";

interface SelectedOption {
  id: string | number;
  name: string;
  icon: React.ElementType;
}

interface MultiSelectDropdownProps {
  field: "skill_id" | "designation_id";
  options: SelectedOption[];
  label: string;
  placeholder: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: any;
}

interface FormData {
  name: string;
  user_id: string;
  email: string;
  password: string;
  joined_at: string;
  experience: number;
  skill_id: SelectedOption[];
  designation_id: SelectedOption[];
  notes: string;
}

type FormErrors = {
  name?: string;
  user_id?: string;
  email?: string;
  password?: string;
  skills?: string;
  designations?: string;
  [key: string]: string | undefined;
};

interface EngineerFormProps {
  mode?: "add" | "edit";
  initialData?: any;
}

const EngineerForm: React.FC<EngineerFormProps> = ({
  mode = "add",
  initialData = null,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    user_id: "",
    email: "",
    password: "",
    joined_at: new Date().toISOString().split("T")[0],
    experience: 0,
    skill_id: [],
    designation_id: [],
    notes: "",
  });

  const navigate = useNavigate();

  // Refs for dropdown containers
  const skillsDropdownRef = useRef<HTMLDivElement>(null);
  const designationsDropdownRef = useRef<HTMLDivElement>(null);

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
  const getSkillIcon = (skillName: string): React.ElementType => {
    const iconMap: Record<string, React.ElementType> = {
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
    return iconMap[skillName] || Code;
  };

  // Icon mapping for designations
  const getDesignationIcon = (designationName: string): React.ElementType => {
    const iconMap: Record<string, React.ElementType> = {
      QA: User,
      DEVELOPER: Code,
      DESIGNER: Monitor,
    };
    return iconMap[designationName] || User;
  };

  // Transform API data to options format
  const skillOptions: SelectedOption[] =
    skillsData?.map((skill: Skill) => ({
      id: skill.skill_id,
      name: skill.skill_name,
      icon: getSkillIcon(skill.skill_name),
    })) || [];

  const designationOptions: SelectedOption[] =
    designationsData
      ?.filter((designation: Designation) => designation.id !== undefined)
      .map((designation: Designation) => ({
        id: designation.id as number,
        name: designation.name,
        icon: getDesignationIcon(designation.name),
      })) || [];

  const [errors, setErrors] = useState<FormErrors>({});
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [designationsDropdownOpen, setDesignationsDropdownOpen] =
    useState(false);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close skills dropdown if clicked outside
      if (
        skillsDropdownRef.current &&
        !skillsDropdownRef.current.contains(event.target as Node)
      ) {
        setSkillsDropdownOpen(false);
      }

      // Close designations dropdown if clicked outside
      if (
        designationsDropdownRef.current &&
        !designationsDropdownRef.current.contains(event.target as Node)
      ) {
        setDesignationsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? parseInt(value) || 0 : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMultiSelectChange = (
    field: "skill_id" | "designation_id",
    optionName: string
  ) => {
    setFormData((prev) => {
      const currentItems = prev[field];
      const isSelected = currentItems.some((item) => item.name === optionName);

      if (isSelected) {
        // Remove the item
        return {
          ...prev,
          [field]: currentItems.filter((item) => item.name !== optionName),
        };
      } else {
        // Add the item
        const newItem =
          field === "skill_id"
            ? skillOptions.find((opt) => opt.name === optionName)
            : designationOptions.find((opt) => opt.name === optionName);

        if (newItem) {
          return {
            ...prev,
            [field]: [...currentItems, newItem],
          };
        }
        return prev;
      }
    });
  };

  const removeSelectedItem = (
    field: "skill_id" | "designation_id",
    itemName: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((selected) => selected.name !== itemName),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.user_id.trim()) newErrors.user_id = "User ID is required";
    if (mode === "add" && !formData.password.trim())
      newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onCancel = () => {
    // Handle cancel logic here
    console.log("Cancel clicked");
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const userData: UserData = {
          user_id: formData.user_id,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          joined_at: new Date(formData.joined_at),
          experience: formData.experience,
          role_id: 2,
          skill_id: formData.skill_id
            .map((skill) => skill.id)
            .filter((id): id is number => typeof id === "number"),
          designation_id: formData.designation_id
            .map((designation) => designation.id)
            .filter((id): id is number => typeof id === "number"),
        };

        if (mode === "add") {
          console.log(userData);
          const result = await addEngineer(userData);
          if (result.data) {
            alert("Engineer created successfully");
            navigate(-1);
          }
        } else if (mode === "edit") {
          // Handle edit logic here
          console.log("Edit mode - update logic needed");
        }
      } catch (error) {
        console.error("Error adding engineer:", error);
      }
    }
  };

  const handleSaveAndAddAnother = async () => {
    if (validateForm()) {
      if (mode === "add") {
        try {
          const userData: UserData = {
            user_id: formData.user_id,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            joined_at: new Date(formData.joined_at),
            experience: formData.experience,
            role_id: 2,
            skill_id: formData.skill_id
              .map((skill) => skill.id)
              .filter((id): id is number => typeof id === "number"),
            designation_id: formData.designation_id
              .map((designation) => designation.id)
              .filter((id): id is number => typeof id === "number"),
          };

          const result = await addEngineer(userData);
          if (result.data) {
            alert("Engineer created successfully");
            // Reset form for next entry
            setFormData({
              name: "",
              user_id: "",
              email: "",
              password: "",
              joined_at: new Date().toISOString().split("T")[0],
              experience: 0,
              skill_id: [],
              designation_id: [],
              notes: "",
            });
            setErrors({});
          }
        } catch (error) {
          console.error("Error adding engineer:", error);
        }
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
    <div
      className="relative"
      ref={field === "skill_id" ? skillsDropdownRef : designationsDropdownRef}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
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
                const isSelected = formData[field].some(
                  (item) => item.name === option.name
                );
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
              key={`${field}-${item.id}`}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
            >
              {item.name}
              <button
                type="button"
                onClick={() => removeSelectedItem(field, item.name)}
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
                field="designation_id"
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
                field="skill_id"
                options={skillOptions}
                label="Technical Skills"
                placeholder="Select technical skills"
                isOpen={skillsDropdownOpen}
                setIsOpen={setSkillsDropdownOpen}
                isLoading={skillsLoading}
                error={skillsError}
              />

              {/*
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
              */}
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
              disabled={isAddingEngineer}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isAddingEngineer ? "Saving..." : "Save & Add Another"}
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isAddingEngineer}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isAddingEngineer
              ? "Saving..."
              : mode === "edit"
              ? "Update Engineer"
              : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngineerForm;

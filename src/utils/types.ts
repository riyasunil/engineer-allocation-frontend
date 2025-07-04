// Base interface for entities extending AbstractEntity
interface AbstractEntity {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// User related interfaces
export interface User extends AbstractEntity {
  user_id: string;
  name: string;
  email: string;
  password: string;
  joined_at?: Date;
  experience?: number;
  role: Role;
  userSkills?: UserSkill[];
  managedProjects?: Project[];
  leadProjects?: Project[];
  projectUsers?: ProjectUser[];
  notes?: Note[];
  designations?: UserDesignation[];
}

export interface UserData {
  user_id: string,
  name: string,
  email: string,
  password?: string,
  joined_at: Date,
  experience: number,
  role_id: number,
  skill_id: number[],
  designation_id: number[],
}


export interface UserDesignation extends AbstractEntity {
  user: User;
  designation: Designation;
}

export interface UserSkill extends AbstractEntity {
  user: User;
  skill: Skill;
}

// Designation interface
export interface Designation extends AbstractEntity {
  name: string;
  userDesignations?: UserDesignation[];
  requirements?: ProjectEngineerRequirement[];
  projectAssignments?: ProjectUser[];
}

// Role interface
export interface Role extends AbstractEntity {
  role_id: number;
  role_name: string;
  users?: User[];
}

// Skill interface
export interface Skill extends AbstractEntity {
  skill_id: number;
  skill_name: string;
  userSkills?: UserSkill[];
  requirementSkills?: ProjectEngineerRequirementSkill[];
}

// Project related interfaces
export interface Project extends AbstractEntity {
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pm: User;
  lead: User;
  projectUsers?: ProjectUser[];
  notes?: Note[];
  requirements?: ProjectEngineerRequirement[];
}

export interface ProjectUser extends AbstractEntity {
  project: Project;
  user: User;
  is_shadow: boolean;
  assigned_on?: Date;
  end_date?: Date;
  designation: Designation;
  designation_id?: number;
}

export interface ProjectEngineerRequirement extends AbstractEntity {
  project: Project;
  designation: Designation;
  required_count: number;
  is_requested: boolean;
  requirementSkills?: ProjectEngineerRequirementSkill[];
}

export interface ProjectEngineerRequirementSkill extends AbstractEntity {
  requirement: ProjectEngineerRequirement;
  skill: Skill;
}


// Note interface (for responses)
export interface Note {
  id?: number; // Optional in case it's not included in all responses
  projectId: string;
  authorId: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  author?: User; // Optional populated user
  project?: Project; // Optional populated project
}

// DTO for creating a note (matches CreateNoteDto in backend)
export interface CreateNoteDto {
  projectId: string;
  authorId: string;
  content: string;
}

// DTO for updating a note (matches UpdateNoteDto in backend)
export interface UpdateNoteDto {
  projectId?: string;
  authorId?: string;
  content?: string;
}

// Utility interfaces for API responses (without sensitive data)
export interface UserPublic extends Omit<User, 'password'> {}

export interface UserBasic {
  id: number;
  user_id: string;
  name: string;
  email: string;
  experience?: number;
  role: Role;
}

export interface ProjectBasic {
  id: number;
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pm: UserBasic;
  lead: UserBasic;
}

export interface AlertRequest {
  id: number;
  project: string;
  requester: string;
  roleNeeded: string;
  quantity: number;
  skills: string[];
  dueDate: string;
  requestedDate: string;
  priority: Priority;
  justification: string;
  unread: boolean;
}
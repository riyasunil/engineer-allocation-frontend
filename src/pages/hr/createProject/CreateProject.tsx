import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCreateProjectMutation } from '@/api-service/projects/projects.api';
import { useGetDesignationQuery } from '@/api-service/designation/designation.api';

interface ProjectRequirement {
  designation: string;
  designation_id: number;
  skills: string[];
  count: number;
}
interface ProjectRequirementDto {
  designation_id: number;
  required_count: number;
  is_requested: boolean;
}

interface CreateProjectDto {
  project_id: string;
  name: string;
  startdate?: string;
  enddate?: string;
  status?: string;
  pmId: number;
  leadId: number;
  requirements?: ProjectRequirementDto[];
}

const dummyEmployees = [
  { id: 20, name: 'Alice Johnson' },
  { id: 8, name: 'Bob Smith' },
  { id: 23, name: 'Charlie Davis' },
  { id: 25, name: 'Diana White' }
];

// const designationsWithIds = [
//   { id: 1, name: 'Developer' },
//   { id: 2, name: 'QA' },
//   { id: 3, name: 'DevOps' },
//   { id: 4, name: 'Intern' }
// ];

const skills = ['React', 'Node.js', 'PostgreSQL', 'Cypress', 'AWS','TypeScript', 'Docker', 'MongoDB'];
const projectStatuses = ['NEW', 'IN PROGRESS', 'CLOSED'];

const CreateProject = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data:designationsWithIds} = useGetDesignationQuery({});
  console.log(designationsWithIds)
  

  const [formData, setFormData] = useState<CreateProjectDto>({
    project_id: '',
    name: '',
    startdate: '',
    enddate: '',
    status: '',
    pmId: 0,
    leadId: 0,
    requirements: [],
  });

  const [newReq, setNewReq] = useState<ProjectRequirement>({ designation: '', designation_id: 0, skills: [], count: 1 });
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['pmId', 'leadId'].includes(name) ? parseInt(value) : value
    }));
  };

  const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedDesignation = designationsWithIds?.find(d => d.id === parseInt(e.target.value));
      setNewReq(prev => ({
        ...prev,
        designation: selectedDesignation?.name || '',
        designation_id: selectedDesignation?.id || 0
      }));
};


   const handleAddSkillToRequirement = () => {
    if (selectedSkill && !newReq.skills.includes(selectedSkill)) {
      setNewReq(prev => ({
        ...prev,
        skills: [...prev.skills, selectedSkill]
      }));
      setSelectedSkill('');
    }
  };

  const handleRemoveSkillFromRequirement = (skill: string) => {
    setNewReq(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleAddRequirement = () => {
    if (newReq.designation && newReq.designation_id && newReq.count > 0) {
      const requirementDto: ProjectRequirementDto = {
        designation_id: newReq.designation_id,
        required_count: newReq.count,
        is_requested: false
    };
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementDto]
      }));
      setNewReq({ designation: '', designation_id: 0, skills: [], count: 1 });
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id || !formData.name ||  !formData.pmId || !formData.leadId) {
      alert('Please fill in all required fields (Project ID, Name, PM, and Lead)');
      return;
    }
    try {

    const createProjectDto: CreateProjectDto = {
      project_id: formData.project_id,
      name: formData.name,
      startdate: formData.startdate,
      enddate: formData.enddate,
      status: formData.status,
      pmId: formData.pmId,
      leadId: formData.leadId,
      requirements: formData.requirements.length > 0 ? formData.requirements : undefined
    };

    const response = await createProject(createProjectDto).unwrap();
    alert(response.message || 'Project created successfully');
    navigate('/hr/projects');
  } catch (error: any) {
    console.error('Error creating project:', error);
    alert(error?.data?.message || 'Failed to create project');
  }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground">Define project details, assign leads, and set requirements</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Project Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium mb-2">Project ID<span className="text-red-500">*</span></label>
              <input 
                name="project_id" 
                value={formData.project_id} 
                onChange={handleChange} 
                required 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Project Name<span className="text-red-500">*</span></label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Start Date</label>
              <input 
                type="date" 
                name="startdate" 
                value={formData.startdate} 
                onChange={handleChange} 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">End Date</label>
              <input 
                type="date" 
                name="enddate" 
                value={formData.enddate} 
                onChange={handleChange} 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                required
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              >
                <option value="">Select Status</option>
                {projectStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Management Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium mb-2">Project Manager<span className="text-red-500">*</span></label>
              <select 
                name="pmId" 
                value={formData.pmId} 
                onChange={handleChange} 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required
              >
                <option value="">Select Project Manager</option>
                {dummyEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Team Lead<span className="text-red-500">*</span></label>
              <select 
                name="leadId" 
                value={formData.leadId} 
                onChange={handleChange} 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required
              >
                <option value="">Select Team Lead</option>
                {dummyEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {/* Project Requirements Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Requirements<span className="text-gray-400" >(Optional)</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select 
                value={newReq.designation_id} 
                onChange={handleDesignationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Role</option>
                {designationsWithIds.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Required Skill</label>
              <div className="flex gap-2">
              <select 
                value={selectedSkill} 
                onChange={e => setSelectedSkill( e.target.value )} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Skill</option>
                {skills.filter(s => !newReq.skills.includes(s)).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
              </select>
              <Button type="button" onClick={handleAddSkillToRequirement} size="sm">+</Button>
            </div>
            {newReq.skills.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {newReq.skills.map((skill, i) => (
                    <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkillFromRequirement(skill)} className="text-red-500 hover:text-red-700">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Count</label>
              <input
                type="number"
                min={1}
                value={newReq.count}
                onChange={e => setNewReq({ ...newReq, count: parseInt(e.target.value) })}
                placeholder="Count"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <Button type="button" onClick={handleAddRequirement} className="mb-4">Add Requirement</Button>
              {formData.requirements.map((req, i) => {
          // Find designation name for display
                const designationName = designationsWithIds.find(d => d.id === req.designation_id)?.name || 'Unknown';
                return (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-sm">
                      {req.required_count} × {designationName} {req.is_requested ? '(Requested)' : '(Not Requested)'}
                    </span>
                    <button onClick={() => handleRemoveRequirement(i)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  </div>
                );
          })}
        </div>


        {/* Form Actions */}
        <div className="flex gap-4 pt-3">
          <Button type="submit" className="w-48">{isLoading ? 'Creating...' : 'Create Project'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/hr/projects')} className="w-48">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
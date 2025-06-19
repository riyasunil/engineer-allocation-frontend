import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCreateProjectMutation } from '@/api-service/projects/projects.api';
import { useGetDesignationQuery } from '@/api-service/designation/designation.api';
import { useGetSkillsQuery } from '@/api-service/skill/skill.api';
import { useGetAllAvailableUsersQuery } from '@/api-service/user/user.api';
import { toast } from 'sonner';

interface ProjectRequirement {
  designation: string;
  designation_id: number;
  skills: Skill[];
  count: number;
}
interface ProjectRequirementDto {
  designation_id: number;
  required_count: number;
  is_requested: boolean;
  requirement_skills: Skill[]; 
}

interface Skill{
  id: number | undefined;
  skill_id: number;
  skill_name: string;
}

interface CreateProjectDto {
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pmId: number;
  leadId: number;
  requirements?: ProjectRequirementDto[];
}

const CreateProject = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: designationsWithIds } = useGetDesignationQuery();
  const { data: skillsWithIds } = useGetSkillsQuery();
  const {data: availableUsers}= useGetAllAvailableUsersQuery();
  
  
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<CreateProjectDto>({
    project_id: '',
    name: '',
    startdate: undefined,
    enddate: undefined,
    status: 'New',
    pmId: 0,
    leadId: 0,
    requirements: [],
  });

  const [newReq, setNewReq] = useState<ProjectRequirement>({ designation: '', designation_id: 0, skills: [], count: 1});
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['pmId', 'leadId'].includes(name) ? 
        parseInt(value) : 
        ['startdate', 'enddate'].includes(name) ? (value ? new Date(value) : undefined) : value
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

  const handleAddSkillToRequirement = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const skillId = parseInt(e.target.value);
  if (skillId) {
    const selectedSkillData = skillsWithIds?.find(s => s.id === skillId);
    if (selectedSkillData && !newReq.skills.some(skill => skill.skill_id === skillId)) {
      const newSkill: Skill = {
        id: selectedSkillData.id, 
        skill_id: selectedSkillData.skill_id,
        skill_name: selectedSkillData.skill_name
      };
      setNewReq(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      console.log(newReq)
    }
  }
  };

  const handleRemoveSkillFromRequirement = (skillId: number | undefined) => {
    setNewReq(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId)
    }));
  };

  const handleClearRequirement = () => {
    setNewReq({ designation: '', designation_id: 0, skills: [], count: 1 });
    setSelectedSkill('');
  };

  const handleAddRequirement = () => {
    if (!newReq.designation || !newReq.designation_id) {
    toast.error('Please select a role before adding requirement');
    return;
  }
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), {
        designation_id: newReq.designation_id,
        required_count: newReq.count,
        is_requested: false,
        requirement_skills: newReq.skills
      }]
    }));

    setNewReq({ designation: '', designation_id: 0, skills: [], count: 1 });
    setSelectedSkill('');
  toast.success('Requirement added successfully');
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index)
    }));
    toast.info('Requirement Removed')
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id || !formData.name || !formData.pmId || !formData.leadId) {
      alert('Please fill in all required fields (Project ID, Name, PM, and Lead)');
      return;
    }
    console.log("in submit" , formData)
    try {
      const response = await createProject(formData).unwrap();
      toast.success('Project created successfully')
      navigate('/hr/projects');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error('Error creating project')
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
         <h2 className="text-lg font-bold mb-6 text-gray-900 border-b border-gray-100 pb-2">Project Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-base font-medium mb-2">Project Name<span className="text-red-500">*</span></label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Project ID<span className="text-red-500">*</span></label>
              <input 
                name="project_id" 
                value={formData.project_id} 
                onChange={handleChange} 
                required 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Start Date</label>
              <input 
                type="date" 
                name="startdate" 
                value={formData.startdate ? formData.startdate.toISOString().split('T')[0] : ''} 
                onChange={handleChange}
                min={today}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">End Date</label>
              <input 
                type="date" 
                name="enddate" 
                value={formData.enddate ? formData.enddate.toISOString().split('T')[0] : ''} 
                onChange={handleChange}
                min={formData.startdate ? new Date(formData.startdate.getTime() + 86400000) .toISOString().split('T')[0] : today}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
              />
            </div>
            
          </div>
        </div>

        {/* Project Management Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-6 text-gray-900 border-b border-gray-100 pb-2">Project Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium mb-2">Project Manager<span className="text-red-500">*</span></label>
              <select 
                name="pmId" 
                value={formData.pmId} 
                onChange={handleChange} 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                required
              >
                <option value="">Select Project Manager</option>
                {availableUsers?.filter(user => user.id!==formData.leadId).map(emp => (
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
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                required
              >
                <option value="">Select Team Lead</option>
                {availableUsers?.filter(user=>user.id!==formData.pmId).map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Requirements Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-6 text-gray-900 border-b border-gray-100 pb-2">Project Requirements<span className="text-gray-400 font-normal">(Optional)</span></h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select 
                value={newReq.designation_id} 
                onChange={handleDesignationChange}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select Role</option>
                {designationsWithIds?.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Required Skill</label>
              <select 
                value={selectedSkill} 
                onChange={handleAddSkillToRequirement} 
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white">
                <option value="">Select Skill</option>
                {skillsWithIds?.filter(s => !newReq.skills.some(skill => skill.skill_id === s.id)).map(s => (
                  <option key={s.id} value={s.id}>{s.skill_name}</option>
                ))}
              </select>
              {newReq.skills.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {newReq.skills.map((skill, i) => {
                    
                    return (
                      <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {skill.skill_name}
                        <button type="button" onClick={() => handleRemoveSkillFromRequirement(skill.id)} className="text-red-500 hover:text-red-700">×</button>
                      </span>
                    );
                  })}
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
                  onChange={e => setNewReq({ ...newReq, count: parseInt(e.target.value) })}
                  placeholder="Count"
                  className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"

                />
                <button 
                  type="button" 
                  onClick={handleAddRequirement}
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

          
          
          {formData.requirements?.slice().reverse().map((req, i) => {
            // Find designation name for display
            const designationName = designationsWithIds?.find(d => d.id === req.designation_id)?.name || 'Unknown';
            
            return (
              <div key={i} className="bg-white border border-gray-300 p-4 rounded-lg flex justify-between items-center mb-3 shadow-sm">
                <div className="flex-1">
                  <span className="text-sm font-medium">
                     {designationName} - {req.required_count}
                  </span>
                  {req.requirement_skills.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 font-medium">Skills: </span>
                      <span className="text-sm text-gray-800">{req.requirement_skills.map(skill => skill.skill_name).join(', ')}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => handleRemoveRequirement(formData.requirements!.length - 1 - i)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
            );
          })}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-3">
          <Button type="submit" className="w-48">{isLoading ? 'Creating...' : 'Create Project'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/hr/projects')} className="w-48 border-2 font-semibold">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
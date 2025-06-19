import React, { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCreateProjectMutation } from '@/api-service/projects/projects.api';
import { useGetDesignationQuery } from '@/api-service/designation/designation.api';
import { useGetSkillsQuery } from '@/api-service/skill/skill.api';
import { useParams } from 'react-router-dom';
import { useGetProjectByIdQuery } from '@/api-service/projects/projects.api';
import { userApi } from '@/api-service/user/user.api';
import { useGetEngineersQuery } from '@/api-service/user/user.api';

interface ProjectRequirement {
  designation: string;
  designation_id: number;
  skills: string[];
  count: number;
  engineers: number[];
}
interface ProjectRequirementDto {
  designation_id: number;
  required_count: number;
  is_requested: boolean;
  engineers?: number[];
}

interface CreateProjectDto {
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pmId: number;
  leadId: number;
  requirements?: any[];
}

const dummyEngineers = [
  { id: 101, name: 'John Doe' },
  { id: 102, name: 'Jane Smith' },
  { id: 103, name: 'Mike Wilson' },
  { id: 104, name: 'Sarah Connor' },
  { id: 105, name: 'Tom Hardy' },
  { id: 106, name: 'Emma Watson' }
];

const projectStatuses = ['NEW', 'IN PROGRESS', 'CLOSED'];

const EditProject = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: designationsWithIds } = useGetDesignationQuery();
  const { data: skillsWithIds } = useGetSkillsQuery();

  const { id } = useParams();
  const { data: project, isLoading: projectLoading, error: projectError } = useGetProjectByIdQuery(id!, {
      skip: !id
    });

  console.log(project)

  const { data: engineers = [], isEngineerLoading, error } = useGetEngineersQuery();
  const filteredEngineers = engineers.filter((user) => user.role.role_name === "ENGINEER");
  
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  
  const [formData, setFormData] = useState<CreateProjectDto>({
    project_id: '' ,
    name:'',
    startdate: undefined,
    enddate: undefined,
    status: '',
    pmId: 0,
    leadId: 0,
    requirements: [],
  });

  useEffect(()=>{

    if (project) {
      setFormData({
        project_id: project.project_id || '',
        name: project.name || '',
        startdate: project.startdate ? new Date(project.startdate) : undefined,
        enddate: project.enddate ? new Date(project.enddate) : undefined,
        status: project.status || '',
        pmId: project.pm?.id || 0,
        leadId: project.lead?.id || 0,
        requirements: project.requirements || [],
      });
    }

  },[project])


  // const [formData, setFormData] = useState(project)

  const [newReq, setNewReq] = useState<ProjectRequirement>({ designation: '', designation_id: 0, skills: [], count: 1, engineers: [] });
  const [selectedSkill, setSelectedSkill] = useState('');
  const [requirementEngineers, setRequirementEngineers] = useState<{[key: number]: number[]}>({});
  const [showEngineerCard, setShowEngineerCard] = useState(false);
  const [newReqEngineers, setNewReqEngineers] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['pmId', 'leadId'].includes(name) ? parseInt(value) : 
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

  const handleConfirmRequirement = () => {
    if (newReq.designation && newReq.designation_id && newReq.count > 0) {
      setShowEngineerCard(true);
    }
  };

  const handleClearRequirement = () => {
    setNewReq({ designation: '', designation_id: 0, skills: [], count: 1, engineers: [] });
    setSelectedSkill('');
    setShowEngineerCard(false);
    setNewReqEngineers([]);
  };

  const handleAddRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), {
        designation_id: newReq.designation_id,
        required_count: newReq.count,
        is_requested: false,
        engineers: newReqEngineers
      }]
    }));
    setNewReq({ designation: '', designation_id: 0, skills: [], count: 1, engineers: [] });
    setShowEngineerCard(false);
    setNewReqEngineers([]);
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index)
    }));
  };

  const handleAddEngineerToNewReq = (engineerId: number) => {
    if (!newReqEngineers.includes(engineerId)) {
      setNewReqEngineers(prev => [...prev, engineerId]);
    }
  };

  const handleRemoveEngineerFromNewReq = (engineerId: number) => {
    setNewReqEngineers(prev => prev.filter(id => id !== engineerId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id || !formData.name || !formData.pmId || !formData.leadId) {
      alert('Please fill in all required fields (Project ID, Name, PM, and Lead)');
      return;
    }
    try {
      const response = await createProject(formData).unwrap();
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
        <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
        <p className="text-muted-foreground">Update project details, assign leads, and set requirements</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Project Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
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
              <label className="block text-base font-medium mb-2">Start Date</label>
              <input 
                type="date" 
                name="startdate" 
                value={formData.startdate ? formData.startdate.toISOString().split('T')[0] : ''} 
                onChange={handleChange}
                min={today}
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">End Date</label>
              <input 
                type="date" 
                name="enddate" 
                value={formData.enddate ? formData.enddate.toISOString().split('T')[0] : ''} 
                onChange={handleChange}
                min={formData.startdate ? formData.startdate.toISOString().split('T')[0] : today}
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
                {filteredEngineers.map(emp => (
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
                {filteredEngineers.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Requirements Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select 
                value={newReq.designation_id} 
                onChange={handleDesignationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                onChange={e => {
                  const value = e.target.value;
                  setSelectedSkill(value);
                  if (value && !newReq.skills.includes(value)) {
                    setNewReq(prev => ({
                      ...prev,
                      skills: [...prev.skills, value]
                    }));
                    setSelectedSkill('');
                  }
                }} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Skill</option>
                {skillsWithIds?.filter(s => !newReq.skills.includes(s.skill_name)).map(s => (
                  <option key={s.id} value={s.id}>{s.skill_name}</option>
                ))}
              </select>
              {newReq.skills.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {newReq.skills.map((skillId, i) => {
                    const skillName = skillsWithIds?.find(s => s.id === parseInt(skillId))?.skill_name || skillId;
                    return (
                      <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {skillName}
                        <button type="button" onClick={() => handleRemoveSkillFromRequirement(skillId)} className="text-red-500 hover:text-red-700">×</button>
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

          {showEngineerCard && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="text-sm font-medium mb-3 text-blue-800">Assign Engineers</h4>
              <div className="mb-3">
                <select 
                  onChange={e => {
                    const engineerId = parseInt(e.target.value);
                    if (engineerId) {
                      handleAddEngineerToNewReq(engineerId);
                      e.target.value = ''; // Reset selection
                    }
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select Engineer</option>
                  {filteredEngineers
                    .filter(eng => !newReqEngineers.includes(eng.id))
                    .map(eng => (
                      <option key={eng.id} value={eng.id}>{eng.name}</option>
                    ))}
                </select>
              </div>
              
              {newReqEngineers.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {newReqEngineers.map(engineerId => {
                    const engineer = filteredEngineers.find(eng => eng.id === engineerId);
                    return (
                      <span key={engineerId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {engineer?.name || 'Unknown Engineer'}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveEngineerFromNewReq(engineerId)} 
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
            <Button type="button" onClick={handleAddRequirement} className="mb-4">Add Requirement</Button>
          )}

          <p>Current Requirements</p>
          
          {formData.requirements?.map((req, i) => {
            // Find designation name for display
            const designationName = designationsWithIds?.find(d => d.id === req.designation_id)?.name || 'Unknown';
            const assignedEngineers = req.engineers || [];
            
            return (
              <div key={i} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-2">
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    {req.required_count} × {req.designation.name}
                  </span>

                  {req.projectAssignments.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-600">Engineers: </span>
                      {req.projectAssignments.map((usr) => {

                        return usr.user.name;
                      }).filter(Boolean).join(', ')}

                      

                    </div>
                  )}


                  {/* {assignedEngineers.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-600">Engineers: </span>
                      {assignedEngineers.map(engineerId => {
                        const engineer = dummyEngineers.find(eng => eng.id === engineerId);
                        return engineer?.name;
                      }).filter(Boolean).join(', ')}
                    </div>
                  )} */}
                </div>
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

export default EditProject;
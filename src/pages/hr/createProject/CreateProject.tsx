import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProjectRequirement {
  role: string;
  skills: string;
  count: number;
}

interface AssignedEngineer {
  id: number;
  designation: string;
}

interface CreateProjectFormData {
  project_id: string;
  name: string;
  startdate?: string;
  enddate?: string;
  status?: string;
  pmId: number;
  leadId: number;
  techStack: string[];
  requirements: ProjectRequirement[];
  engineers: AssignedEngineer[];
}

const dummyEmployees = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Davis' },
  { id: 4, name: 'Diana White' }
];

const roles = ['Frontend Developer', 'Backend Developer', 'QA Engineer', 'DevOps Engineer'];
const skills = ['React', 'Node.js', 'PostgreSQL', 'Cypress', 'AWS'];
const designations = ['Developer', 'QA', 'DevOps', 'Intern'];

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateProjectFormData>({
    project_id: '',
    name: '',
    startdate: '',
    enddate: '',
    status: '',
    pmId: 0,
    leadId: 0,
    techStack: [],
    requirements: [],
    engineers: []
  });

  const [techInput, setTechInput] = useState('');
  const [newReq, setNewReq] = useState<ProjectRequirement>({ role: '', skills: '', count: 1 });
  const [selectedEngineerId, setSelectedEngineerId] = useState<number>(0);
  const [selectedEngineerDesignation, setSelectedEngineerDesignation] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['pmId', 'leadId'].includes(name) ? parseInt(value) : value
    }));
  };

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (tech && !formData.techStack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, tech]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleAddRequirement = () => {
    if (newReq.role && newReq.count > 0) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newReq]
      }));
      setNewReq({ role: '', skills: '', count: 1 });
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleAddEngineer = () => {
    if (selectedEngineerId && selectedEngineerDesignation) {
      setFormData(prev => ({
        ...prev,
        engineers: [...prev.engineers, {
          id: selectedEngineerId,
          designation: selectedEngineerDesignation
        }]
      }));
      setSelectedEngineerId(0);
      setSelectedEngineerDesignation('');
    }
  };

  const handleRemoveEngineer = (id: number) => {
    setFormData(prev => ({
      ...prev,
      engineers: prev.engineers.filter(engineer => engineer.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to create project');
      alert('Project created successfully');
      navigate('/projects');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="max-w-5xl px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground">Define project details, assign leads, and set requirements</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium mb-2">Project ID</label>
            <input name="project_id" value={formData.project_id} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2">Project Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2">Start Date</label>
            <input type="date" name="startdate" value={formData.startdate} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2">End Date</label>
            <input type="date" name="enddate" value={formData.enddate} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2">Status</label>
            <input name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg" />
          </div>
        </div>

        {/* PM & Lead */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium mb-2">Project Manager</label>
            <select name="pmId" value={formData.pmId} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg" required>
              <option value="">Select Project Manager</option>
              {dummyEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium mb-2">Team Lead</label>
            <select name="leadId" value={formData.leadId} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg" required>
              <option value="">Select Team Lead</option>
              {dummyEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-base font-medium mb-2">Tech Stack</label>
          <div className="flex gap-2">
            <input
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              placeholder="e.g., React"
              className="w-full px-4 py-2 border border-border rounded-lg flex-1"
            />
            <Button type="button" onClick={handleAddTech}>Add</Button>
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            {formData.techStack.map((tech, i) => (
              <span key={i} className="bg-gray-200 text-sm px-2 py-1 rounded-lg flex items-center gap-1">
                {tech}
                <button type="button" onClick={() => handleRemoveTech(tech)} className="text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Project Requirements */}
        <div>
          <label className="block text-base font-medium mb-2">Project Requirements</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select value={newReq.role} onChange={e => setNewReq({ ...newReq, role: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg">
                <option value="">Select Role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Required Skill</label>
              <select value={newReq.skills} onChange={e => setNewReq({ ...newReq, skills: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg">
                <option value="">Select Skill</option>
                {skills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Count</label>
              <input
                type="number"
                min={1}
                value={newReq.count}
                onChange={e => setNewReq({ ...newReq, count: parseInt(e.target.value) })}
                placeholder="Count"
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>
          <Button type="button" onClick={handleAddRequirement} className="mt-3">Add Requirement</Button>
          <ul className="mt-4 space-y-2">
            {formData.requirements.map((req, i) => (
              <li key={i} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                <span>{req.count} × {req.role} ({req.skills})</span>
                <button onClick={() => handleRemoveRequirement(i)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Engineers */}
        <div>
          <label className="block text-base font-medium mb-2">Assign Engineers</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Engineer</label>
              <select value={selectedEngineerId} onChange={e => setSelectedEngineerId(parseInt(e.target.value))} className="w-full px-4 py-2 border border-border rounded-lg">
                <option value="">Select Engineer</option>
                {dummyEmployees
                  .filter(emp => !formData.engineers.find(e => e.id === emp.id))
                  .map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Designation</label>
              <select value={selectedEngineerDesignation} onChange={e => setSelectedEngineerDesignation(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg">
                <option value="">Select Designation</option>
                {designations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <Button type="button" onClick={handleAddEngineer} className="mt-3">Add Engineer</Button>
          <ul className="mt-4 space-y-2">
            {formData.engineers.map(({ id, designation }) => {
              const emp = dummyEmployees.find(e => e.id === id);
              return (
                <li key={id} className="bg-gray-100 p-2 rounded-lg flex justify-between items-center">
                  <span>{emp?.name} — {designation}</span>
                  <button onClick={() => handleRemoveEngineer(id)} className="text-red-500">Remove</button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-3">
          <Button type="submit" className="w-48">Create Project</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/projects')} className="w-48">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
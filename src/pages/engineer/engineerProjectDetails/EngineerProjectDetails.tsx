import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EngineerProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual API call later
  const project = {
    id: '1',
    name: 'E-Commerce Platform',
    status: 'IN_PROGRESS' as const,
    duration: '3 months',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    requiredEngineers: 5,
    assignedEngineers: 4,
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    description: 'Building a comprehensive e-commerce platform with modern tech stack including user authentication, payment processing, inventory management, and admin dashboard.',
    assignments: [
      {
        id: '1',
        engineer: { id: '1', name: 'John Doe', role: 'Lead Developer' },
        role: 'Project Lead',
        startDate: '2024-01-15',
        isShadow: false
      },
      {
        id: '2',
        engineer: { id: '2', name: 'Jane Smith', role: 'Frontend Developer' },
        role: 'Frontend Developer',
        startDate: '2024-01-16',
        isShadow: false
      },
      {
        id: '3',
        engineer: { id: '3', name: 'Mike Johnson', role: 'Backend Developer' },
        role: 'Backend Developer',
        startDate: '2024-01-16',
        isShadow: false
      },
      {
        id: '4',
        engineer: { id: '4', name: 'Sarah Wilson', role: 'Junior Developer' },
        role: 'Frontend Developer',
        startDate: '2024-02-01',
        isShadow: true
      }
    ],
    notes: [
      {
        id: '1',
        date: '2024-02-15',
        author: 'John Doe',
        content: 'Initial API integration completed. Payment gateway integration is taking longer than expected due to additional security requirements.'
      },
      {
        id: '2',
        date: '2024-03-01',
        author: 'Jane Smith',
        content: 'UI components are progressing well. Need to discuss responsive design requirements for mobile views.'
      }
    ]
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/engineer/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">Project Details & Team Overview</p>
          </div>
        </div>
      </div>

      {/* Project Overview + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium">{project.duration}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Timeline</span>
              <span className="text-sm font-medium">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team Size</span>
              <span className="text-sm font-medium">
                {project.assignedEngineers} / {project.requiredEngineers} Engineers
              </span>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className="text-xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-xl font-bold">{project.assignedEngineers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Team Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                    {assignment.engineer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{assignment.engineer.name}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.role}</p>
                  </div>
                  {assignment.isShadow && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                      Shadow
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">{formatDate(assignment.startDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Notes & Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.notes.map((note) => (
              <div key={note.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{note.author}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(note.date)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{note.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineerProjectDetails;

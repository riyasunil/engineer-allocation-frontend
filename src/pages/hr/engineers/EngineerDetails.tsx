import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, Star, Calendar, ArrowLeft, Mail, Edit } from 'lucide-react';
import { useGetUserByIdQuery } from '@/api-service/user/user.api';

// Custom color palette
const profileColors = [
  '#FF204E',
  '#A0153E',
  '#5D0E41',
  '#00224D'
];

const getProfileColor = (name: string) => {
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % profileColors.length;
  return profileColors[index];
};

const EngineerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: engineerData, isLoading, error: engineerError } = useGetUserByIdQuery(id!);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/engineers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading engineer details...</p>
        </div>
      </div>
    );
  }

  if (engineerError || !engineerData) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/engineers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading engineer details. Please try again.</p>
        </div>
      </div>
    );
  }

  // Debug logging (remove in production)
  console.log('Engineer Data:', engineerData);
  console.log('Project Users:', engineerData.projectUsers);

  // Process current projects - simplified since project data is already available
  const currentProjects = (engineerData.projectUsers || []).map((projectUser: any, index: number) => {
    // The project data is already available in projectUser.project
    const project = projectUser.project;
    
    if (!project) {
      console.warn(`No project data for projectUser ${index}:`, projectUser);
      return null;
    }

    return {
      id: project.project_id || project.id || `project_${index}`,
      name: project.name || 'Unknown Project',
      role: projectUser.requirement?.designation?.name || 
            projectUser.designation?.designation?.name || 
            projectUser.designation?.name || 
            projectUser.role || 
            'Developer',
      startDate: projectUser.assigned_on || 
                projectUser.assignedOn || 
                project.startdate || 
                project.startDate || 
                new Date().toISOString(),
      status: project.status || 'Active'
    };
  }).filter(Boolean); // Remove any null entries

  // Transform engineer data
  const engineer = {
    id: engineerData.user_id,
    name: engineerData.name,
    email: engineerData.email,
    role: engineerData.designations?.[0]?.designation?.name || 'Engineer',
    experience: engineerData.experience ? `${engineerData.experience} years` : 'N/A',
    skills: engineerData.userSkills?.map((skill: any) => skill.skill.skill_name) || [],
    strengths: engineerData.userSkills?.slice(0, 3).map((skill: any) => skill.skill.skill_name) || [],
    currentProjects: currentProjects,
    availability: currentProjects.length >= 2 ? 'FULLY_ALLOCATED' : 'AVAILABLE',
    allocations: currentProjects.length,
    maxProjects: 2
  };

  // Optional: Remove these logs in production
  // console.log('Final engineer object:', engineer);
  // console.log('Current projects count:', engineer.currentProjects.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN PROGRESS':
        return 'default';
      case 'NEW':
        return 'secondary';
      case 'CLOSED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'FULLY_ALLOCATED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const profileColor = getProfileColor(engineer.name);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/engineers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{engineer.name}</h1>
            <p className="text-muted-foreground">Engineer Profile Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/hr/engineers/${engineer.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: profileColor }}
              >
                <span className="text-2xl font-bold text-white">
                  {engineer.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{engineer.name}</h3>
              <p className="text-sm text-muted-foreground">{engineer.role}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{engineer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{engineer.experience} experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{engineer.allocations}/{engineer.maxProjects} Projects</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-medium mb-2">Availability Status</h4>
              <Badge className={getAvailabilityColor(engineer.availability)}>
                {engineer.availability.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Strengths */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {engineer.skills.length > 0 ? (
                  engineer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed</p>
                )}
              </div>
            </div>
            
            {engineer.strengths.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Key Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {engineer.strengths.map((strength) => (
                    <Badge key={strength} variant="outline">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Current Availability</h4>
              <p className="text-sm text-muted-foreground">
                {engineer.availability === 'AVAILABLE' 
                  ? `Available for ${engineer.maxProjects - engineer.allocations} more project(s)`
                  : 'Currently at maximum project capacity'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Current Projects ({engineer.currentProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {engineer.currentProjects.length > 0 ? (
            <div className="space-y-4">
              {engineer.currentProjects.map((project, index) => (
                project ? (
                  <div key={project.id || index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Role: {project.role} • Started: {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No current projects assigned</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineerDetails;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, Users, Plus, ArrowLeft, Pencil, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useGetNotesByProjectIdQuery,
  useUpdateNoteMutation,
  useCreateNoteMutation,
  useDeleteNoteMutation
} from '@/api-service/notes/notes.api';
import { useGetProjectByIdQuery } from '@/api-service/projects/projects.api';

interface ProjectDetailsProps {
  source: 'HR' | 'ENGINEER';
  authorId: string;
  backUrl: string;
  canAddNote?: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  source,
  authorId,
  backUrl,
  canAddNote = true
}) => {
  const { id } = useParams(); // This is the numeric database ID
  const navigate = useNavigate();

  // Fetch project data using the numeric ID
  const { data: project, isLoading: projectLoading, error: projectError } = useGetProjectByIdQuery(id!, {
    skip: !id
  });

  // Extract the project_id (string) from the fetched project data
  const projectId = project?.project_id;

  // Fetch notes using the project_id (string)
  const { data: notes = [], isLoading: notesLoading } = useGetNotesByProjectIdQuery(projectId!, {
    skip: !projectId
  });

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [newNote, setNewNote] = useState('');
  const [addNoteLoading, setAddNoteLoading] = useState(false);

  const handleEdit = (noteId: number, content: string) => {
    setEditingNoteId(noteId);
    setEditedContent(content);
  };

  const handleCancel = () => {
    setEditingNoteId(null);
    setEditedContent('');
  };

  const handleSave = async (noteId: number) => {
    if (!projectId) return;
    
    await updateNote({
      projectId: projectId,
      noteId,
      data: { content: editedContent }
    });
    setEditingNoteId(null);
  };

  const handleDelete = async (noteId: number) => {
    if (!projectId) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote({ projectId: projectId, noteId });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !projectId) return;

    setAddNoteLoading(true);

    try {
      await createNote({
        projectId: projectId,
        data: {
          projectId: projectId,
          authorId,
          content: newNote.trim(),
        },
      }).unwrap();

      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
      alert('Error adding note');
    } finally {
      setAddNoteLoading(false);
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateDaysRemaining = (endDate: string | Date | undefined | null) => {
    if (!endDate) return 'N/A';
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateDuration = (startDate: string | Date | undefined, endDate: string | Date | undefined | null) => {
    if (!startDate) return 'N/A';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}${days > 0 ? ` ${days} day${days > 1 ? 's' : ''}` : ''}`;
    }
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  // Loading states
  if (projectLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (projectError || !project) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(backUrl)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Project not found or failed to load.</p>
        </div>
      </div>
    );
  }

  // Get assigned engineers count (if available in project data)
  const assignedEngineers = project.projectUsers?.length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(backUrl)}
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

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Project ID</span>
              <span className="text-sm font-medium">{project.project_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {project.status ? project.status.replace('_', ' ') : 'In Progress'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium">
                {calculateDuration(project.startdate, project.enddate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Timeline</span>
              <span className="text-sm font-medium">
                {formatDate(project.startdate)} - {project.enddate ? formatDate(project.enddate) : 'Ongoing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Team Size</span>
              <span className="text-sm font-medium">
                {assignedEngineers} Engineers
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Project Manager</span>
              <span className="text-sm font-medium">
                {project.pm?.name || 'Not assigned'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Project Lead</span>
              <span className="text-sm font-medium">
                {project.lead?.name || 'Not assigned'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="text-xl font-bold">
                  {project.enddate ? calculateDaysRemaining(project.enddate) : '∞'}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-xl font-bold">{assignedEngineers}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Assignments */}
      {project.projectUsers && project.projectUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.projectUsers.map((projectUser) => (
                <div key={projectUser.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {projectUser.user?.name
                        ? projectUser.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                        : 'N/A'}
                    </div>
                    <div>
                      <h4 className="font-medium">{projectUser.user?.name || 'Unknown'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {projectUser.designation?.name || 'Engineer'}
                      </p>
                    </div>
                    {projectUser.is_shadow && (
                      <span className="ml-3 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Shadow
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(projectUser.assigned_on)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Notes & Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {canAddNote && projectId && (
            <div className="mb-6 space-y-2">
              <textarea
                className="w-full border rounded p-2 text-sm"
                placeholder="Write a new note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={addNoteLoading}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {addNoteLoading ? 'Adding...' : 'Add Note'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {notesLoading ? (
              <p className="text-sm text-muted-foreground">Loading notes...</p>
            ) : notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes available for this project.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{note.author?.name || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">
                      {note.createdAt ? formatDate(note.createdAt) : ''}
                    </span>
                  </div>
                  {editingNoteId === note.id ? (
                    <>
                      <textarea
                        className="w-full border rounded p-2 text-sm"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => note.id !== undefined && handleSave(note.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
                      {note.author?.user_id === authorId && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => note.id !== undefined && handleEdit(note.id, note.content)}
                            title="Edit Note"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => note.id !== undefined && handleDelete(note.id)}
                            title="Delete Note"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
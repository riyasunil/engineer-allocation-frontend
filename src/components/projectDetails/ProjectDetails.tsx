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
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const { data: notes = [], isLoading } = useGetNotesByProjectIdQuery(projectId!, {
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
    await updateNote({
      projectId: projectId!,
      noteId,
      data: { content: editedContent }
    });
    setEditingNoteId(null);
  };

  const handleDelete = async (noteId: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote({ projectId: projectId!, noteId });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setAddNoteLoading(true);

    try {
      await createNote({
        projectId: projectId!,
        data: {
          projectId: projectId!,
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

  // Dummy project (replace with real fetched project later)
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
    description:
      'Building a comprehensive e-commerce platform with modern tech stack including user authentication, payment processing, inventory management, and admin dashboard.',
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
    notes: notes
  };

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
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium">{project.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Timeline</span>
              <span className="text-sm font-medium">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Team Size</span>
              <span className="text-sm font-medium">
                {project.assignedEngineers} / {project.requiredEngineers} Engineers
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium mt-4 mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mt-4 mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                  >
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
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="text-xl font-bold">45</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-xl font-bold">{project.assignedEngineers}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Team Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.assignments.map((assignment) => (
              <div key={assignment.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {assignment.engineer.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{assignment.engineer.name}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.role}</p>
                  </div>
                  {assignment.isShadow && (
                    <span className="ml-3 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
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
          {canAddNote && (
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
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading notes...</p>
            ) : (
              project.notes.map((note) => (
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

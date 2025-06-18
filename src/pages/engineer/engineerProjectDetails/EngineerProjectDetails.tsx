import { useParams } from "react-router-dom";
import ProjectDetails from '@/components/projectDetails/ProjectDetails';
import { useAppSelector } from "@/store/store";
import { useGetProjectByIdQuery } from "@/api-service/projects/projects.api";

const EngineerProjectDetailsPage = () => {
  const { id } = useParams(); // `id` from URL
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { data: project, isLoading, error } = useGetProjectByIdQuery(id!);

  const canAddNote = project &&
    (currentUser?.id === project.pm?.id || currentUser?.id === project.lead?.id);

  if (isLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (error || !project) {
    return <div className="p-6 text-red-600">Project not found or failed to load.</div>;
  }

  return (
    <ProjectDetails
      source="ENGINEER"
      authorId={currentUser.user_id}
      backUrl="/engineer/projects"
      canAddNote={canAddNote}
    />
  );
};

export default EngineerProjectDetailsPage;

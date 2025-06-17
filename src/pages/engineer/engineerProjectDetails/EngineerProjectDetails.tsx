import ProjectDetails from '@/components/projectDetails/ProjectDetails';

const EngineerProjectDetailsPage = () => {
  return (
    <ProjectDetails
      source="ENGINEER"
      authorId="KV12" // replace with actual logged-in engineer ID
      backUrl="/engineer/projects"
      canAddNote={true}
    />
  );
};

export default EngineerProjectDetailsPage;

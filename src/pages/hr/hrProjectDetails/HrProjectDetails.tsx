import ProjectDetails from "@/components/projectDetails/ProjectDetails";

const HrProjectDetailsPage = () => {
  return (
    <ProjectDetails
      source="HR"
      authorId="HR45" // replace with actual logged-in HR ID
      backUrl="/hr/projects"
      canAddNote={false} // HR cannot add notes here, for example
    />
  );
};

export default HrProjectDetailsPage;

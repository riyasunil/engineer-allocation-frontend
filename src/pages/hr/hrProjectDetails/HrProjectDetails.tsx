import ProjectDetails from "@/components/projectDetails/ProjectDetails";

const HrProjectDetails= () => {
  return (
    <ProjectDetails
      source="HR"
      authorId="HR45" // replace with actual logged-in HR ID
      backUrl="/hr/projects"
      canAddNote={true} // HR cannot add notes here, for example
    />
  );
};

export default HrProjectDetails;

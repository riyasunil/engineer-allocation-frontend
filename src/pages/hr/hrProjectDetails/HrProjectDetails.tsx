import ProjectDetails from "@/components/projectDetails/ProjectDetails";
import { useAppSelector } from "@/store/store";

const HrProjectDetails= () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  return (
    <ProjectDetails
      source="HR"
      authorId={currentUser.user_id}  // replace with actual logged-in HR ID
      backUrl="/hr/projects"
      canAddNote={true} // HR cannot add notes here, for example
    />
  );
};

export default HrProjectDetails;

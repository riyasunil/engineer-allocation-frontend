import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/pageHeader";
import { Button } from "@/components/ui/button";
import { Clock4, CheckCircle } from "lucide-react";
import { useGetUserByIdQuery } from "../../../api-service/user/user.api";
import { Project, ProjectUser } from "@/utils/types";
import SkeletonCard from "./SkeletonLoader";

const StatusBadge = ({ label }: { label: string }) => {
  const base = "text-xs px-2 py-0.5 rounded-full";
  switch (label) {
    case "IN_PROGRESS":
      return (
        <span className={`${base} bg-green-100 text-green-800`}>
          IN PROGRESS
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`${base} bg-gray-100 text-gray-800`}>✓ Completed</span>
      );
    case "Shadow":
      return (
        <span className={`${base} bg-muted text-muted-foreground`}>Shadow</span>
      );
    default:
      return (
        <span className={`${base} bg-slate-200 text-slate-700`}>{label}</span>
      );
  }
};



const ProjectList = () => {
  const { data, isLoading } = useGetUserByIdQuery("KV10");

  const filterProjects = (projects: Project[] = []) => {
    const currentProjects = projects.filter(
      (project) => project.enddate === null
    );
    const completedProjects = projects.filter(
      (project) => project.enddate !== null
    );
    return { currentProjects, completedProjects };
  };

  const filterEngineeringProjects = (userProjects: ProjectUser[] = []) => {
    console.log("passed", userProjects);
    const currentProjects = userProjects.filter(
      (entry) => entry.project?.enddate === null
    );

    console.log("currentprojects", currentProjects);

    const completedProjects = userProjects.filter(
      (entry) => entry.project?.enddate !== null
    );

    return { currentProjects, completedProjects };
  };

  const calculateProjectDuration = ({
    startdate,
    enddate,
  }: {
    startdate: Date | undefined;
    enddate: Date | undefined | null;
  }) => {
    if (!startdate) return "Not Started";
    const end =
      enddate === null || enddate === undefined
        ? new Date()
        : new Date(enddate);
    const start = new Date(startdate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
    return diffDays;
  };

  const getStatus = (enddate: Date | undefined) => {
    if (enddate === null || enddate === undefined) return "In Progress";
    return "Completed";
  };

  const getStatusTypeColor = (enddate: Date | undefined) => {
    if (enddate === undefined || enddate === null)
      return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const {
    currentProjects: currentManaging,
    completedProjects: completedManaged,
  } = filterProjects(data?.managedProjects);
  const { currentProjects: currentLeading, completedProjects: completedLead } =
    filterProjects(data?.leadProjects);
  const {
    currentProjects: currentEngineering,
    completedProjects: completedEngineering,
  } = filterEngineeringProjects(data?.projectUsers);

  const allCurrentProjects = [...currentManaging, ...currentLeading];

  const allCompletedProjects = [...completedManaged, ...completedLead];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Projects"
        description="View and manage your current and past projects"
      />

      {/* Status Overview */}
      <div className="flex justify-end gap-6 pr-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock4 className="w-4 h-4 text-green-600" />
          <span>{allCurrentProjects.length} Active</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-gray-500" />
          <span>{allCompletedProjects.length} Completed</span>
        </div>
      </div>

      {/* Current Projects */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold ">Current Projects</h2>
          {isLoading && <SkeletonCard />}
          {allCurrentProjects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 space-y-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex flex-row gap-2">
                    <h3 className="font-semibold text-base">{project.name}</h3>
                    <CardTitle
                      className={`text-xs ${getStatusTypeColor(
                        project?.enddate
                      )} py-0 px-3 rounded-xl border font-light flex justify-center items-center`}
                    >
                      {getStatus(project?.enddate)}
                    </CardTitle>
                  </div>

                  <p className="font-normal text-sm text-muted-foreground">
                    {project.project_id}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {/* <Badge variant="secondary">{project.role}</Badge>
                    {project.labels?.map((label) => (
                      <StatusBadge key={label} label={label} />
                    ))} */}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {/* {project.description} */}
              </p>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Started:</strong> {project?.startdate?.toString()}
                  <span className="ml-4">
                    <strong>Duration:</strong>{" "}
                    {calculateProjectDuration({
                      startdate: project?.startdate,
                      enddate: project?.enddate,
                    })}{" "}
                    days
                  </span>
                  {/* <span className="ml-4">
                    <strong>Team:</strong> {project.teamSize} members
                  </span> */}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {/* {project.tags.map((tag) => (
                  <span key={tag} className="bg-muted px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))} */}
              </div>
            </div>
          ))}

          {currentEngineering.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 space-y-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex flex-row gap-2">
                    <h3 className="font-semibold text-base">
                      {project.project.name}
                    </h3>
                    <CardTitle
                      className={`text-xs ${getStatusTypeColor(
                        project?.project.enddate
                      )} py-0 px-3 rounded-xl border font-light flex justify-center items-center`}
                    >
                      {getStatus(project?.project.enddate)}
                    </CardTitle>
                  </div>

                  <p className="font-normal text-sm text-muted-foreground">
                    {project.project.project_id}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {/* <Badge variant="secondary">{project.role}</Badge>
                    {project.labels?.map((label) => (
                      <StatusBadge key={label} label={label} />
                    ))} */}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {/* {project.description} */}
              </p>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Started:</strong>{" "}
                  {project?.project.startdate?.toString()}
                  <span className="ml-4">
                    <strong>Duration:</strong>{" "}
                    {calculateProjectDuration({
                      startdate: project.project?.startdate,
                      enddate: project.project?.enddate,
                    })}{" "}
                    days
                  </span>
                  {/* <span className="ml-4">
                    <strong>Team:</strong> {project.teamSize} members
                  </span> */}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {/* {project.tags.map((tag) => (
                  <span key={tag} className="bg-muted px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))} */}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Projects */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Past Projects</h2>
          {isLoading && <SkeletonCard />}

          {allCompletedProjects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 space-y-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base">{project.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <StatusBadge label="COMPLETED" />
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Started:</strong> {project?.startdate?.toString()}
                  <span className="ml-4">
                    <strong>Duration:</strong>{" "}
                    {calculateProjectDuration({
                      startdate: project?.startdate,
                      enddate: project?.enddate,
                    })}{" "}
                    days
                  </span>
                </p>
              </div>
            </div>
          ))}
          {completedEngineering.map((p) => (
            <div
              key={p.project?.id}
              className="border rounded-lg p-4 space-y-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base">{p?.project.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <StatusBadge label="COMPLETED" />
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Started:</strong> {p?.project?.startdate?.toString()}
                  <span className="ml-4">
                    <strong>Duration:</strong>{" "}
                    {calculateProjectDuration({
                      startdate: p?.project?.startdate,
                      enddate: p?.project?.enddate,
                    })}{" "}
                    days
                  </span>
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectList;

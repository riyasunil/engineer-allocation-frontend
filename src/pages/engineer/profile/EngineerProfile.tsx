import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/pageHeader";
import {
  PenLine,
  User,
  CalendarDays,
  Briefcase,
  FolderKanban,
} from "lucide-react";
import { useAppSelector } from "@/store/store";
import { useGetProjectsByUserIdQuery } from "@/api-service/projects/projects.api";
import ProfileLoader from "./ProfileLoader";
import { Key } from "react";

const EngineerProfile = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: activeProjects = [], isLoading } = useGetProjectsByUserIdQuery({
    userId: currentUser?.id,
    filter: "inprogress",
  });

  if (!currentUser) return <ProfileLoader />;

  const initials = currentUser.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedJoinDate = currentUser.joined_at
    ? new Date(currentUser.joined_at).toLocaleDateString()
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your professional information"
        buttonText="Edit Profile"
        ButtonIcon={PenLine}
        onButtonClick={() => console.log("Edit Profile")}
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Overview */}
        <Card className="w-full md:w-1/2 bg-slate-50 shadow-sm border border-slate-200">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 text-slate-700">
              <User className="w-5 h-5 text-slate-500" />
              <h2 className="text-xl font-semibold">Profile Overview</h2>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-20 h-20 rounded-full bg-slate-700 text-white flex items-center justify-center text-2xl font-bold shadow">
                {initials}
              </div>
              <h3 className="text-lg font-semibold text-slate-800">{currentUser.name}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <p className="text-sm text-slate-600">{currentUser.role?.role_name}</p>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" />
                <span>{currentUser.experience} years of experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-500" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="w-full md:w-1/2 bg-white shadow-sm border border-slate-200">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-800">Skills & Expertise</h2>
            <div>
              <p className="font-medium text-slate-700">Technical Skills</p>
              {currentUser.userSkills.length > 0 ? (
                <ul className="space-y-2 mt-3">
                  {currentUser.userSkills.map((s: {
                    skill: { id: Key; skill_name: string };
                    level: string;
                  }) => (
                    <li key={s.skill.id} className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">{s.skill.skill_name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {s.level}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm mt-2">
                  No skills added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Projects Section */}
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <FolderKanban className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold">Current Projects</h2>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          ) : activeProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              {activeProjects
                .filter((project: any) => typeof project.id === "number" && project.id !== undefined)
                .map((project: any) => (
                  <div key={project.id} className="border rounded-md p-4 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">{project.name}</h3>
                    <p className="text-sm text-slate-600">
                      Role: {project.role ?? "Contributor"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.startdate
                        ? new Date(project.startdate).toLocaleDateString()
                        : "Start date unknown"}{" "}
                      –{" "}
                      {project.enddate
                        ? new Date(project.enddate).toLocaleDateString()
                        : "Ongoing"}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No ongoing projects assigned.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineerProfile;

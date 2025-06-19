import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/pageHeader";
import {
  User,
  CalendarDays,
  Briefcase,
  FolderKanban,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useAppSelector } from "@/store/store";
import { useGetProjectsByUserIdQuery } from "@/api-service/projects/projects.api";
import ProfileLoader from "./ProfileLoader";
import { Key, useState } from "react";
import { useUpdateExperienceMutation } from "@/api-service/user/user.api";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/slices/userSlice";

const EngineerProfile = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [experienceValue, setExperienceValue] = useState("");

  const { data: activeProjects = [], isLoading } = useGetProjectsByUserIdQuery({
    userId: currentUser?.id,
    filter: "inprogress",
  });

  const [updateExperience] = useUpdateExperienceMutation();
  const dispatch = useDispatch();

  const handleEditExperience = () => {
    setExperienceValue(currentUser.experience.toString());
    setIsEditingExperience(true);
  };

  const handleSaveExperience = async () => {
    const result = await updateExperience({
      id: currentUser.id,
      experience: Number(experienceValue),
    });

    if (result.data) {
      dispatch(setCurrentUser(result.data)); // Set updated user in Redux
      setIsEditingExperience(false);
    }
  };
  

  const handleCancelEdit = () => {
    setIsEditingExperience(false);
    setExperienceValue("");
  };

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
              <h3 className="text-lg font-semibold text-slate-800">
                {currentUser.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentUser.email}
              </p>
              <p className="text-sm text-slate-600">
                {currentUser.role?.role_name}
              </p>
            </div>

            <div className="space-y-3 text-base text-slate-600">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-500" />
                {isEditingExperience ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      value={experienceValue}
                      onChange={(e) => setExperienceValue(e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Years"
                      autoFocus
                    />
                    <span>years of experience</span>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={handleSaveExperience}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{currentUser.experience} years of experience</span>
                    <button
                      onClick={handleEditExperience}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors ml-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-slate-500" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="w-full md:w-1/2 bg-white shadow-sm border border-slate-200">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Skills & Expertise
            </h2>
            <div>
              <p className="font-medium text-slate-700">Technical Skills</p>
              {currentUser.userSkills.length > 0 ? (
                <ul className="flex flex-wrap gap-3 mt-4">
                  {currentUser.userSkills.map(
                    (s: {
                      skill: { id: Key; skill_name: string };
                      level: string;
                    }) => (
                      <li
                        key={s.skill.id}
                        className="bg-slate-100 border border-slate-300 px-3 py-2 rounded-xl shadow-sm flex items-center gap-2 hover:bg-slate-200 transition-all"
                      >
                        <span className="text-sm font-medium text-slate-800">
                          {s.skill.skill_name}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${
                          s.level === "Expert"
                            ? "bg-green-200 text-green-800"
                            : s.level === "Intermediate"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                        >
                          {s.level}
                        </span>
                      </li>
                    )
                  )}
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
                .filter(
                  (project: any) =>
                    typeof project.id === "number" && project.id !== undefined
                )
                .map((project: any) => (
                  <div
                    key={project.id}
                    className="border rounded-md p-4 bg-slate-50"
                  >
                    <h3 className="font-semibold text-slate-800">
                      {project.name}
                    </h3>
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

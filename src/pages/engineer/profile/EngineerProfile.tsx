import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/pageHeader";
import { PenLine, User, CalendarDays, Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const userProfile = {
  initials: "JD",
  fullName: "John Doe",
  email: "john.doe@keyvalue.com",
  role: "Senior Developer",
  experience: "5 years experience",
  joinedDate: "March 15, 2020",
  activeProjects: 2,
  skills: [
    { name: "React", level: "Expert", color: "bg-green-200 text-green-800" },
    { name: "Node.js", level: "Advanced", color: "bg-blue-100 text-blue-800" },
    { name: "TypeScript", level: "Advanced", color: "bg-blue-100 text-blue-800" },
    { name: "PostgreSQL", level: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { name: "AWS", level: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
  ],
  strengths: ["Problem Solving", "Team Leadership", "Code Review"],
  interests: ["Machine Learning", "Cloud Architecture", "Mobile Development"],
  summary:
    "Experienced senior developer with 5 years in full-stack development. Passionate about building scalable applications and leading development teams. Currently working on 2 active projects and continuously expanding expertise in emerging technologies.",
};

const EngineerProfile = () => {
  const {
    initials,
    fullName,
    email,
    role,
    experience,
    joinedDate,
    activeProjects,
    skills,
    strengths,
    interests,
    summary,
  } = userProfile;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your professional information"
        buttonText="Edit Profile"
        ButtonIcon={PenLine}
        onButtonClick={() => console.log("Edit Profile")}
      />

      {/* Profile Overview and Skills */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Profile Overview */}
        <Card className="w-full md:w-1/2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Profile Overview</h2>
            </div>
            <div className="container flex flex-col justify-center items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted text-lg font-bold text-white">
                {initials}
              </div>
              <div>
                <h3 className="text-md font-semibold">{fullName}</h3>
                <p className="text-muted-foreground">{email}</p>
                <p className="text-sm">{role}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-accent-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Joined {joinedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>{activeProjects} Active Projects</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2">
              View My Projects
            </Button>
          </CardContent>
        </Card>

        {/* Skills & Expertise */}
        <Card className="w-full md:w-1/2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Skills & Expertise</h2>

            <div>
              <p className="font-medium">Technical Skills</p>
              <ul className="space-y-1 mt-2">
                {skills.map((skill) => (
                  <li key={skill.name} className="flex justify-between">
                    <span>{skill.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${skill.color}`}>
                      {skill.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">Professional Summary</h2>
          <p className="text-muted-foreground text-sm">{summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Update Skills</Button>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineerProfile;





//skills and interests section
//    <div>
//               <p className="font-medium">⭐ Strengths</p>
//               <div className="flex flex-wrap gap-2 mt-2 text-sm">
//                 {strengths.map((strength) => (
//                   <span key={strength} className="bg-muted px-2 py-1 rounded-md text-muted-foreground">
//                     {strength}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <p className="font-medium">Areas of Interest</p>
//               <div className="flex flex-wrap gap-2 mt-2 text-sm">
//                 {interests.map((interest) => (
//                   <span key={interest} className="bg-muted px-2 py-1 rounded-md text-muted-foreground">
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             </div>
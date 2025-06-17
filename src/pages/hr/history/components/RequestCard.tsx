import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { AuditLog } from "../History";

const users = [
  {
    id: 1,
    name: "Ria Sunil",
    role: "HR",
  },
  {
    id: 2,
    name: "Hritik Koshi",
    role: "PM",
  },
];

export default function RequestCard({ request }: { request: AuditLog }) {
  const getLogTypeColor = () => {
    if (request.action_type === "Project Created")
      return "bg-blue-100 text-green-800 border-green-200";
    if (request.action_type === "Employee Assigned")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (request.action_type === "Project Updated")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getActionUserDetails = (uid: number) => {
    return users.find((u) => u.id === uid);
  };

  return (
    <Card className="border-muted gap-y-2">
      <CardHeader className="flex flex-row items-start justify-between pb-2 pt-4 ">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          <CardTitle
            className={`text-sm ${getLogTypeColor()} py-0 px-3 rounded-xl border font-medium`}
          >
            {request.action_type}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          {request.timestamp.toDateString()}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 ">
        {/* add an author to audit log  */}
        <div className="flex flex-row items-start gap-x-4 text-sm max-w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 font-normal">
            HR
          </div>
          <div className="flex flex-col items-start">
            <p className="font-medium">
            {getActionUserDetails(request.actor_user_id)?.name}
          </p>
          <p className="font-normal text-muted-foreground text-xs">
            {getActionUserDetails(request.actor_user_id)?.role}
          </p>
          </div>
        </div>

        <div className="bg-muted text-wrap justify-start text-sm gap-y-2 px-2 py-2 rounded-md w-full">
          <p>{request.change_summary}</p>
        </div>
      </CardContent>

      <CardFooter className="gap-3"></CardFooter>
    </Card>
  );
}

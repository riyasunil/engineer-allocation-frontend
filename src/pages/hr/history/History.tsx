import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { PageHeader } from '@/components/ui/pageHeader'
import {  HistoryIcon } from 'lucide-react'
import React from 'react'
import RequestCard from './components/RequestCard'
import { FolderOpen } from 'lucide-react';

export interface AuditLog {
  id: number
  actor_user_id: number
  action_type: string
  timestamp: Date
  change_summary: string
}

const requests: AuditLog[] = [
  {
    id: 1,
    actor_user_id: 1,
    action_type: "Project Created",
    timestamp: new Date("2025-03-12T10:15:00"),
    change_summary: "Created project: E‑Commerce Platform"
  },
  {
    id: 2,
    actor_user_id: 2,
    action_type: "Employee Assigned",
    timestamp: new Date("2025-03-13T09:00:00"),
    change_summary: "Assigned Riya Sunil to E‑Commerce Platform"
  },
  {
    id: 3,
    actor_user_id: 1,
    action_type: "Project Updated",
    timestamp: new Date("2025-03-14T14:45:00"),
    change_summary: "Updated deadline for Healthcare CRM to 30th March"
  },
  {
    id: 4,
    actor_user_id: 2,
    action_type: "Employee Unassigned",
    timestamp: new Date("2025-03-15T11:30:00"),
    change_summary: "Removed Hritik Koshi from Inventory Dashboard project"
  }
];


const History = () => {
  return (
    <div className="space-y-6">
        <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">System History</h1>
          <p className="text-muted-foreground">
            Audit log of all system operations and changes
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 text-black rounded-xl"
        >
          <HistoryIcon className='h-4 w-4'/>
          {requests.length}&nbsp;Records
        </Button>
      </header>

       {/* Audit logs */}
      <div className="space-y-4 border border-muted p-4 rounded-md">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Audit Log
        </h2>

        <div className="space-y-6">
          {requests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default History
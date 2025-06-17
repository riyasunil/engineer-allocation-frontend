import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, BarChart3, Calendar, Edit, Plus, Building } from 'lucide-react';


interface HRProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  user_id: string;
  experience: number;
  joined_at: string;
}



const Profile = () => {
  const [profile] = useState<HRProfile>({
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@keyvalue.com',
    role: 'HR',
    user_id: 'KV08',
    experience: 8,
    joined_at: '2024-01-15'
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-primary-foreground/10 rounded-full flex items-center justify-center border-4 border-primary-foreground/20">
              <span className="text-4xl font-bold text-primary-foreground">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-primary-foreground/80 mb-2">{profile.role}</p>
              <p className="text-lg text-primary-foreground/70">{profile.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" size="lg">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="h-15 w-6" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 p-2 gap-8">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="text-lg font-semibold">{profile.user_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="text-lg font-semibold">{profile.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="text-lg font-semibold">{profile.joined_at}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl p-3">HR Management Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button className="h-24 flex-col gap-3 text-lg" size="lg">
                <Plus className="h-6 w-6" />
                Create New Project
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-3 text-lg" size="lg">
                <Users className="h-6 w-6" />
                Manage Engineers
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-3 text-lg" size="lg">
                <BarChart3 className="h-6 w-6" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, BarChart3, Calendar, Edit, Plus, Building } from 'lucide-react';
import { useAppSelector } from '@/store/store';
import { useNavigate } from 'react-router-dom';

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
  const data = useAppSelector((state) => state.user.currentUser);
  const navigate = useNavigate()

  const [profile] = useState<HRProfile>({
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role.role_name,
    user_id: data.user_id,
    experience: data.experience,
    joined_at: data.joined_at
  });

  return (
    <div className="min-h-screen ">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-black/30 backdrop-blur-sm"></div>
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 animate-fade-in">
            <div className="relative group">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-white/50">
                <span className="text-3xl font-bold text-white drop-shadow-lg">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            
            <div className="text-center lg:text-left flex-1 space-y-3">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                {profile.name}
              </h1>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-base font-medium border border-white/30">
                  <Building className="h-4 w-4 mr-2" />
                  {profile.role}
                </span>
                <span className="text-base text-white/90 font-medium">
                  {profile.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        {/* Professional Information Card */}
        <Card className="w-full shadow-md border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              <div className="p-2 bg-gradient-to-r from-gray-800 to-black rounded-lg shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-md">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Employee ID</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{profile.user_id}</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gradient-to-r from-gray-800 to-black rounded-lg shadow-md">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Experience</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{profile.experience} years</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gradient-to-r from-black to-gray-800 rounded-lg shadow-md">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Joined Date</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{profile.joined_at}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="w-full shadow-md border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              HR Management Actions
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Quick access to your most important tasks</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Button 
                variant="outline" 
                className="group relative h-24 flex-col gap-3 text-base font-semibold border-2 border-gray-300 hover:border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 dark:from-gray-800 dark:to-gray-900 dark:border-gray-600 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden" 
                size="lg" 
                onClick={() => navigate('../projects/create')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="p-1 w-6 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md mb-1 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  Create New Project
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="group relative h-24 flex-col gap-3 text-base font-semibold border-2 border-gray-300 hover:border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 dark:from-gray-800 dark:to-gray-900 dark:border-gray-600 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden" 
                size="lg" 
                onClick={() => navigate('../addengineer')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="p-1 w-6 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md mb-1 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors duration-300">
                    <Users className="h-5 w-5" />
                  </div>
                  Add Engineer
                </div>
              </Button>

              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
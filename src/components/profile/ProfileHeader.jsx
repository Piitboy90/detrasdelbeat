import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import SocialLinks from './SocialLinks';
import ProfileStats from './ProfileStats';
import { toHttps } from '@/utils/urlSecurity.js';

function ProfileHeader({ profile, isOwnProfile, stats }) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in-down">
      <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#FF6B35] to-orange-600 mb-6 shadow-xl">
        <div className="w-full h-full rounded-full bg-[#0F172A] p-1 overflow-hidden relative">
          {profile?.avatar_url ? (
            <img 
              src={toHttps(profile.avatar_url)} 
              alt={profile.username} 
              className="w-full h-full rounded-full object-cover" 
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#1E293B] flex items-center justify-center text-[#FF6B35] text-4xl font-bold">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
        @{profile?.username}
      </h1>
      
      {profile?.bio && (
        <p className="text-gray-400 max-w-lg mb-4 text-base leading-relaxed">
          {profile.bio}
        </p>
      )}

      <SocialLinks links={profile} />

      <div className="w-full max-w-md">
        <ProfileStats stats={stats} />
      </div>

      {isOwnProfile && (
        <Link to="/settings/profile">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white mt-2">
            <Settings className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        </Link>
      )}
    </div>
  );
}

export default ProfileHeader;
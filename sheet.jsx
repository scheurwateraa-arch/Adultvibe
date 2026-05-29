import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import moment from "moment";
import "moment/locale/nl";

moment.locale("nl");

export default function OnlineUserCard({ profile, onStartChat }) {
  // Check if offline (last active more than 1 hour ago)
  const isOffline = profile.last_active && 
    (Date.now() - new Date(profile.last_active).getTime()) > 3600000;
  
  const displayOnline = profile.is_online && !isOffline;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl overflow-hidden hover:border-pink-500/30 transition-all cursor-pointer group"
    >
      <div className="relative">
        {/* Photo */}
        <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
          {profile.avatar_url || profile.photos?.[0] ? (
            <img 
              src={profile.avatar_url || profile.photos[0]} 
              alt={profile.display_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <User className="w-16 h-16 text-gray-600" />
            </div>
          )}
          
          {/* Online indicator */}
          {displayOnline && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot"></span>
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white font-semibold text-lg">
                {profile.display_name}
                {profile.age && <span className="text-gray-400 font-normal">, {profile.age}</span>}
              </h3>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <MapPin className="w-3 h-3" />
                {profile.region}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                profile.gender === 'vrouw' ? 'border-pink-500 text-pink-400' :
                profile.gender === 'man' ? 'border-blue-500 text-blue-400' :
                'border-purple-500 text-purple-400'
              }`}
            >
              {profile.gender}
            </Badge>
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {profile.interests.slice(0, 3).map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-purple-500/20 text-purple-300 text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {profile.interests.length > 3 && (
                <Badge variant="secondary" className="bg-gray-700 text-gray-400 text-xs">
                  +{profile.interests.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Last active */}
          {!displayOnline && profile.last_active && (
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
              <Clock className="w-3 h-3" />
              {moment(profile.last_active).fromNow()}
            </div>
          )}

          {/* Chat button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onStartChat(profile);
            }}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all text-white font-semibold"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat Nu
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
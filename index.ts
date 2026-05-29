import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

export default function VisitorsPage() {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [visitorProfiles, setVisitorProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileId = localStorage.getItem('adultvibe_profile_id');
    if (!profileId) {
      navigate(createPageUrl("Home"));
      return;
    }
    loadData(profileId);
  }, []);

  const loadData = async (profileId) => {
    setLoading(true);
    const [myProfiles, visits] = await Promise.all([
      base44.entities.Profile.filter({ id: profileId }),
      base44.entities.ProfileVisit.filter({ visited_id: profileId }, '-created_date', 100)
    ]);

    setCurrentProfile(myProfiles[0]);
    setVisitors(visits);

    // Mark as seen
    for (const visit of visits.filter(v => !v.is_seen)) {
      await base44.entities.ProfileVisit.update(visit.id, { is_seen: true });
    }

    const visitorIds = visits.map(v => v.visitor_id);
    const allProfiles = await base44.entities.Profile.filter({
      id: { $in: visitorIds }
    });
    
    const profileMap = {};
    allProfiles.forEach(p => profileMap[p.id] = p);
    setVisitorProfiles(profileMap);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full px-3 py-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Profiel Bezoekers</h1>
          <p className="text-gray-400 text-sm">{visitors.length} profielbezoekers</p>
        </div>

        {visitors.length === 0 ? (
          <div className="text-center py-20">
            <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-300 mb-2">Nog geen bezoekers</h3>
            <p className="text-gray-500">Maak je profiel aantrekkelijker om bezoekers te krijgen!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visitors.map(visit => {
              const visitor = visitorProfiles[visit.visitor_id];
              if (!visitor) return null;
              return (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-pink-500/30 transition-all"
                >
                  <Avatar className="w-16 h-16 border-2 border-pink-500/50">
                    <AvatarImage src={visitor.avatar_url || visitor.photos?.[0]} />
                    <AvatarFallback className="bg-gray-800 text-pink-400">
                      {visitor.display_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg">
                      {visitor.display_name}, {visitor.age}
                    </h3>
                    <p className="text-gray-400 text-sm">{visitor.city || visitor.region}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Bezocht {moment(visit.created_date).fromNow()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(createPageUrl("ViewProfile") + `?userId=${visitor.id}`)}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 whitespace-nowrap"
                    >
                      Bekijk
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(createPageUrl("Chat") + `?userId=${visitor.id}`)}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 whitespace-nowrap"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
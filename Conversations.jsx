import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

export default function MatchesPage() {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [profiles, setProfiles] = useState({});
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
    const [myProfiles, allMatches] = await Promise.all([
      base44.entities.Profile.filter({ id: profileId }),
      base44.entities.Like.filter({ liker_id: profileId, is_match: true })
    ]);

    setCurrentProfile(myProfiles[0]);
    setMatches(allMatches);
    
    // Clear match notifications when viewing
    localStorage.setItem('adultvibe_matches_viewed', Date.now().toString());

    const matchIds = allMatches.map(l => l.liked_id);
    const allProfiles = await base44.entities.Profile.filter({
      id: { $in: matchIds }
    });
    
    const profileMap = {};
    allProfiles.forEach(p => profileMap[p.id] = p);
    setProfiles(profileMap);
    setLoading(false);
  };

  const MatchCard = ({ profile, match }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl overflow-hidden hover:border-pink-500/50 transition-all"
    >
      <div className="relative">
        <img
          src={profile.avatar_url || profile.photos?.[0]}
          alt={profile.display_name}
          className="w-full h-48 object-cover"
        />
        {profile.is_online && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full pulse-dot border-2 border-white"></div>
        )}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Heart className="w-3 h-3 fill-white" />
          Match!
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1">
          {profile.display_name}, {profile.age}
        </h3>
        <p className="text-gray-400 text-sm mb-1">{profile.city || profile.region}</p>
        <p className="text-gray-500 text-xs mb-3">
          Match sinds {moment(match.created_date).fromNow()}
        </p>
        <Button
          onClick={() => navigate(createPageUrl("Chat") + `?userId=${profile.id}`)}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Start Chat
        </Button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full px-3 py-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Je Matches</h1>
          <p className="text-gray-400 text-sm">{matches.length} wederzijdse matches</p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-300 mb-2">Nog geen matches</h3>
            <p className="text-gray-500">Like profielen om matches te krijgen!</p>
            <Button
              onClick={() => navigate(createPageUrl("Swipe"))}
              className="mt-4 bg-gradient-to-r from-pink-600 to-purple-600"
            >
              Start Swipen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {matches.map((match) => {
              const profile = profiles[match.liked_id];
              if (!profile) return null;
              return <MatchCard key={match.id} profile={profile} match={match} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
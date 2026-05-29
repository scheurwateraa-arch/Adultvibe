import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Heart, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

export default function LikesPage() {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [sentLikes, setSentLikes] = useState([]);
  const [receivedLikes, setReceivedLikes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");

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
    const [myProfiles, sent, received, allMatches] = await Promise.all([
      base44.entities.Profile.filter({ id: profileId }),
      base44.entities.Like.filter({ liker_id: profileId }),
      base44.entities.Like.filter({ liked_id: profileId }),
      base44.entities.Like.filter({ liker_id: profileId, is_match: true })
    ]);

    setCurrentProfile(myProfiles[0]);
    setSentLikes(sent);
    setReceivedLikes(received);
    setMatches(allMatches);

    // Mark received likes as seen when viewing this page
    for (const like of received.filter(l => !l.is_match)) {
      // This prevents badge from showing again after user has viewed
      await base44.entities.Like.update(like.id, { ...like });
    }

    // Load all related profiles
    const allLikeIds = [
      ...sent.map(l => l.liked_id),
      ...received.map(l => l.liker_id),
      ...allMatches.map(l => l.liked_id)
    ];
    const uniqueIds = [...new Set(allLikeIds)];
    
    const allProfiles = await base44.entities.Profile.filter({
      id: { $in: uniqueIds }
    });
    
    const profileMap = {};
    allProfiles.forEach(p => profileMap[p.id] = p);
    setProfiles(profileMap);
    setLoading(false);
  };

  const sortProfiles = (likes, profileMap) => {
    const profilesWithLikes = likes.map(like => ({
      like,
      profile: profileMap[like.liked_id || like.liker_id]
    })).filter(item => item.profile);

    if (sortBy === "recent") {
      return profilesWithLikes.sort((a, b) => 
        new Date(b.like.created_date) - new Date(a.like.created_date)
      );
    } else if (sortBy === "online") {
      return profilesWithLikes.sort((a, b) => 
        (b.profile.is_online ? 1 : 0) - (a.profile.is_online ? 1 : 0)
      );
    } else if (sortBy === "name") {
      return profilesWithLikes.sort((a, b) => 
        a.profile.display_name.localeCompare(b.profile.display_name)
      );
    }
    return profilesWithLikes;
  };

  const ProfileCard = ({ profile, showMatch = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl overflow-hidden hover:border-pink-500/50 transition-all cursor-pointer group"
      onClick={() => navigate(createPageUrl("ViewProfile") + `?userId=${profile.id}`)}
    >
      <div className="relative">
        <img
          src={profile.avatar_url || profile.photos?.[0]}
          alt={profile.display_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        />
        {profile.is_online && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full pulse-dot border-2 border-white"></div>
        )}
        {showMatch && (
          <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Heart className="w-3 h-3 fill-white" />
            Match!
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-lg">
          {profile.display_name}, {profile.age}
        </h3>
        <p className="text-gray-400 text-sm">{profile.city || profile.region}</p>
        {profile.short_description && (
          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{profile.short_description}</p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {profile.interests?.slice(0, 3).map(interest => (
            <span key={interest} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const sortedSent = sortProfiles(sentLikes, profiles);
  const sortedReceived = sortProfiles(receivedLikes, profiles);
  const sortedMatches = sortProfiles(matches, profiles);

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Likes
            </h1>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="recent">Meest Recent</option>
            <option value="online">Online Eerst</option>
            <option value="name">Op Naam</option>
          </select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 mb-6">
            <TabsTrigger value="received" className="data-[state=active]:bg-pink-600">
              Ontvangen ({receivedLikes.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-pink-600">
              Verzonden ({sentLikes.length})
            </TabsTrigger>
          </TabsList>

          {/* Received Likes */}
          <TabsContent value="received">
            {sortedReceived.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">Nog geen likes ontvangen</h3>
                <p className="text-gray-500">Maak je profiel aantrekkelijker!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedReceived.map(({ profile, like }) => (
                  <ProfileCard key={profile.id} profile={profile} showMatch={like.is_match} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sent Likes */}
          <TabsContent value="sent">
            {sortedSent.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">Nog geen likes verzonden</h3>
                <p className="text-gray-500">Start met liken op de Dashboard!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedSent.map(({ profile }) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
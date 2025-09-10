
import React, { useState, useEffect } from "react";
import { Activity } from "@/entities/Activity";
import { Button } from "@/components/ui/button";
import { Play, Clock, Star, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FreeActivities() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFreeActivities();
  }, []);

  const loadFreeActivities = async () => {
    try {
      const freeFullSong = await Activity.filter({ is_premium: false, category: 'full_songs' }, '', 1);
      const freeSongClip = await Activity.filter({ is_premium: false, category: 'song_clips' }, '', 1);
      
      const foundActivities = [];
      if (freeFullSong.length > 0) foundActivities.push(freeFullSong[0]);
      if (freeSongClip.length > 0) foundActivities.push(freeSongClip[0]);

      setActivities(foundActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
    setIsLoading(false);
  };

  const openActivity = (contentUrl) => {
    window.open(contentUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Try Our Free Activities</h2>
            <div className="w-24 h-1 bg-green-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="spotify-card rounded-2xl p-8 animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-xl mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Try Our Free Activities</h2>
          <div className="w-24 h-1 bg-green-400 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get a taste of our interactive music activities with these free samples
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {activities.map((activity) => (
            <div key={activity.id} className="spotify-card rounded-2xl overflow-hidden card-hover group">
              <div className="relative">
                {activity.image_url ? (
                  <img 
                    src={activity.image_url} 
                    alt={activity.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                    <Play className="w-16 h-16 text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-green-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    FREE
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-sm capitalize">
                    {activity.genre.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-3">{activity.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{activity.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {activity.duration || '10-15 min'}
                    </span>
                    <span className="capitalize">{activity.difficulty_level}</span>
                    <span className="capitalize">{activity.category.replace('_', ' ')}</span>
                  </div>
                </div>

                <Button
                  onClick={() => openActivity(activity.content_url)}
                  className="w-full spotify-green spotify-green-hover text-black font-semibold py-3 rounded-full group-hover:scale-105 transition-transform"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Activity
                </Button>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-16">
            <div className="spotify-card rounded-2xl p-12 inline-block">
              <Play className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No free activities yet</h3>
              <p className="text-gray-400">Check back soon for free sample activities!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

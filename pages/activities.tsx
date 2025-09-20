// pages/activities.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";
import Image from "next/image";
import { Play, Clock, Lock, Crown, Zap, Music2, Filter } from "lucide-react";

// Use your actual API URL
const API_BASE = "https://api.coolenglishmusic.com";

interface Activity {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  s3Prefix: string;
  category: string;
  genre: string;
  artist: string;
  isFree: boolean;
  tags: string[];
  featured?: boolean;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export default function ActivitiesPage() {
  const router = useRouter();
  const { isAuthenticated, isMember, isLoading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Activities");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [startingActivity, setStartingActivity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = ["All Activities", "Full Songs", "Song Clips"];
  const genres = ["All Genres", "Pop", "Rock", "Country", "Hip-Hop"];

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory, selectedGenre]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (selectedCategory !== "All Activities") {
        params.append("category", selectedCategory);
      }
      if (selectedGenre !== "All Genres") {
        params.append("genre", selectedGenre);
      }

      const url = params.toString() 
        ? `${API_BASE}/activities?${params.toString()}`
        : `${API_BASE}/activities`;

      console.log("Fetching from:", url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Activities data:", data);
      
      if (data.success) {
        setActivities(data.activities);
      } else {
        throw new Error(data.error || "Failed to fetch activities");
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      setError("Failed to load activities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartActivity = async (activity: Activity) => {
    // Free activities - direct link to CloudFront
    if (activity.isFree) {
      // Construct the CloudFront URL
      const activityUrl = `https://d1uqdf1080xgw5.cloudfront.net/${activity.s3Prefix}`;
      window.open(activityUrl, '_blank');
      return;
    }

    // Premium activities - check auth and membership
    if (!isAuthenticated) {
      // Store intended activity in session storage
      sessionStorage.setItem("intendedActivity", activity.id);
      router.push("/login?next=/activities");
      return;
    }

    if (!isMember) {
      // Redirect to pricing page
      router.push("/pricing");
      return;
    }

    // Grant access through Lambda (for premium content)
    try {
      setStartingActivity(activity.id);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        throw new Error("No authentication token");
      }

      // Call your grant endpoint
      const response = await fetch(
        `${API_BASE}/grant?activityId=${activity.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`
          },
          credentials: 'include'
        }
      );

      const data = await response.json();
      
      if (data.success && data.activityUrl) {
        window.open(data.activityUrl, '_blank');
      } else if (data.requiresSubscription) {
        router.push("/pricing");
      } else {
        alert("Failed to start activity. Please try again.");
      }
    } catch (error) {
      console.error("Failed to start activity:", error);
      alert("Failed to start activity. Please try again.");
    } finally {
      setStartingActivity(null);
    }
  };

console.log("All activities before filtering:", activities);
const freeActivities = activities.filter(a => a.isFree);
const premiumActivities = activities.filter(a => !a.isFree);
console.log("Free:", freeActivities, "Premium:", premiumActivities);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchActivities} 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Music Activities
        </h1>
        <p className="text-gray-400 mb-8">
          Explore our collection of interactive English learning activities
        </p>

        {/* Filters */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-green-500" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Filter Activities
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      cat === selectedCategory
                        ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Genre
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      genre === selectedGenre
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Music2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No activities found for the selected filters.</p>
          </div>
        ) : (
          <>
            {/* Free Activities */}
            {freeActivities.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Free Activities
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freeActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onStart={handleStartActivity}
                      isStarting={startingActivity === activity.id}
                      isFree={true}
                      isLocked={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Premium Activities */}
            {premiumActivities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Premium Activities
                  {!isMember && (
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      (Upgrade to access)
                    </span>
                  )}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onStart={handleStartActivity}
                      isStarting={startingActivity === activity.id}
                      isFree={false}
                      isLocked={!isMember}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Activity Card Component
function ActivityCard({ 
  activity, 
  onStart, 
  isStarting, 
  isFree, 
  isLocked = false 
}: {
  activity: Activity;
  onStart: (activity: Activity) => void;
  isStarting: boolean;
  isFree: boolean;
  isLocked?: boolean;
}) {
  return (
    <div className="group bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-900/70 transition-all hover:border-gray-700">
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
        {activity.thumbnail ? (
          <Image
            src={activity.thumbnail}
            alt={activity.title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Music2 className="w-16 h-16 text-gray-700" />
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          {isFree ? (
            <span className="bg-green-500 text-black text-xs font-bold px-2.5 py-1 rounded">
              FREE
            </span>
          ) : (
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold px-2.5 py-1 rounded">
              PREMIUM
            </span>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <span className="bg-black/50 backdrop-blur text-white text-xs px-2.5 py-1 rounded">
            {activity.genre}
          </span>
        </div>
        
        {activity.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-purple-600/80 backdrop-blur text-white text-xs px-2.5 py-1 rounded">
              Featured
            </span>
          </div>
        )}
        
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition">
          {activity.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{activity.artist}</p>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {activity.description}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="bg-gray-800 px-2 py-1 rounded">
            {activity.category}
          </span>
          {activity.tags && activity.tags.length > 0 && (
            <span className="text-gray-600">
              {activity.tags.slice(0, 2).join(", ")}
            </span>
          )}
        </div>

        <button
          onClick={() => onStart(activity)}
          disabled={isStarting}
          className={`w-full py-2.5 font-medium rounded-lg transition flex items-center justify-center gap-2 ${
            isLocked
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : isStarting
              ? "bg-gray-600 text-gray-300"
              : "bg-green-600 text-white hover:bg-green-500"
          }`}
        >
          {isStarting ? (
            <>Loading...</>
          ) : isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              Unlock with Premium
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Activity
            </>
          )}
        </button>
      </div>
    </div>
  );
}
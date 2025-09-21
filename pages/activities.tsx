// pages/activities.tsx
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { 
  Search, 
  Filter, 
  Music, 
  Video, 
  Mic, 
  Star, 
  Clock, 
  Users,
  Sparkles,
  TreePine,
  Baby,
  Globe,
  Zap,
  TrendingUp,
  Play,
  Lock,
  ChevronDown
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

interface Activity {
  id: string;
  title: string;
  artist: string;
  description: string;
  s3Prefix: string;
  thumbnail: string;
  category: string;
  genre: string;
  isFree: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: number;    // Timestamp for sorting
  updatedAt?: number;    // Timestamp
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [sortBy, setSortBy] = useState("title"); // "title", "artist", "newest", "popular"
  const [showFilters, setShowFilters] = useState(false);

  // Categories with icons and colors
  const categories = [
    { value: "all", label: "All Activities", icon: Globe, color: "bg-gray-500" },
    { value: "Full Songs", label: "Full Songs", icon: Music, color: "bg-purple-500" },
    { value: "Song Clips", label: "Song Clips", icon: Mic, color: "bg-blue-500" },
    { value: "Top 20", label: "Top 20 Hits", icon: TrendingUp, color: "bg-yellow-500" },
    { value: "Vocals Only", label: "Vocals Only", icon: Zap, color: "bg-pink-500" }
  ];

  // Expanded genres with more options
  const genres = [
    { value: "all", label: "All Genres", icon: Globe },
    { value: "Pop", label: "Pop", icon: Sparkles },
    { value: "Rock", label: "Rock", icon: Zap },
    { value: "Country", label: "Country", icon: Music },
    { value: "Hip-Hop", label: "Hip-Hop", icon: Mic },
    { value: "Kids", label: "Kids", icon: Baby },
    { value: "Holiday", label: "Holiday", icon: TreePine },
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/activities`);
      const data = await response.json();
      
      // Enhance activities with additional metadata
      const enhancedActivities = data.activities.map((activity: Activity) => ({
        ...activity,
        // Check if it's a holiday or kids song and update genre if needed
        genre: determineEnhancedGenre(activity)
      }));
      
      setActivities(enhancedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const determineEnhancedGenre = (activity: Activity): string => {
    const title = activity.title.toLowerCase();
    const artist = activity.artist.toLowerCase();
    
    // Check for holiday songs
    if (title.includes("christmas") || title.includes("halloween") || 
        title.includes("thanksgiving") || title.includes("holiday")) {
      return "Holiday";
    }
    
    // Check for kids songs
    if (title.includes("kids") || title.includes("children") || 
        artist.includes("kids") || artist.includes("disney")) {
      return "Kids";
    }
    
    // Return original genre
    return activity.genre;
  };

  // Advanced filtering logic
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Search filter (searches title, artist, description, and tags)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        activity.artist.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    // Genre filter
    if (selectedGenre !== "all") {
      filtered = filtered.filter(activity => activity.genre === selectedGenre);
    }

    // Free only filter
    if (showOnlyFree) {
      filtered = filtered.filter(activity => activity.isFree === "true");
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "artist":
          return a.artist.localeCompare(b.artist);
        case "newest":
          return (b.createdAt || 0) - (a.createdAt || 0);
        case "popular":
          // You could add a popularity metric here
          return 0;
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [activities, searchQuery, selectedCategory, selectedGenre, showOnlyFree, sortBy]);

  const handleStartActivity = async (activity: Activity) => {
    if (activity.isFree === "true") {
      // Free activity - grant access directly
      try {
        const response = await fetch(`/api/grant-access?prefix=${encodeURIComponent(activity.s3Prefix)}`);
        const data = await response.json();
        
        if (data.success && data.activityUrl) {
          window.open(data.activityUrl, '_blank');
        }
      } catch (error) {
        console.error("Error starting activity:", error);
      }
    } else {
      // Premium activity - check subscription
      router.push(`/activity/${activity.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header with Search */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by song, artist, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-full 
                       border border-white/20 focus:border-green-500 focus:outline-none
                       placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 
                         text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all
                              ${selectedCategory === cat.value 
                                ? `${cat.color} text-white shadow-lg` 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto px-4 py-2 bg-gray-800 text-gray-300 rounded-full 
                       hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Genre Filter */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg 
                             border border-white/20 focus:border-green-500 focus:outline-none"
                  >
                    {genres.map(genre => (
                      <option key={genre.value} value={genre.value}>{genre.label}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg 
                             border border-white/20 focus:border-green-500 focus:outline-none"
                  >
                    <option value="title">Title A-Z</option>
                    <option value="artist">Artist A-Z</option>
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* Free Only Checkbox */}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlyFree}
                      onChange={(e) => setShowOnlyFree(e.target.checked)}
                      className="w-4 h-4 rounded bg-gray-700 border-gray-600 
                               text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm">Free Activities Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            {searchQuery ? `Search Results (${filteredActivities.length})` : 
             selectedCategory !== "all" ? `${selectedCategory} (${filteredActivities.length})` :
             `All Activities (${filteredActivities.length})`}
          </h2>
          {(searchQuery || selectedCategory !== "all" || selectedGenre !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedGenre("all");
                setShowOnlyFree(false);
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden 
                       border border-white/10 hover:border-green-500/50 
                       transform hover:scale-105 transition-all duration-300
                       hover:shadow-xl hover:shadow-green-500/20"
            >
              {/* Thumbnail with badges */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-600 to-blue-600">
                <img
                  src={activity.thumbnail}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {activity.isFree === "true" && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      FREE
                    </span>
                  )}
                  
                  {activity.category === "Top 20" && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      TOP 20
                    </span>
                  )}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 
                              bg-black/50 transition-opacity">
                  <button
                    onClick={() => handleStartActivity(activity)}
                    className="p-4 bg-green-500 rounded-full hover:bg-green-400 
                             transform hover:scale-110 transition-all shadow-lg"
                  >
                    {activity.isFree === "false" ? 
                      <Lock className="w-6 h-6 text-white" /> : 
                      <Play className="w-6 h-6 text-white" />
                    }
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                  {activity.artist}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                    {activity.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                    {activity.genre}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartActivity(activity)}
                  className={`w-full py-2 rounded-lg font-medium transition-all
                    ${activity.isFree === "true" 
                      ? 'bg-green-500 hover:bg-green-400 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                >
                  {activity.isFree === "true" ? 'Play Free' : 'Premium Activity'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No activities found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
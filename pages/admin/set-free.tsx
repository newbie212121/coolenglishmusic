// pages/admin/set-free.tsx
import { useState, useEffect } from "react";
import { Gift, Check, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

interface Activity {
  id: string;
  title: string;
  artist: string;
  category: string;
  genre: string;
  isFree: string;
  s3Prefix: string;
}

export default function SetFreeActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/activities`);
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFree = async (activity: Activity) => {
    setUpdating(activity.id);
    
    const newFreeStatus = activity.isFree === "true" ? "false" : "true";
    
    try {
      // Use the existing update-activities endpoint
      const response = await fetch(`${API_BASE}/admin/update-activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityIds: [activity.id],
          isFree: newFreeStatus
        })
      });
      
      if (response.ok) {
        // Update local state
        setActivities(prev => prev.map(a => 
          a.id === activity.id 
            ? { ...a, isFree: newFreeStatus }
            : a
        ));
      } else {
        alert("Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      alert("Error updating activity");
    } finally {
      setUpdating(null);
    }
  };

  // Quick set for common free samples
  const setDefaultFreeActivities = async () => {
    const defaultFreeKeywords = [
      "golden", "pure", "sample", "demo", "example", "free"
    ];
    
    const toSetFree = activities.filter(a => 
      defaultFreeKeywords.some(keyword => 
        a.title.toLowerCase().includes(keyword) ||
        a.s3Prefix.toLowerCase().includes(keyword)
      )
    ).slice(0, 3); // Set first 3 matches as free
    
    if (toSetFree.length === 0) {
      // If no matches, just set first 2 activities as free
      toSetFree.push(...activities.slice(0, 2));
    }
    
    for (const activity of toSetFree) {
      await toggleFree({ ...activity, isFree: "false" }); // Toggle to true
    }
    
    alert(`Set ${toSetFree.length} activities as free samples`);
  };

  const filteredActivities = activities.filter(activity => 
    searchQuery === "" || 
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.s3Prefix.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const freeCount = activities.filter(a => a.isFree === "true").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Gift className="w-8 h-8 text-green-400" />
          Manage Free Activities
        </h1>

        {/* Summary */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-white/10">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Activities</p>
              <p className="text-3xl font-bold text-white">{activities.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Free Activities</p>
              <p className="text-3xl font-bold text-green-400">{freeCount}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Premium Activities</p>
              <p className="text-3xl font-bold text-purple-400">{activities.length - freeCount}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <button
            onClick={setDefaultFreeActivities}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Auto-Set Default Free Activities
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
          />
        </div>

        {/* Activities List */}
        <div className="space-y-2">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-gray-800 rounded-lg p-4 flex items-center justify-between border ${
                activity.isFree === "true" ? 'border-green-500/50' : 'border-white/10'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-white">{activity.title}</h3>
                <p className="text-sm text-gray-400">{activity.artist}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.category} • {activity.genre} • {activity.s3Prefix}
                </p>
              </div>

              <button
                onClick={() => toggleFree(activity)}
                disabled={updating === activity.id}
                className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                  ${activity.isFree === "true" 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
              >
                {updating === activity.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : activity.isFree === "true" ? (
                  <>
                    <Check className="w-4 h-4" />
                    FREE
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Premium
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-white/10">
          <h3 className="font-semibold text-white mb-2">Instructions:</h3>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
            <li>Click on any activity to toggle between FREE and Premium</li>
            <li>Free activities can be accessed without a subscription</li>
            <li>Use "Auto-Set Default" to quickly set sample activities as free</li>
            <li>Look for activities with "Golden", "Pure", or "Sample" in the name</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
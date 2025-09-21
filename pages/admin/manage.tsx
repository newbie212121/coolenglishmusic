// pages/admin/manage.tsx
import { useState, useEffect } from "react";
import { Crown, Gift, Search, Save, Check } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

export default function ManageActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, free, premium
  const [message, setMessage] = useState<string | null>(null);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/activities`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.activities.sort((a: any, b: any) => 
          a.title.localeCompare(b.title)
        ));
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFree = (activityId: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        setModifiedIds(new Set(modifiedIds).add(activityId));
        return { ...activity, isFree: !activity.isFree };
      }
      return activity;
    }));
  };

  const saveChanges = async () => {
    if (modifiedIds.size === 0) {
      setMessage("No changes to save");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSaving(true);
    
    // Get only modified activities
    const updates = activities
      .filter(a => modifiedIds.has(a.id))
      .map(a => ({
        id: a.id,
        isFree: a.isFree
      }));

    try {
      // You'll need to create this Lambda endpoint
      const response = await fetch(`${API_BASE}/admin/update-activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      
      if (response.ok) {
        setMessage(`Successfully updated ${updates.length} activities`);
        setModifiedIds(new Set());
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage("Failed to save changes");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "free" && activity.isFree) ||
                         (filter === "premium" && !activity.isFree);
    return matchesSearch && matchesFilter;
  });

  const freeCount = activities.filter(a => a.isFree).length;
  const premiumCount = activities.filter(a => !a.isFree).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Activities</h1>
          {modifiedIds.size > 0 && (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes ({modifiedIds.size})
                </>
              )}
            </button>
          )}
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Activities</p>
            <p className="text-2xl font-bold text-white">{activities.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Free Activities</p>
            <p className="text-2xl font-bold text-green-400">{freeCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Premium Activities</p>
            <p className="text-2xl font-bold text-yellow-400">{premiumCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "all" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400"
                }`}
              >
                All ({activities.length})
              </button>
              <button
                onClick={() => setFilter("free")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "free" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"
                }`}
              >
                Free ({freeCount})
              </button>
              <button
                onClick={() => setFilter("premium")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "premium" ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-400"
                }`}
              >
                Premium ({premiumCount})
              </button>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="space-y-2">
            {filteredActivities.map(activity => (
              <div 
                key={activity.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  modifiedIds.has(activity.id) ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-gray-700'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-white">{activity.title}</div>
                  <div className="text-sm text-gray-400">
                    {activity.artist} • {activity.category} • {activity.genre}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleFree(activity.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    activity.isFree 
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                >
                  {activity.isFree ? (
                    <>
                      <Gift className="w-4 h-4" />
                      FREE
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      PREMIUM
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
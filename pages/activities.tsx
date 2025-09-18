// pages/activities.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// TODO: Replace with real API call later
const dummyActivities = [
  { id: 1, title: 'Shake It Off', genre: 'Pop', premium: false, duration: 10 },
  { id: 2, title: 'Country Road Vocabulary', genre: 'Country', premium: false, duration: 10 },
  { id: 3, title: 'Bohemian Rhapsody', genre: 'Rock', premium: true, duration: 15 },
  { id: 4, title: 'Old Town Road', genre: 'Hip Hop', premium: true, duration: 12 },
  { id: 5, title: 'Hotel California', genre: 'Rock', premium: true, duration: 18 },
  { id: 6, title: 'Billie Jean', genre: 'Pop', premium: true, duration: 9 },
];

const ActivityCard = ({ activity, isLocked }: { activity: any; isLocked: boolean }) => (
  <div className={`bg-gray-800 p-4 rounded-lg shadow ${isLocked ? 'opacity-60' : ''}`}>
    <div className="relative mb-2">
      <img
        src="/placeholder.png"
        alt={activity.title}
        className="w-full h-32 object-cover rounded"
      />
      {isLocked && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded text-white text-lg">
          🔒 Premium Only
        </div>
      )}
    </div>
    <h3 className="text-white font-bold">{activity.title}</h3>
    <p className="text-gray-400 text-sm">
      {activity.genre} • {activity.duration} minutes
    </p>
    <button
      disabled={isLocked}
      className={`w-full mt-4 py-2 rounded-full font-semibold ${
        isLocked
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-green-500 text-black hover:bg-green-400'
      }`}
    >
      {isLocked ? 'Locked' : 'Start Activity'}
    </button>
  </div>
);

export default function ActivitiesPage() {
  const { isMember } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Replace with fetch('/api/activities') later
    setActivities(dummyActivities);
  }, []);

  const freeActivities = activities.filter((a) => !a.premium);
  const premiumActivities = activities.filter((a) => a.premium);

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">Music Activities</h1>
      <p className="text-gray-400 mb-8">
        Explore our free activities and upgrade for full access
      </p>

      {/* Free Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Free Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freeActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} isLocked={false} />
          ))}
        </div>
      </section>

      {/* Premium Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Premium Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} isLocked={!isMember} />
          ))}
        </div>
      </section>
    </div>
  );
}

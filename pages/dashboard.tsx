// pages/dashboard.tsx - Complete updated version with favorites lists
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Heart, 
  Users, 
  Settings,
  ChevronRight,
  Loader2,
  Check,
  X,
  AlertCircle,
  Calendar,
  DollarSign,
  UserPlus,
  List,
  Trash2,
  Edit2,
  Plus,
  Music,
  FolderOpen,
  ChevronDown
} from 'lucide-react';
import { fetchAuthSession, updateUserAttribute, signOut } from 'aws-amplify/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

interface SubscriptionData {
  status: string;
  plan: string;
  currentPeriodEnd: number;
  amount: number;
  interval: string;
  intervalCount?: number;
  stripePriceId?: string;
}

interface GroupMember {
  email: string;
  name: string;
  joinedAt: string;
  status: 'active' | 'pending';
}

interface FavoriteActivity {
  activityId: string;
  title: string;
  artist: string;
  s3Prefix: string;
  addedAt: string;
}

interface FavoriteList {
  listId: string;
  name: string;
  activities: FavoriteActivity[];
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { isAuthenticated, isMember, user, getIdToken } = useAuth();
  const router = useRouter();
  
  // Tab Management
  const [activeTab, setActiveTab] = useState('account');
  
  // Account Settings State
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Subscription State
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  
  // Favorites State - Now with real implementation
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');
  const [loadingLists, setLoadingLists] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  
  // Group Members State (Placeholder for Phase 3)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | ''; text: string }>({ 
    type: '', 
    text: '' 
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    loadUserData();
  }, [isAuthenticated, router]);

  const loadUserData = async () => {
    try {
      // Get user email from Cognito
      try {
        const attributes = await fetchAuthSession();
        const idToken = attributes.tokens?.idToken;
        const payload = idToken?.payload;
        setEmail(payload?.email as string || user?.username || '');
      } catch (error) {
        console.error('Could not fetch user attributes:', error);
        setEmail(user?.username || '');
      }
      
      // Load subscription data
      await loadSubscription();
      
      // Load favorites lists
      await loadFavoriteLists();
      
      // TODO: Load group members if group owner (Phase 3)
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscription = async () => {
    try {
      const idToken = await getIdToken();
      if (!idToken) {
        console.log('No token available for subscription check');
        return;
      }
      
      const response = await fetch(`${API_BASE}/members/status`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Subscription data from API:', data);
        
        setSubscription({
          status: data.status || 'active',
          plan: data.subscriptionType || 'individual',
          currentPeriodEnd: data.currentPeriodEnd || Date.now(),
          amount: data.amount || 200,
          interval: data.interval || 'month',
          intervalCount: data.intervalCount || 1,
          stripePriceId: data.stripePriceId
        });
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  // Load favorite lists from API
  const loadFavoriteLists = async () => {
    setLoadingLists(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      
      const response = await fetch(`${API_BASE}/favorite-lists`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavoriteLists(data.lists || []);
      }
    } catch (error) {
      console.error('Error loading favorite lists:', error);
    } finally {
      setLoadingLists(false);
    }
  };

  // Create a new favorite list
  const createFavoriteList = async () => {
    if (!newListName.trim()) return;
    
    setCreatingList(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) {
        setMessage({ type: 'error', text: 'Please log in again' });
        return;
      }
      
      const response = await fetch(`${API_BASE}/favorite-lists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newListName.trim()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'List created successfully!' });
        setNewListName('');
        setShowCreateList(false);
        await loadFavoriteLists();
      } else {
        setMessage({ type: 'error', text: 'Failed to create list' });
      }
    } catch (error) {
      console.error('Error creating list:', error);
      setMessage({ type: 'error', text: 'Failed to create list' });
    } finally {
      setCreatingList(false);
    }
  };

  // Update list name
  const updateListName = async (listId: string) => {
    if (!editingListName.trim()) return;
    
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      
      const response = await fetch(`${API_BASE}/favorite-lists/${listId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingListName.trim()
        })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'List renamed successfully!' });
        setEditingListId(null);
        setEditingListName('');
        await loadFavoriteLists();
      }
    } catch (error) {
      console.error('Error updating list:', error);
      setMessage({ type: 'error', text: 'Failed to rename list' });
    }
  };

  // Delete a list
  const deleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list and all its activities?')) return;
    
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      
      const response = await fetch(`${API_BASE}/favorite-lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'List deleted successfully!' });
        await loadFavoriteLists();
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      setMessage({ type: 'error', text: 'Failed to delete list' });
    }
  };

  // Remove activity from list
  const removeActivityFromList = async (listId: string, activityId: string) => {
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      
      const response = await fetch(`${API_BASE}/favorite-lists/${listId}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Activity removed from list' });
        await loadFavoriteLists();
      }
    } catch (error) {
      console.error('Error removing activity:', error);
      setMessage({ type: 'error', text: 'Failed to remove activity' });
    }
  };

  // Toggle list expansion
  const toggleListExpansion = (listId: string) => {
    setExpandedLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

  // Launch activity directly (same as activities page)
  const goToActivity = async (s3Prefix: string) => {
    try {
      let headers: any = {};
      
      try {
        const session = await fetchAuthSession();
        const idToken = session?.tokens?.idToken?.toString();
        if (idToken) {
          headers['Authorization'] = `Bearer ${idToken}`;
        }
      } catch (e) {
        console.log("No auth session");
        router.push('/login');
        return;
      }
      
      const response = await fetch(`/api/grant-access?prefix=${encodeURIComponent(s3Prefix)}`, {
        headers
      });
      
      if (!response.ok) {
        console.error("Grant access failed");
        router.push('/pricing');
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.activityUrl) {
        window.open(data.activityUrl, '_blank');
      } else if (data.error === 'authentication_required') {
        router.push('/login');
      } else if (data.error === 'subscription_required') {
        router.push('/pricing');
      } else {
        router.push('/pricing');
      }
    } catch (error) {
      console.error("Error starting activity:", error);
      router.push('/pricing');
    }
  };

  const handleEmailUpdate = async () => {
    if (newEmail === email) return;
    
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateUserAttribute({
        userAttribute: {
          attributeKey: 'email',
          value: newEmail
        }
      });
      
      setMessage({ type: 'success', text: 'Email updated successfully! Please verify your new email.' });
      setEmail(newEmail);
      setNewEmail('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update email' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const { updatePassword } = await import('aws-amplify/auth');
      await updatePassword({
        oldPassword: currentPassword,
        newPassword: newPassword
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  const openStripePortal = async () => {
    setIsLoadingPortal(true);
    try {
      const idToken = await getIdToken();
      
      if (!idToken) {
        setMessage({ type: 'error', text: 'Please log in again' });
        setIsLoadingPortal(false);
        return;
      }
      
      const response = await fetch(`${API_BASE}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': idToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.message || 'Unable to open billing portal' });
      }
    } catch (error) {
      console.error('Portal error:', error);
      setMessage({ type: 'error', text: 'Failed to open billing portal' });
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };
  
  const getPlanDisplayName = () => {
    if (!subscription) return '';
    
    if (subscription.interval === 'year') {
      return 'Annual Subscription';
    } else if (subscription.interval === 'month') {
      return 'Monthly Subscription';
    }
    
    if (subscription.amount === 1500) return 'Annual Subscription';
    if (subscription.amount === 200) return 'Monthly Subscription';
    
    return 'Subscription';
  };
  
  const getPlanPriceDisplay = () => {
    if (!subscription) return '';
    
    const price = formatPrice(subscription.amount);
    
    if (subscription.interval === 'year') {
      return `${price} / year`;
    } else if (subscription.interval === 'month') {
      return `${price} / month`;
    }
    
    return subscription.amount === 1500 ? `${price} / year` : `${price} / month`;
  };

  // Placeholder function for group members
  const addGroupMember = () => {
    setMessage({ type: 'info', text: 'Group membership feature coming soon!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your account, subscription, and preferences</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' :
            message.type === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-400' :
            message.type === 'info' ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' :
            ''
          }`}>
            {message.type === 'success' && <Check className="w-5 h-5" />}
            {message.type === 'error' && <X className="w-5 h-5" />}
            {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'account' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Account Settings
                </button>
                
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'subscription' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Subscription
                </button>
                
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'favorites' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Favorites
                  {favoriteLists.length > 0 && (
                    <span className="ml-auto bg-green-500/30 text-green-400 text-xs px-2 py-0.5 rounded-full">
                      {favoriteLists.reduce((acc, list) => acc + list.activities.length, 0)}
                    </span>
                  )}
                </button>
                
                {subscription?.plan === 'group' && (
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'members' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    Group Members
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6">
              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-green-400" />
                    Account Settings
                  </h2>

                  {/* Email Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={email || "your@email.com"}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                      />
                      <button
                        onClick={handleEmailUpdate}
                        disabled={!newEmail || newEmail === email || saving}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white rounded-lg transition-all flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {email && newEmail && newEmail !== email && (
                      <p className="text-xs text-green-400 mt-2">Press check to update to: {newEmail}</p>
                    )}
                  </div>

                  {/* Password Section */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={!currentPassword || !newPassword || !confirmPassword || saving}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white rounded-lg transition-all"
                      >
                        {saving ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-400" />
                    Subscription Management
                  </h2>

                  {!subscription ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 mb-4">No active subscription found</p>
                      <button
                        onClick={() => router.push('/pricing')}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
                      >
                        View Pricing Plans
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Current Plan Card */}
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Current Plan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Plan Type</p>
                            <p className="text-white font-medium">
                              {getPlanDisplayName()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Price</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {getPlanPriceDisplay()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(subscription.currentPeriodEnd)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <p className="text-sm text-gray-400 mb-1">Status</p>
                          <p className={`font-medium ${
                            subscription.status === 'active' ? 'text-green-400' : 
                            subscription.status === 'canceled' ? 'text-yellow-400' : 
                            'text-red-400'
                          }`}>
                            {subscription.status === 'active' ? 'Active & Auto-renewing' :
                             subscription.status === 'canceled' ? 'Canceled (Active until period end)' :
                             'Inactive'}
                          </p>
                        </div>
                      </div>

                      {/* Billing Management */}
                      <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-medium text-white mb-4">Billing Management</h3>
                        <p className="text-gray-400 mb-4">
                          Manage your payment methods, view invoices, and update billing information through our secure billing portal.
                        </p>
                        <button
                          onClick={openStripePortal}
                          disabled={isLoadingPortal}
                          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                        >
                          <CreditCard className="w-5 h-5" />
                          {isLoadingPortal ? 'Opening Portal...' : 'Manage Billing'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Favorites Tab - NOW WITH REAL IMPLEMENTATION */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-green-400" />
                      My Favorite Lists
                    </h2>
                    <button
                      onClick={() => setShowCreateList(!showCreateList)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New List
                    </button>
                  </div>

                  {/* Create New List Form */}
                  {showCreateList && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          placeholder="Enter list name..."
                          className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-green-500"
                        />
                        <button
                          onClick={createFavoriteList}
                          disabled={!newListName.trim() || creatingList}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-all"
                        >
                          {creatingList ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateList(false);
                            setNewListName('');
                          }}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lists */}
                  {loadingLists ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto" />
                      <p className="text-gray-400 mt-2">Loading your lists...</p>
                    </div>
                  ) : favoriteLists.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <p className="mb-4">No favorite lists yet</p>
                      <p className="text-sm">Create a list to organize your favorite activities!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {favoriteLists.map((list) => (
                        <div key={list.listId} className="bg-gray-700 rounded-lg overflow-hidden">
                          {/* List Header */}
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() => toggleListExpansion(list.listId)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <ChevronDown 
                                  className={`w-5 h-5 transition-transform ${
                                    expandedLists.has(list.listId) ? 'rotate-180' : ''
                                  }`} 
                                />
                              </button>
                              
                              {editingListId === list.listId ? (
                                <div className="flex gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={editingListName}
                                    onChange={(e) => setEditingListName(e.target.value)}
                                    className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-green-500"
                                  />
                                  <button
                                    onClick={() => updateListName(list.listId)}
                                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingListId(null);
                                      setEditingListName('');
                                    }}
                                    className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <h3 className="font-semibold text-white">{list.name}</h3>
                                  <span className="text-sm text-gray-400">
                                    ({list.activities.length} {list.activities.length === 1 ? 'activity' : 'activities'})
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {editingListId !== list.listId && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingListId(list.listId);
                                    setEditingListName(list.name);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteList(list.listId)}
                                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* List Activities */}
                          {expandedLists.has(list.listId) && (
                            <div className="border-t border-gray-600">
                              {list.activities.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">
                                  <Music className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                  <p className="text-sm">No activities in this list yet</p>
                                </div>
                              ) : (
                                <div className="divide-y divide-gray-600">
                                  {list.activities.map((activity) => (
                                    <div key={activity.activityId} className="p-3 flex items-center justify-between hover:bg-gray-600/50">
                                      <div 
                                        className="flex-1 cursor-pointer"
                                        onClick={() => goToActivity(activity.s3Prefix)}
                                      >
                                        <p className="text-white font-medium">{activity.title}</p>
                                        <p className="text-sm text-gray-400">{activity.artist}</p>
                                      </div>
                                      <button
                                        onClick={() => removeActivityFromList(list.listId, activity.activityId)}
                                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Group Members Tab (Placeholder) */}
              {activeTab === 'members' && subscription?.plan === 'group' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Group Members
                  </h2>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      Group management features are coming soon!
                    </p>
                  </div>

                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="mb-4">No group members yet</p>
                    <button
                      onClick={addGroupMember}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                    >
                      Feature Coming Soon
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// pages/dashboard.tsx
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
  Edit2
} from 'lucide-react';
import { fetchAuthSession, updateUserAttribute, signOut } from 'aws-amplify/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

interface SubscriptionData {
  status: string;
  plan: string;
  currentPeriodEnd: number;
  amount: number;
  interval: string;
}

interface GroupMember {
  email: string;
  name: string;
  joinedAt: string;
  status: 'active' | 'pending';
}

interface FavoriteList {
  id: string;
  name: string;
  activities: string[];
  createdAt: string;
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
  
  // Group Members State (placeholder for Phase 3)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [maxGroupSize, setMaxGroupSize] = useState(0);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  
  // Favorites State (placeholder for Phase 2)
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([
    { id: '1', name: 'My Favorites', activities: [], createdAt: '2024-01-20' }
  ]);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?next=/dashboard');
      return;
    }
    
    if (!isMember) {
      router.push('/pricing');
      return;
    }
    
    loadUserData();
  }, [isAuthenticated, isMember]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user attributes from Cognito
      const { fetchUserAttributes } = await import('aws-amplify/auth');
      try {
        const attributes = await fetchUserAttributes();
        setEmail(attributes.email || user?.username || '');
      } catch (error) {
        console.log('Could not fetch user attributes:', error);
        setEmail(user?.username || '');
      }
      
      // Load subscription data
      await loadSubscription();
      
      // TODO: Load favorites (Phase 2)
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
        console.log('Subscription data from API:', data); // Debug log
        
        // Check what fields are actually returned
        // We'll use this info to properly detect annual vs monthly
        setSubscription({
          status: 'active',
          plan: data.subscriptionType || 'individual',
          currentPeriodEnd: data.currentPeriodEnd || Date.now() + 30 * 24 * 60 * 60 * 1000,
          amount: 200, // $2.00 in cents - temporarily hardcoded
          interval: 'month'
        });
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
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
      // Note: AWS Amplify v6 syntax
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
      
      console.log('Calling portal endpoint...');
      
      // Call the dedicated portal endpoint
      const response = await fetch(`${API_BASE}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': idToken, // JWT token for the authorizer
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      console.log('Portal response status:', response.status);
      
      const data = await response.json();
      console.log('Portal response data:', data);
      
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

  // Placeholder functions for future features
  const addGroupMember = () => {
    setMessage({ type: 'info', text: 'Group membership feature coming soon!' });
  };

  const createFavoriteList = () => {
    setMessage({ type: 'info', text: 'Favorites feature coming soon!' });
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
            'bg-blue-500/20 border border-blue-500/50 text-blue-400'
          }`}>
            {message.type === 'success' ? <Check className="w-5 h-5" /> :
             message.type === 'error' ? <X className="w-5 h-5" /> :
             <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <ul className="space-y-2">
                {[
                  { id: 'account', label: 'Account Settings', icon: Settings },
                  { id: 'subscription', label: 'Subscription', icon: CreditCard },
                  { id: 'favorites', label: 'My Favorites', icon: Heart },
                  { id: 'group', label: 'Group Members', icon: Users }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === item.id 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              
              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-green-400" />
                    Account Settings
                  </h2>

                  {/* Email Section */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Current Email</label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">New Email</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleEmailUpdate}
                        disabled={!newEmail || saving}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
                      >
                        {saving ? 'Updating...' : 'Update Email'}
                      </button>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Change Password
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={!currentPassword || !newPassword || !confirmPassword || saving}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
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
                    Subscription Details
                  </h2>

                  {subscription && (
                    <>
                      {/* Current Plan */}
                      <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-white">Current Plan</h3>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-medium">
                            {subscription.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Plan Type</p>
                            <p className="text-white font-medium capitalize">
                              {subscription.plan} Plan
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Billing Cycle</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {formatPrice(subscription.amount)} / {subscription.interval}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(subscription.currentPeriodEnd)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Status</p>
                            <p className="text-green-400 font-medium">
                              Active & Auto-renewing
                            </p>
                          </div>
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

              {/* Favorites Tab (Placeholder) */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-400" />
                    My Favorites
                  </h2>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      The favorites feature is coming soon! You'll be able to create custom lists and save your favorite activities here.
                    </p>
                  </div>

                  {/* Preview of what's coming */}
                  <div className="space-y-4 opacity-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">Your Lists</h3>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium flex items-center gap-2">
                        <List className="w-4 h-4" />
                        Create New List
                      </button>
                    </div>
                    
                    {favoriteLists.map(list => (
                      <div key={list.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{list.name}</h4>
                            <p className="text-sm text-gray-400">
                              {list.activities.length} activities • Created {list.createdAt}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-white">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group Members Tab (Placeholder) */}
              {activeTab === 'group' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Group Members
                  </h2>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-400 text-sm">
                      Group membership features are coming soon! Group owners will be able to add and manage team members here.
                    </p>
                  </div>

                  {/* Preview for individual users */}
                  {subscription?.plan === 'individual' && (
                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 text-center">
                      <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Individual Plan</h3>
                      <p className="text-gray-400 mb-4">
                        You're currently on an individual plan. Upgrade to a group plan to add team members.
                      </p>
                      <button 
                        onClick={() => router.push('/pricing')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                      >
                        View Group Plans
                      </button>
                    </div>
                  )}

                  {/* Preview for future group owners */}
                  {subscription?.plan === 'group' && (
                    <div className="space-y-4 opacity-50">
                      <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-white">
                            Members: <span className="font-bold">{groupMembers.length}</span> / {maxGroupSize}
                          </p>
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Add Member
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {groupMembers.map((member, index) => (
                          <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{member.name}</p>
                              <p className="text-sm text-gray-400">{member.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              member.status === 'active' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
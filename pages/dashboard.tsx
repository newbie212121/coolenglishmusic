// pages/dashboard.tsx - Fixed version
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
  intervalCount?: number;
  stripePriceId?: string;
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
  
  // Favorites State (Placeholder for Phase 2)
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [newListName, setNewListName] = useState('');
  
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
        console.log('Subscription data from API:', data);
        
        // Use the actual fields from the database
        setSubscription({
          status: data.status || 'active',
          plan: data.subscriptionType || 'individual',
          currentPeriodEnd: data.currentPeriodEnd || Date.now(),
          amount: data.amount || 200, // Default to monthly if not set
          interval: data.interval || 'month', // Default to month if not set
          intervalCount: data.intervalCount || 1,
          stripePriceId: data.stripePriceId
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
      
      const response = await fetch(`${API_BASE}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': idToken,
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
  
  const getPlanDisplayName = () => {
    if (!subscription) return '';
    
    // Determine plan name based on interval
    if (subscription.interval === 'year') {
      return 'Annual Subscription';
    } else if (subscription.interval === 'month') {
      return 'Monthly Subscription';
    }
    
    // Fallback to price-based detection if interval not set
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
    
    // Fallback
    return subscription.amount === 1500 ? `${price} / year` : `${price} / month`;
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

                  // In dashboard.tsx, ensure this is in the Account Settings tab:

{/* Email Section - Make sure this replaces your current email section */}
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

                  <div className="text-center py-12 text-gray-400">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="mb-4">No favorite lists yet</p>
                    <button
                      onClick={createFavoriteList}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                    >
                      Feature Coming Soon
                    </button>
                  </div>
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
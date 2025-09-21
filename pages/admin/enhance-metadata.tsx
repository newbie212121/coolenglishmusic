// pages/admin/enhance-metadata.tsx
import { useState } from "react";
import { Sparkles, Database, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

export default function EnhanceMetadata() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const enhanceMetadata = async () => {
    if (!confirm('This will update all activities with enhanced metadata. Continue?')) {
      return;
    }
    
    setLoading(true);
    setResults(null);
    
    try {
      const response = await fetch(`${API_BASE}/admin/enhance-metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Enhance Activities Metadata
        </h1>
        
        <div className="bg-gray-800 rounded-xl p-8 mb-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Metadata Enhancement Tool
          </h2>
          
          <p className="text-gray-300 mb-6">
            This tool will analyze all existing activities and add:
          </p>
          
          <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
            <li>Comprehensive tagging system</li>
            <li>Search keyword optimization</li>
            <li>Better categorization for Kids and Holiday content</li>
            <li>Enhanced genre detection</li>
            <li>Improved title and artist extraction</li>
          </ul>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              This will update all activities in the database. The process may take a few minutes.
            </p>
          </div>
          
          <button
            onClick={enhanceMetadata}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                     text-white rounded-lg font-semibold
                     hover:from-blue-400 hover:to-purple-400
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all transform hover:scale-105
                     shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Enhance All Activities
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className={`rounded-xl p-6 border ${
            results.success 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            {results.success ? (
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Enhancement Complete!
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>{results.message}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Activities Updated</p>
                      <p className="text-2xl font-bold text-green-400">{results.updated}</p>
                    </div>
                    {results.failed > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-sm">Failed</p>
                        <p className="text-2xl font-bold text-yellow-400">{results.failed}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Error
                </h3>
                <p className="text-gray-300">{results.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
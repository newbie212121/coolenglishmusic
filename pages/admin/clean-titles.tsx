// pages/admin/clean-titles.tsx
import { useState } from "react";
import { Wand2, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

export default function CleanTitles() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const cleanTitles = async () => {
    if (!confirm('This will clean all activity titles by removing suffixes like (web), (published), etc. Continue?')) {
      return;
    }
    
    setLoading(true);
    setResults(null);
    
    try {
      const response = await fetch(`${API_BASE}/admin/clean-titles`, {
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
          <Wand2 className="w-8 h-8 text-purple-400" />
          Clean Activity Titles
        </h1>
        
        <div className="bg-gray-800 rounded-xl p-8 mb-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Title Cleanup Tool
          </h2>
          
          <p className="text-gray-300 mb-6">
            This tool will automatically clean all activity titles by removing:
          </p>
          
          <ul className="list-disc list-inside text-gray-400 mb-6 space-y-1">
            <li>Suffixes like (web), (published), (final), (draft), (copy)</li>
            <li>Numbers in parentheses like (1), (2)</li>
            <li>File extensions if any (.html, .mp3, etc.)</li>
            <li>Extra whitespace</li>
          </ul>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              This will update all activities in the database. The process may take a minute.
            </p>
          </div>
          
          <button
            onClick={cleanTitles}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white rounded-lg font-semibold
                     hover:from-purple-400 hover:to-pink-400
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
                <Wand2 className="w-5 h-5" />
                Clean All Titles
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
                  Cleanup Complete!
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>{results.message}</p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Titles Cleaned</p>
                      <p className="text-2xl font-bold text-green-400">{results.updated}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Already Clean</p>
                      <p className="text-2xl font-bold text-blue-400">{results.skipped}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Total Activities</p>
                      <p className="text-2xl font-bold text-gray-300">{results.total}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Refresh the activities page to see the cleaned titles.
                  </p>
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
// pages/admin/import-songclips.tsx
import { useState } from "react";
import { Music, Upload } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

export default function ImportSongClips() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleImport = async (dryRun = false) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/import-songclips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Import Missing Song-clips</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <p className="text-gray-300 mb-4">
            This will import activities from: songclipgames/, Top-20/, and VOCALS ONLY/ folders
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => handleImport(true)}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Preview (Dry Run)
            </button>
            
            <button
              onClick={() => handleImport(false)}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              <Upload className="inline w-5 h-5 mr-2" />
              Import Song-clips
            </button>
          </div>
        </div>

        {results && (
          <div className="bg-gray-800 rounded-lg p-6">
            {results.success ? (
              <div className="text-green-400">
                {results.dryRun ? (
                  <p>Would add {results.wouldAdd} activities</p>
                ) : (
                  <p>Successfully added {results.added} activities!</p>
                )}
              </div>
            ) : (
              <div className="text-red-400">Error: {results.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
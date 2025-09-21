// pages/admin/import.tsx
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { HardDrive, Search, Upload, AlertCircle, CheckCircle, FolderOpen } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

export default function AdminImport() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check existing activities in database
  const checkExisting = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch(`${API_BASE}/admin/scan-s3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-existing' })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults({
          type: 'check',
          existing: data.existing,
          prefixes: data.prefixes
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(`Failed to check existing activities: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Dry run - preview what would be imported
  const dryRun = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch(`${API_BASE}/admin/scan-s3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'scan-and-populate',
          dryRun: true 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults({
          type: 'dryRun',
          wouldAdd: data.wouldAdd,
          skipped: data.skipped,
          activities: data.activities,
          skippedPrefixes: data.skippedPrefixes
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(`Dry run failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Actually import activities
  const importActivities = async () => {
    if (!confirm('This will import all new activities from S3. Continue?')) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch(`${API_BASE}/admin/scan-s3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'scan-and-populate',
          dryRun: false 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults({
          type: 'import',
          added: data.added,
          skipped: data.skipped,
          message: data.message,
          sample: data.sample,
          errors: data.errors
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(`Import failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Import Activities from S3
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            S3 Bucket Scanner
          </h2>
          <p className="text-gray-400 mb-6">
            This tool scans your S3 bucket (cem-activities-private) and automatically 
            creates database entries for any folders containing activities.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={checkExisting}
              disabled={loading}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Check Existing
            </button>
            
            <button
              onClick={dryRun}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <FolderOpen className="w-5 h-5" />
              Preview Import (Dry Run)
            </button>
            
            <button
              onClick={importActivities}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Import Activities
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="text-red-400">{error}</div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="bg-gray-800 rounded-lg p-6">
            {results.type === 'check' && (
              <>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Database Status
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-semibold">{results.existing}</span> activities currently in database
                  </p>
                  {results.prefixes && results.prefixes.length > 0 && (
                    <div className="mt-4">
                      <p className="text-gray-400 mb-2">S3 Prefixes in use:</p>
                      <div className="bg-gray-900 rounded p-3 max-h-60 overflow-y-auto">
                        {results.prefixes.slice(0, 10).map((prefix: string, i: number) => (
                          <div key={i} className="text-gray-500 text-sm font-mono">{prefix}</div>
                        ))}
                        {results.prefixes.length > 10 && (
                          <div className="text-gray-600 text-sm mt-2">
                            ...and {results.prefixes.length - 10} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {results.type === 'dryRun' && (
              <>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                  Preview Results
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-gray-400 text-sm">Would Add</p>
                      <p className="text-2xl font-bold text-green-400">{results.wouldAdd}</p>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-gray-400 text-sm">Would Skip</p>
                      <p className="text-2xl font-bold text-yellow-400">{results.skipped}</p>
                    </div>
                  </div>
                  
                  {results.activities && results.activities.length > 0 && (
                    <div>
                      <p className="text-gray-400 mb-2">Sample of activities to add:</p>
                      <div className="bg-gray-900 rounded p-3 space-y-2">
                        {results.activities.map((activity: any, i: number) => (
                          <div key={i} className="border-b border-gray-700 pb-2">
                            <div className="font-medium text-white">{activity.title}</div>
                            <div className="text-sm text-gray-400">
                              {activity.artist} • {activity.genre} • {activity.category}
                            </div>
                            <div className="text-xs text-gray-600 font-mono">{activity.s3Prefix}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {results.type === 'import' && (
              <>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Import Complete
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-500/20 border border-green-500 rounded p-3">
                    <p className="text-green-400">{results.message}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-gray-400 text-sm">Added</p>
                      <p className="text-2xl font-bold text-green-400">{results.added}</p>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-gray-400 text-sm">Skipped</p>
                      <p className="text-2xl font-bold text-yellow-400">{results.skipped}</p>
                    </div>
                  </div>
                  
                  {results.sample && results.sample.length > 0 && (
                    <div>
                      <p className="text-gray-400 mb-2">Successfully added:</p>
                      <div className="bg-gray-900 rounded p-3 space-y-1">
                        {results.sample.map((activity: any, i: number) => (
                          <div key={i} className="text-gray-300">
                            • {activity.title} ({activity.s3Prefix})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.errors && results.errors.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500 rounded p-3">
                      <p className="text-red-400 mb-2">Some errors occurred:</p>
                      {results.errors.map((err: any, i: number) => (
                        <div key={i} className="text-sm text-red-300">
                          {err.error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
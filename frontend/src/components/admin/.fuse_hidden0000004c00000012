import React, { useState } from "react";
import { syncPostcodes } from "../../services/locationService";

const IconSync = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, verticalAlign: 'middle'}}><polyline points="4 4 20 4 20 20"/><polyline points="20 20 4 20 4 4"/></svg>
);

const SyncPostcodesPanel: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const data = await syncPostcodes();
      setResult(`Postcodes: ${data.message} (Added: ${data.added}, Total: ${data.total})`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings-card" style={{maxWidth: 480, minWidth: 320}}>
      <header>
        <span className="icon"><IconSync /></span>
        <h6>Synchronize Postcodes</h6>
      </header>
      <div className="body">
        <p className="admin-field" style={{marginBottom: 16}}>
          Download and update the list of postcodes in the system database.
        </p>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSync}
          disabled={loading}
        >
          {loading ? "Synchronizing..." : "Sync Postcodes"}
        </button>
        {result && <div className="admin-success" style={{marginTop: 12}}>{result}</div>}
        {error && <div className="admin-error" style={{marginTop: 12}}>{error}</div>}
      </div>
    </div>
  );
};

export default SyncPostcodesPanel;

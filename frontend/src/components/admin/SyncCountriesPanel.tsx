import React, { useState } from "react";
import { syncCountries } from "../../services/locationService";

const IconCheck = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, verticalAlign: 'middle'}}><polyline points="20 6 9 17 4 12"/></svg>
);

const SyncCountriesPanel: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const data = await syncCountries();
      setResult(`${data.message} (Added: ${data.added}, Total: ${data.total})`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings-card" style={{maxWidth: 480, margin: '0 auto'}}>
      <header>
        <span className="icon"><IconCheck /></span>
        <h6>Synchronize Countries</h6>
      </header>
      <div className="body">
        <p className="admin-field" style={{marginBottom: 16}}>
          Download and update the list of countries in the system database.
        </p>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSync}
          disabled={loading}
          style={{minWidth: 140}}
        >
          {loading ? "Synchronizing..." : "Sync Countries"}
        </button>
        {result && (
          <div className="admin-alert admin-alert-success" style={{marginTop: 16, display: 'flex', alignItems: 'center'}}>
            <IconCheck />
            <span>{result}</span>
          </div>
        )}
        {error && (
          <div className="admin-alert admin-alert-error" style={{marginTop: 16}}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncCountriesPanel;

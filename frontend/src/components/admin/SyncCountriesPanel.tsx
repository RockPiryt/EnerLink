import React, { useState } from "react";
import { syncCountries } from "../../services/locationService";

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
    <div style={{ margin: "2rem 0" }}>
      <h3>Synchronize Countries</h3>
      <button onClick={handleSync} disabled={loading}>
        {loading ? "Synchronizing..." : "Sync Countries"}
      </button>
      {result && <div style={{ color: "green", marginTop: 8 }}>{result}</div>}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default SyncCountriesPanel;

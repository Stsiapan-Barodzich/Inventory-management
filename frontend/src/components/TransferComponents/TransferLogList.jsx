import { useState, useEffect } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function TransferLogList() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const authFetch = useAuthFetch();

  useEffect(() => {
    async function fetchLogs() {
      try {
        setIsLoading(true);
        const data = await authFetch("/transfer-logs/");
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("Failed to load transfer logs: " + error.message);
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogs();
  }, [authFetch]);

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      <div className="">
        <h2>Transfer Logs</h2>
        {isLoading ? (
          <p>Loading transfer logs...</p>
        ) : logs.length === 0 ? (
          <p>No transfer logs found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>From Warehouse</th>
                <th>To Warehouse</th>
                <th>Quantity</th>
                <th>Transferred By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.product?.name || "Unknown Product"}</td>
                  <td>{log.from_warehouse?.name || "None"}</td>
                  <td>{log.to_warehouse?.name || "Unknown Warehouse"}</td>
                  <td>{log.quantity}</td>
                  <td>{log.transferred_by?.username || "Unknown User"}</td>
                  <td>{log.created_at ? new Date(log.created_at).toLocaleString() : "Unknown Date"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
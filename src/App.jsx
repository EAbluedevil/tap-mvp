import { useEffect, useState } from 'react';

function App() {
  const [rotation, setRotation] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/rotation')
      .then((res) => res.json())
      .then((data) => {
        setRotation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching rotation:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-lg">Loading rotation log...</p>;

  return (
  <>
    <button
      onClick={() => window.print()}
      className="mb-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
    >
      Print Rotation Log
    </button>

    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TAP: Daily Rotation Log</h1>
      {Object.entries(rotation).map(([time, positions]) => (
        <div key={time} className="border-b py-2">
          <h2 className="font-semibold text-blue-600">{time}</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-1 pl-4 text-sm">
            {Object.entries(positions).map(([role, officer]) => (
              <li key={role}>
                <strong>{role}:</strong> {Array.isArray(officer) ? officer.join(' & ') : officer}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </>
  );
}

export default App;

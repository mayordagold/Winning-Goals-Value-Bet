import React, { useState, useRef } from "react";

export default function ValueBetCalculator() {
  const [totalStake, setTotalStake] = useState(100);
  const [picks, setPicks] = useState([{ odds: "" }]);
  const [results, setResults] = useState([]);
  const resultsRef = useRef(null);

  const handlePickChange = (index, value) => {
    const updated = [...picks];
    updated[index] = { ...updated[index], odds: value };
    setPicks(updated);
  };

  const addPick = () => {
    setPicks([...picks, { odds: "" }]);
  };

  const removePick = (index) => {
    const updated = picks.filter((_, i) => i !== index);
    setPicks(updated);
  };

  const resetAll = () => {
    setTotalStake(100);
    setPicks([{ odds: "" }]);
    setResults([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculate = () => {
    const oddsList = picks
      .map((p) => parseFloat(p.odds))
      .filter((o) => !isNaN(o) && o > 1);

    if (oddsList.length === 0) return;

    const denominator = oddsList.reduce((sum, o) => sum + 1 / o, 0);

    const stakeResults = oddsList.map((odds) => {
      const stake = ((totalStake * (1 / odds)) / denominator).toFixed(2);
      const payout = (odds * stake).toFixed(2);
      return { odds, stake, payout };
    });

    setResults(stakeResults);
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          ⚽ Winning-Goals Value Bet (Dutching) Calculator
        </h1>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Total Stake ($)</label>
          <input
            type="number"
            value={totalStake}
            onChange={(e) => setTotalStake(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>

        {picks.map((pick, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="number"
              placeholder={`Odds ${i + 1}`}
              value={pick.odds}
              onChange={(e) => handlePickChange(i, e.target.value)}
              className="border rounded p-2 w-full"
            />
            {picks.length > 1 && (
              <button
                onClick={() => removePick(i)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -
              </button>
            )}
          </div>
        ))}

        <div className="mb-4 flex gap-2">
          <button
            onClick={addPick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Odds
          </button>

          <button
            onClick={calculate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Calculate Stakes
          </button>

          <button
            onClick={resetAll}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {results.length > 0 && (
          <div ref={resultsRef} className="mt-6 border rounded max-h-80 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2 p-2 sticky top-0 bg-white z-10 border-b">
              Results
            </h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Odds</th>
                  <th className="border p-2">Stake</th>
                  <th className="border p-2">Potential Payout</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="bg-green-100">
                    <td className="border p-2">{r.odds}</td>
                    <td className="border p-2">${r.stake}</td>
                    <td className="border p-2 font-semibold">${r.payout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white text-center py-3 text-sm">
        © 2025 Olumayowa Oginni
      </footer>
    </div>
  );
}

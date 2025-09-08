import React, { useState, useRef } from "react";

export default function ValueBetCalculator() {
  const [totalStake, setTotalStake] = useState("100");
  const [picks, setPicks] = useState([{ odds: "" }]);
  const [results, setResults] = useState({
    dutching: [],
    guaranteed: [],
    moneyBack: [],
  });
  const [activeTab, setActiveTab] = useState("dutching");
  const resultsRef = useRef(null);

  const handlePickChange = (index, value) => {
    const updated = [...picks];
    updated[index] = { ...updated[index], odds: value };
    setPicks(updated);
  };

  const addPick = () => setPicks([...picks, { odds: "" }]);
  const removePick = (index) => setPicks(picks.filter((_, i) => i !== index));
  const resetAll = () => {
    setTotalStake("100");
    setPicks([{ odds: "" }]);
    setResults({ dutching: [], guaranteed: [], moneyBack: [] });
    setActiveTab("dutching");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculate = () => {
    const totalStakeNum = parseFloat(totalStake);
    if (isNaN(totalStakeNum) || totalStakeNum <= 0) return;

    const oddsList = picks
      .map((p) => parseFloat(p.odds))
      .filter((o) => !isNaN(o) && o > 1);

    if (oddsList.length === 0) return;

    // Dutching
    const denominator = oddsList.reduce((sum, o) => sum + 1 / o, 0);
    const dutchingResults = oddsList.map((odds) => {
      const stake = ((totalStakeNum * (1 / odds)) / denominator).toFixed(2);
      const payout = (odds * stake).toFixed(2);
      return { odds, stake, payout };
    });

    // Guaranteed Return
    const guaranteedResults = oddsList.map((odds) => {
      const stake = (totalStakeNum / odds).toFixed(2);
      const payout = (odds * stake).toFixed(2);
      return { odds, stake, payout };
    });

    // Money Back Guarantee (new)
    const moneyBackResults = oddsList.map((odds) => {
      const stake = (totalStakeNum / odds).toFixed(2);
      const payout = (odds * stake).toFixed(2);
      const refund = (totalStakeNum - stake).toFixed(2);
      const netReturn = (payout - totalStakeNum + parseFloat(refund)).toFixed(2);
      return { odds, stake, payout, refund, netReturn };
    });

    setResults({
      dutching: dutchingResults,
      guaranteed: guaranteedResults,
      moneyBack: moneyBackResults,
    });

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const rowColor = (a, b) => {
    if (parseFloat(a) > parseFloat(b)) return "bg-green-200";
    if (parseFloat(b) > parseFloat(a)) return "bg-red-200";
    return "bg-gray-100";
  };

  const renderTable = () => {
    if (activeTab === "dutching") {
      return (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Odds</th>
              <th className="border p-2">Stake</th>
              <th className="border p-2">Expected Return</th>
            </tr>
          </thead>
          <tbody>
            {results.dutching.map((r, i) => (
              <tr key={i}>
                <td className="border p-2">{r.odds}</td>
                <td className="border p-2">${r.stake}</td>
                <td className="border p-2 font-semibold">${r.payout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === "guaranteed") {
      return (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Odds</th>
              <th className="border p-2">Stake</th>
              <th className="border p-2">Expected Return</th>
            </tr>
          </thead>
          <tbody>
            {results.guaranteed.map((r, i) => (
              <tr key={i}>
                <td className="border p-2">{r.odds}</td>
                <td className="border p-2">${r.stake}</td>
                <td className="border p-2 font-semibold">${r.payout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === "moneyBack") {
      return (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Odds</th>
              <th className="border p-2">Stake</th>
              <th className="border p-2">Payout</th>
              <th className="border p-2">Refund</th>
              <th className="border p-2">Net Return</th>
            </tr>
          </thead>
          <tbody>
            {results.moneyBack.map((r, i) => (
              <tr key={i}>
                <td className="border p-2">{r.odds}</td>
                <td className="border p-2">${r.stake}</td>
                <td className="border p-2">${r.payout}</td>
                <td className="border p-2">${r.refund}</td>
                <td className="border p-2 font-semibold">${r.netReturn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          ⚽ Winning-Goals Value Bet Calculator
        </h1>

        {/* Stake input */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Total Stake ($)</label>
          <input
            type="text"
            value={totalStake}
            onChange={(e) => setTotalStake(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Odds input */}
        {picks.map((pick, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="text"
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

        {/* Action buttons */}
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
            Calculate
          </button>

          <button
            onClick={resetAll}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {/* Results Section */}
        {(results.dutching.length > 0 ||
          results.guaranteed.length > 0 ||
          results.moneyBack.length > 0) && (
          <div
            ref={resultsRef}
            className="mt-6 border rounded max-h-96 overflow-y-auto p-2 relative"
          >
            {/* Sticky Tabs */}
            <div className="flex gap-2 mb-4 sticky top-0 bg-white p-2 border-b z-10">
              <button
                onClick={() => setActiveTab("dutching")}
                className={`px-4 py-2 rounded ${
                  activeTab === "dutching"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Dutching
              </button>
              <button
                onClick={() => setActiveTab("guaranteed")}
                className={`px-4 py-2 rounded ${
                  activeTab === "guaranteed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Guaranteed Return
              </button>
              <button
                onClick={() => setActiveTab("moneyBack")}
                className={`px-4 py-2 rounded ${
                  activeTab === "moneyBack"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Money Back
              </button>
            </div>

            {renderTable()}
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white text-center py-3 text-sm">
        © 2025 Olumayowa Oginni
      </footer>
    </div>
  );
}

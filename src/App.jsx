import { useState } from "react";
import "./App.css";

const units = {
  Volume: {
    base: "m3",
    units: {
      m3: 1,
      L: 0.001,
      mL: 0.000001,
      gallon: 0.00378541,
      pint: 0.000473176,
      in3: 0.0000163871,
      ft3: 0.0283168,
    },
  },
  Mass: {
    base: "kg",
    units: {
      t: 1000,
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.453592,
      oz: 0.0283495,
      grain: 0.0000647989,
    },
  },
  "Linear Measure": {
    base: "m",
    units: {
      km: 1000,
      m: 1,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mile: 1609.34,
    },
  },
  Power: {
    base: "W",
    units: {
      hp: 745.7,
      kW: 1000,
      "ftlbf/s": 1.35582,
      "Btu/s": 1055,
      "J/s": 1,
    },
  },
  "Heat or Work": {
    base: "J",
    units: {
      ftlbf: 1.356,
      kWh: 3600000,
      hphr: 2684510,
      Btu: 1055,
      calorie: 4.184,
      joule: 1,
    },
  },
  Pressure: {
    base: "Pa",
    units: {
      Pa: 1,
      kPa: 1000,
      bar: 100000,
      psi: 6894.76,
      psia: 6894.76,
      mmHg: 133.322,
      inHg: 3386.39,
      atm: 101325,
    },
  },
  Time: {
    base: "s",
    units: {
      hr: 3600,
      min: 60,
      s: 1,
      ms: 0.001,
    },
  },
};

const unitDisplayNames = {
  m3: "m³",
  ft3: "ft³",
  in3: "in³",
  m2: "m²",
  ft2: "ft²",
  in2: "in²",
  J: "J",
  "J/s": "J/s",
  kWh: "kWh",
  hphr: "hp·hr",
  ftlbf: "ft·lbf",
  "ftlbf/s": "ft·lbf/s",
  Btu: "Btu",
  "Btu/s": "Btu/s",
  Pa: "Pa",
  kPa: "kPa",
  mmHg: "mmHg",
  inHg: "inHg",
};

function getUnitCategory(unit) {
  for (const category in units) {
    if (unit in units[category].units) return category;
  }
  return null;
}

export default function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState("Volume");
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m3");
  const [toUnit, setToUnit] = useState("L");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleCategoryChange = (category) => {
    const availableUnits = Object.keys(units[category].units);
    setSelectedCategory(category);
    setFromUnit(availableUnits[0]);
    setToUnit(availableUnits[1] || availableUnits[0]);
  };

  const handleConvert = () => {
    if (isNaN(inputValue)) {
      setError("❌ 請輸入有效的數值。");
      setResult(null);
      return;
    }

    setError("");
    const category = selectedCategory;
    const base = units[category].base;
    const baseValue = parseFloat(inputValue) * units[category].units[fromUnit];
    const convertedValue = baseValue / units[category].units[toUnit];
    const formatted = `${inputValue} ${
      unitDisplayNames[fromUnit] || fromUnit
    } = ${convertedValue.toFixed(4)} ${unitDisplayNames[toUnit] || toUnit}`;
    setResult(formatted);
    setHistory([formatted, ...history]);
  };

  const handleReset = () => {
    const defaultUnits = Object.keys(units[selectedCategory].units);
    setInputValue("");
    setFromUnit(defaultUnits[0]);
    setToUnit(defaultUnits[1] || defaultUnits[0]);
    setResult(null);
    setError("");
    setHistory([]);
  };

  const handleDelete = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const handlePin = (index) => {
    const item = history[index];
    const newHistory = [item, ...history.filter((_, i) => i !== index)];
    setHistory(newHistory);
  };

  const categoryOptions = Object.keys(units);
  const availableUnits = Object.keys(units[selectedCategory].units);

  return (
    <div className="converter-container">
      <h1>單位換算工具</h1>
      <div className="form">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="請輸入數值"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
          {availableUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unitDisplayNames[unit] || unit}
            </option>
          ))}
        </select>

        <span> → </span>

        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
          {availableUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unitDisplayNames[unit] || unit}
            </option>
          ))}
        </select>

        <button onClick={handleConvert}>換算</button>
        <button onClick={handleReset} className="reset">
          重設
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {result && <p className="result">✅ {result}</p>}

      {history.length > 0 && (
        <div className="history">
          <h2>歷史紀錄</h2>
          <ul>
            {history.map((record, idx) => (
              <li key={idx}>
                {record}
                <div className="actions">
                  <button className="pin" onClick={() => handlePin(idx)}>
                    📌
                  </button>
                  <button className="delete" onClick={() => handleDelete(idx)}>
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

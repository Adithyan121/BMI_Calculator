import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

import { MdLightMode, MdOutlineLightMode } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BMIChart from "../components/BMIChart";
import SEOContent from "../components/SEOContent";

const BMI = () => {
  const [people, setPeople] = useState([]);

  // Inputs
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [unit, setUnit] = useState("metric"); // 'metric' or 'imperial'

  // Metric Inputs
  const [weightMetric, setWeightMetric] = useState("");
  const [heightMetric, setHeightMetric] = useState("");

  // Imperial Inputs
  const [weightImperial, setWeightImperial] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const [theme, setTheme] = useState("dark");
  const [recentBMI, setRecentBMI] = useState(null);

  // Apply theme
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Load/Save Data
  useEffect(() => {
    const storedData = localStorage.getItem("bmiData");
    if (storedData) {
      setPeople(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bmiData", JSON.stringify(people));
  }, [people]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // --- Calculations ---

  const calculateBMIValue = (kg, cm) => {
    if (!kg || !cm) return 0;
    const heightM = cm / 100;
    return (kg / (heightM * heightM));
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return "var(--underweight)";
    if (bmi >= 18.5 && bmi < 24.9) return "var(--normal)";
    if (bmi >= 25 && bmi < 29.9) return "var(--overweight)";
    return "var(--obese)";
  };

  // Helper: Convert Imperial to Metric
  const imperialToMetric = (lbs, ft, inches) => {
    const totalInches = (parseInt(ft || 0) * 12) + parseFloat(inches || 0);
    const cm = totalInches * 2.54;
    const kg = parseFloat(lbs) * 0.453592;
    return { kg, cm };
  };

  // Helper: Convert Metric to Imperial (for display)
  const metricToImperial = (kg, cm) => {
    const lbs = (kg * 2.20462).toFixed(1);
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { lbs, ft, inches };
  };

  const handleAddPerson = () => {
    let weightKg, heightCm;

    if (unit === "metric") {
      if (!weightMetric || !heightMetric) return alert("Please fill all fields");
      weightKg = parseFloat(weightMetric);
      heightCm = parseFloat(heightMetric);
    } else {
      if (!weightImperial || (!heightFt && !heightIn)) return alert("Please fill all fields");
      const converted = imperialToMetric(weightImperial, heightFt, heightIn);
      weightKg = converted.kg;
      heightCm = converted.cm;
    }

    if (!name || !age) {
      return alert("Please enter Name and Age");
    }

    const bmiVal = calculateBMIValue(weightKg, heightCm);
    const bmiFixed = bmiVal.toFixed(2);
    const category = getBMICategory(bmiVal);

    // Set for Chart
    setRecentBMI(bmiFixed);

    const newPerson = {
      name,
      age: parseInt(age),
      gender,
      weight: parseFloat(weightKg.toFixed(2)),
      height: parseFloat(heightCm.toFixed(2)),
      bmi: bmiFixed,
      category
    };

    if (people.length >= 100) {
      alert("Cannot add more than 100 people");
      return;
    }

    setPeople((prev) => [...prev, newPerson]);

    // Clear inputs
    setName("");
    setAge("");
    if (unit === "metric") {
      setWeightMetric("");
      setHeightMetric("");
    } else {
      setWeightImperial("");
      setHeightFt("");
      setHeightIn("");
    }
  };

  const handleClearStorage = () => {
    localStorage.removeItem("bmiData");
    setPeople([]);
    setRecentBMI(null);
  };

  // File Handlers
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        if (!Array.isArray(jsonData)) {
          alert("Invalid file format. Expected an array.");
          return;
        }
        // Basic validation/sanitization could go here
        setPeople((prev) => [...prev, ...jsonData]);
      } catch (error) {
        alert("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  // --- Dynamic Export Handlers ---

  const handleDownloadJSON = () => {
    const data = JSON.stringify(people, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    saveAs(blob, "bmi_data.json");
  };

  const handleDownloadExcel = async () => {
    if (!people || people.length === 0) return alert("No data available");

    try {
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(people);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "BMI Data");
      XLSX.writeFile(workbook, "bmi_data.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Failed to load Excel generator.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!people || people.length === 0) {
      alert("No data available to download");
      return;
    }

    try {
      const { jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.text("BMI Calculator Report", 14, 15);

      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      doc.text(`Total Records: ${people.length}`, 14, 27);

      const columns = ["Name", "Age", "Gender", "H (cm)", "W (kg)", "BMI", "Category"];
      const rows = people.map(p => [
        p.name,
        p.age,
        p.gender,
        p.height,
        p.weight,
        p.bmi || "-",
        p.category || "-"
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] } // Indigo 500
      });

      doc.save("BMI_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to load PDF generator.");
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="container">
        <h1>BMI Calculator</h1>

        {/* Main Input Form */}
        <div className="bmi-form-card">

          <div className="unit-toggle" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }}>
            <button
              className={unit === "metric" ? "btn-secondary" : ""}
              onClick={() => setUnit("metric")}
              style={{ opacity: unit === "metric" ? 1 : 0.6 }}
            >
              Metric (kg/cm)
            </button>
            <button
              className={unit === "imperial" ? "btn-secondary" : ""}
              onClick={() => setUnit("imperial")}
              style={{ opacity: unit === "imperial" ? 1 : 0.6 }}
            >
              Imperial (lbs/in)
            </button>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {unit === "metric" ? (
              <>
                <div className="input-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    placeholder="175"
                    value={heightMetric}
                    onChange={(e) => setHeightMetric(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="70"
                    value={weightMetric}
                    onChange={(e) => setWeightMetric(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label>Height</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input
                      type="number"
                      placeholder="Ft"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      style={{ width: '50%' }}
                    />
                    <input
                      type="number"
                      placeholder="In"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      style={{ width: '50%' }}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Weight (lbs)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={weightImperial}
                    onChange={(e) => setWeightImperial(e.target.value)}
                  />
                </div>
              </>
            )}

            <button onClick={handleAddPerson} style={{ height: '45px', alignSelf: 'end' }}>
              Calculate & Add
            </button>
          </div>
        </div>

        {/* Visual Chart */}
        {recentBMI && <BMIChart bmi={recentBMI} />}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => document.getElementById('file-upload').click()}>
            Upload JSON
          </button>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <button onClick={handleDownloadJSON}>Export JSON</button>
          <button onClick={handleDownloadExcel}>Export Excel</button>
          <button onClick={handleDownloadPDF}>Export PDF</button>
          <button className="btn-danger" onClick={handleClearStorage}>Clear All</button>
        </div>

        {/* Results Table */}
        {people.length > 0 && (
          <>
            <h2>History</h2>
            <div className="table-container">
              <table className="people-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>BMI</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person, index) => {
                    const bmiColor = getBMIColor(person.bmi);

                    let displayHeight, displayWeight;
                    if (unit === 'metric') {
                      displayHeight = `${person.height} cm`;
                      displayWeight = `${person.weight} kg`;
                    } else {
                      const imp = metricToImperial(person.weight, person.height);
                      displayHeight = `${imp.ft}' ${imp.inches}"`;
                      displayWeight = `${imp.lbs} lbs`;
                    }

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{person.name}</td>
                        <td>{person.age}</td>
                        <td>{person.gender}</td>
                        <td>{displayHeight}</td>
                        <td>{displayWeight}</td>
                        <td style={{ color: bmiColor, fontWeight: 'bold' }}>{person.bmi}</td>
                        <td>
                          <span style={{
                            backgroundColor: bmiColor,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '0.8rem',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}>
                            {person.category}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </>
        )}

        {/* SEO Content Sections */}
        <SEOContent />

      </div>
      <Footer />
    </div>
  );
};

export default BMI;
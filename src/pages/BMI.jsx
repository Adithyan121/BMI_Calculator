import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const BMI = () => {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("bmiData");
    if (storedData) {
      setPeople(JSON.parse(storedData));
    }
  }, []);

  // Save data to localStorage whenever people state changes
  useEffect(() => {
    localStorage.setItem("bmiData", JSON.stringify(people));
  }, [people]);

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return "#FFD700"; // Gold for Underweight
    if (bmi >= 18.5 && bmi < 24.9) return "#32CD32"; // LimeGreen for Normal
    if (bmi >= 25 && bmi < 29.9) return "#FFA500"; // Orange for Overweight
    return "#FF0000"; // Red for Obese
  };

  const calculateHealthyWeight = (height) => {
    const heightInMeters = height / 100;
    const lowerWeight = (18.5 * heightInMeters * heightInMeters).toFixed(2);
    const upperWeight = (24.9 * heightInMeters * heightInMeters).toFixed(2);
    return `${lowerWeight} kg - ${upperWeight} kg`;
  };

  const calculateBMIPrime = (bmi) => {
    return (bmi / 24.9).toFixed(2);
  };

  const calculatePonderalIndex = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split("\n");
      const newPeople = lines
        .map((line) => {
          const [name, age, gender, weight, height] = line.split(",");
          if (!name || !age || !gender || !weight || !height) return null;
          return {
            name: name.trim(),
            age: parseInt(age.trim()),
            gender: gender.trim(),
            weight: parseFloat(weight.trim()),
            height: parseFloat(height.trim()),
          };
        })
        .filter((person) => person !== null); // Filter out invalid entries
      setPeople((prevPeople) => [...prevPeople, ...newPeople]);
    };
    reader.readAsText(file);
  };

  const handleAddPerson = () => {
    if (!name || !age || !weight || !height) {
      alert("Please fill all fields");
      return;
    }

    const newPerson = {
      name,
      age: parseInt(age),
      gender,
      weight: parseFloat(weight),
      height: parseFloat(height),
    };

    setPeople((prevPeople) => [...prevPeople, newPerson]);
    setName("");
    setAge("");
    setWeight("");
    setHeight("");
  };

  const handleCalculate = () => {
    const updatedPeople = people.map((person) => {
      const bmi = calculateBMI(person.weight, person.height);
      const category = getBMICategory(bmi);
      const healthyWeight = calculateHealthyWeight(person.height);
      const bmiPrime = calculateBMIPrime(bmi);
      const ponderalIndex = calculatePonderalIndex(person.weight, person.height);
      return { ...person, bmi, category, healthyWeight, bmiPrime, ponderalIndex };
    });
    setPeople(updatedPeople);
  };

  const handleClearStorage = () => {
    localStorage.removeItem("bmiData");
    setPeople([]);
  };

  const handleDownloadJSON = () => {
    const data = JSON.stringify(people, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    saveAs(blob, "bmi_data.json");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(people);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BMI Data");
    XLSX.writeFile(workbook, "bmi_data.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Name", "Age", "Gender", "Weight (kg)", "Height (cm)", "BMI", "Category", "Healthy Weight", "BMI Prime", "Ponderal Index"]],
      body: people.map((person) => [
        person.name,
        person.age,
        person.gender,
        person.weight,
        person.height,
        person.bmi || "-",
        person.category || "-",
        person.healthyWeight || "-",
        person.bmiPrime || "-",
        person.ponderalIndex || "-",
      ]),
    });
    doc.save("bmi_data.pdf");
  };

  return (
    <div className="app">
      <h1>BMI Calculator</h1>

      {/* File Upload Section */}
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          Upload a .txt file with person data (name,age,gender,weight,height)
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
        />
      </div>

      {/* Manual Entry Section */}
      <div className="manual-entry">
        <h2>Add Person Manually</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <button onClick={handleAddPerson}>Add Person</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={handleCalculate}>Calculate BMI</button>
        <button onClick={handleClearStorage}>Clear Data</button>
        <button onClick={handleDownloadJSON}>Download JSON</button>
        <button onClick={handleDownloadExcel}>Download Excel</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      {/* Display Results */}
      <h2>People List</h2>
      <div className="table-container">
        <table className="people-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Weight (kg)</th>
              <th>Height (cm)</th>
              <th>BMI</th>
              <th>Category</th>
              <th>Healthy Weight</th>
              <th>BMI Prime</th>
              <th>Ponderal Index</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, index) => {
              const bmi = person.bmi || "-";
              const category = person.category || "-";
              const bmiColor = getBMIColor(bmi);
              return (
                <tr key={index}>
                  <td>{person.name}</td>
                  <td>{person.age}</td>
                  <td>{person.gender}</td>
                  <td>{person.weight}</td>
                  <td>{person.height}</td>
                  <td style={{ color: bmiColor }}>{bmi}</td>
                  <td style={{ color: bmiColor }}>{category}</td>
                  <td>{person.healthyWeight || "-"}</td>
                  <td>{person.bmiPrime || "-"}</td>
                  <td>{person.ponderalIndex || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BMI;
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const BMI = () => {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [theme, setTheme] = useState("dark");
  const [fileContent, setFileContent] = useState("");
  const [data, setData] = useState([]);

  // // Apply theme to the body element
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("bmiData", JSON.stringify(people));
  }, [people]);
  
  useEffect(() => {
    const storedData = localStorage.getItem("bmiData");
    if (storedData) {
      setPeople(JSON.parse(storedData));
    }
  }, []);
  

  // // Toggle Theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  // Get BMI Category
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
  };

  // Get BMI Color
  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return "#FFD700"; // Gold for Underweight
    if (bmi >= 18.5 && bmi < 24.9) return "#32CD32"; // LimeGreen for Normal
    if (bmi >= 25 && bmi < 29.9) return "#FFA500"; // Orange for Overweight
    return "#FF0000"; // Red for Obese
  };

  // Calculate Healthy Weight
  const calculateHealthyWeight = (height) => {
    const heightInMeters = height / 100;
    const lowerWeight = (18.5 * heightInMeters * heightInMeters).toFixed(2);
    const upperWeight = (24.9 * heightInMeters * heightInMeters).toFixed(2);
    return `${lowerWeight} kg - ${upperWeight} kg`;
  };

  // Calculate BMI Prime
  const calculateBMIPrime = (bmi) => {
    return (bmi / 24.9).toFixed(2);
  };

  // Calculate Ponderal Index
  const calculatePonderalIndex = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters * heightInMeters)).toFixed(2);
  };

  // Handle File Upload
// Handle JSON File Upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result);

      if (!Array.isArray(jsonData)) {
        alert("Invalid file format. Expected an array of objects.");
        return;
      }

      const newPeople = jsonData
        .map(({ name, age, gender, weight, height }) => {
          if (!name || !age || !gender || !weight || !height) return null;
          return {
            name: name.trim(),
            age: parseInt(age),
            gender: gender.trim(),
            weight: parseFloat(weight),
            height: parseFloat(height),
          };
        })
        .filter((person) => person !== null);

      if (people.length + newPeople.length > 100) {
        alert("Cannot add more than 100 people");
        return;
      }

      setPeople((prevPeople) => [...prevPeople, ...newPeople]);
    } catch (error) {
      alert("Invalid JSON format");
    }
  };
  reader.readAsText(file);
};


  // Handle File Submit
  // const handleFileSubmit = () => {
  //   if (!fileContent) return;

  //   const lines = fileContent.split("\n");
  //   const newPeople = lines
  //     .map((line) => {
  //       const [name, age, gender, weight, height] = line.split(",");
  //       if (!name || !age || !gender || !weight || !height) return null;
  //       return {
  //         name: name.trim(),
  //         age: parseInt(age.trim()),
  //         gender: gender.trim(),
  //         weight: parseFloat(weight.trim()),
  //         height: parseFloat(height.trim()),
  //       };
  //     })
  //     .filter((person) => person !== null); // Filter out invalid entries

  //   if (people.length + newPeople.length > 100) {
  //     alert("Cannot add more than 100 people");
  //     return;
  //   }

  //   setPeople((prevPeople) => [...prevPeople, ...newPeople]);
  //   setFileContent("");
  // };

  // Handle Add Person
  const handleAddPerson = () => {
    if (!name || !age || !weight || !height) {
      alert("Please fill all fields");
      return;
    }

    if (people.length >= 100) {
      alert("Cannot add more than 100 people");
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

  // Handle Calculate
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

  // Handle Clear Storage
  const handleClearStorage = () => {
    localStorage.removeItem("bmiData");
    setPeople([]);
  };

  // Handle Download JSON
  const handleDownloadJSON = () => {
    const data = JSON.stringify(people, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    saveAs(blob, "bmi_data.json");
  };

  // Handle Download Excel
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(people);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BMI Data");
    XLSX.writeFile(workbook, "bmi_data.xlsx");
  };

  // Handle Download PDF

  const handleDownloadPDF = () => {
    if (!people || people.length === 0) {
      console.error("No data available");
      return;
    }
  
    const doc = new jsPDF();
    doc.text("BMI Report", 14, 10);
  
    const columns = ["Name", "Age", "Gender", "Weight", "Height", "BMI", "Category"];
    const rows = people.map(person => [
      person.name, person.age, person.gender, person.weight,
      person.height, person.bmi || "-", person.category || "-"
    ]);
  
    doc.autoTable({ head: [columns], body: rows, startY: 20 });
    doc.save("BMI_Report.pdf");
  };
  
  

  return (
   <div className={`app ${theme}`}>
    <Navbar theme={theme} toggleTheme={toggleTheme}/>
      {/* <nav className="navbar">
        <div className="navbar-brand">BMI Calculator</div>
        <div className="navbar-links">
        <button onClick={toggleTheme} className="theme-toggle-button">
  {theme === "dark" ? <MdOutlineLightMode size={24} /> : <MdLightMode size={24} />}
</button>

        </div>
      </nav> */}

      <div className="container">
        <h1>BMI Calculator</h1>

        {/* File Upload Section */}
        {/* <div className="upload-section">
          <label htmlFor="file-upload" className="upload-label">
            Upload a .txt file with person data (name,age,gender,weight,height)
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
          /> */}
                <div className="upload-section">
        <div className="upload-section">
          <label htmlFor="file-upload" className="upload-label">
            Upload a JSON file
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
          />
        </div>
          {/* <div className="action-buttons">
          <button onClick={handleFileSubmit}>Submit File</button>
          </div> */}

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
          {/* <button onClick={handleDownloadPDF}>Download PDF</button> */}
        </div>

        {/* Display Results */}
        <h2>People List</h2>
        <div className="table-container">
          <table className="people-table">
          <thead>
  <tr>
    <th>Sl. No</th> {/* Added Serial Number Column */}
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
        <td>{index + 1}</td> {/* Added Serial Number */}
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
      <Footer/> 
    </div>
  );
};

export default BMI;
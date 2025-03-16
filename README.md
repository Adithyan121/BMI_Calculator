<<<<<<< HEAD

# BMI_Calculator

=======

# BMI Calculator

The BMI Calculator is a web application that allows users to calculate their Body Mass Index (BMI) and track their health metrics. Users can add individuals manually or upload a `.txt` file containing multiple entries. The app provides detailed BMI metrics, including BMI category, healthy weight range, BMI Prime, and Ponderal Index. Additionally, users can download the data in JSON, Excel, or PDF formats.

## Features

- **Manual Entry:** Add individuals by entering their name, age, gender, weight, and height.
- **File Upload:** Upload a `.txt` file with multiple entries in the format: `name,age,gender,weight,height`.
- **BMI Calculation:** Automatically calculates BMI, BMI category, healthy weight range, BMI Prime, and Ponderal Index.
- **Data Persistence:** Saves data to `localStorage` so that it persists even after refreshing the page.
- **Download Data:** Download the BMI data in multiple formats:
  - **JSON:** For easy data interchange.
  - **Excel:** For spreadsheet analysis.
  - **PDF:** For printable reports with a clean layout.
- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.
- **Dynamic Styling:** BMI and category are displayed in different colors based on the BMI value (Underweight, Normal, Overweight, Obese).

## Technologies Used

### Frontend:

- **React:** A JavaScript library for building user interfaces.
- **React Router DOM:** For handling routing in the application.
- **Vite:** A fast build tool for modern web development.

### Styling:

- **CSS:** For styling the application with a black-and-white theme.

### Data Handling:

- **localStorage:** For persisting data in the browser.
- **File Upload:** For reading and processing `.txt` files.

### Exporting Data:

- **FileSaver.js:** For saving files (JSON, Excel, PDF) to the user's device.
- **XLSX:** For generating Excel files.
- **jsPDF:** For generating PDF files with tables and custom layouts.
- **jspdf-autotable:** For creating tables in PDFs.

## How to Use

### Manual Entry:

1. Enter the name, age, gender, weight, and height of a person.
2. Click **"Add Person"** to add them to the list.

### File Upload:

1. Click **"Upload a .txt file"** and select a file with entries in the format: `name,age,gender,weight,height`.

### Calculate BMI:

1. Click **"Calculate BMI"** to compute BMI and related metrics for all entries.

### Download Data:

1. Use the **"Download JSON"**, **"Download Excel"**, or **"Download PDF"** buttons to export the data.

### Clear Data:

1. Click **"Clear Data"** to remove all entries from the list and localStorage.

## Installation

### Clone the repository:

```bash
git clone https://github.com/Adithyan121/BMI_Calculator.git
```

### Navigate to the project directory:

```bash
cd bmi-calculator
```

### Install dependencies:

```bash
npm install
```

### Start the development server:

```bash
npm run dev
```

Open your browser and visit `http://localhost:5173`.

## Live Demo

(If you deploy your project, add a link to the live demo here.)

## Contributing

Contributions are welcome! If you find any issues or want to enhance the project, feel free to open a pull request.

### Steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Adithyan G**

- **GitHub:** [AdithyanG](https://github.com/AdithyanG)
  > > > > > > > befa1d3 (first commit)

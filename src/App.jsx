import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load the BMI page
const BMI = lazy(() => import("./pages/BMI"));

const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#fff',
    background: '#1a1a2e' // Match dark theme bg
  }}>
    Loading...
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <BMI />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
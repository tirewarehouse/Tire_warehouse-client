console.log('🌍 API 주소:', process.env.REACT_APP_API_BASE_URL);
import React from "react";
import SearchResult from "./components/SearchResult";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <SearchResult />
    </div>
  );
}

export default App;
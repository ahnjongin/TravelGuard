import "./styles/App.css";
import GlobeComponent from "./pages/BannerPage";
import Header from "./components/common/Header";
import ColorBadge from "./components/common/ColorBadge";
import CountrySearchPage from "./pages/MainPage";
import EmbassyInfoPage from "./pages/EmbassyPage";
import PermissionEnter from "./pages/PermissionEnter";
import DetailedCountryPage from "./pages/DetailPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <GlobeComponent />
                <ColorBadge />
              </>
            }
          />
          <Route path="/MainPage" element={<CountrySearchPage />} />
          <Route path="/EmbassyPage" element={<EmbassyInfoPage />} />
          <Route path="/PermissionEnter" element={<PermissionEnter />} />
          <Route
            path="/country/:countryCode"
            element={<DetailedCountryPage />}
          />{" "}
          {/* 상세페이지 */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

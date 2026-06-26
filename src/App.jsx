import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CrudPage from "./pages/CrudPage";

export default function App() {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/course/:id" element={<CourseDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/crud" element={<CrudPage />} />
    </Routes>
  );
}

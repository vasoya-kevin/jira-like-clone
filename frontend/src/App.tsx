import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Layout, Login, NotFound, RegisterPage } from "./pages";
import { ProtectedRoute } from "@/components";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

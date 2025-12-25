import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Login, NotFound, RegisterPage, UserListPage } from "./pages";
import { ProtectedRoute } from "@/components";
import Dashboard from "./pages/dashboard";
import { UserDetailPage, UserProfilePage } from "./pages/users";

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/users" >
              <Route index element={<UserListPage />} />
              <Route path=":id" element={<UserDetailPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components";

import { CreateTicket, TicketDetails, TicketList } from "./pages/tickets";
import { Dashboard, Layout, Login, NotFound, RegisterPage } from "./pages";
import { UserDetailPage, UserListPage, UserProfilePage } from "./pages/users";

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

            <Route index path="/" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfilePage />} />

            <Route path="/users" >
              <Route index element={<UserListPage />} />
              <Route path=":id" element={<UserDetailPage />} />
            </Route>

            <Route path="/tickets" >
              <Route index element={<TicketList />} />
              <Route path="create-ticket" element={<CreateTicket />} />
              <Route path=":id" element={<TicketDetails />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import "./App.css";
import { AuthProvider } from "@/contexts/auth-context.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/app-routes.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

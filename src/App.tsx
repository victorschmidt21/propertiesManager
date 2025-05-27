import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyIncomes from "./pages/PropertyIncomes";
import PropertyExpenses from "./pages/PropertyExpenses";
import Incomes from "./pages/Incomes";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import PropertyAnalytics from "./pages/PropertyAnalytics";
import { RequireAuth } from "./auth/requiredAuth";
import Owners from "./pages/Owners";
import OwnerDetails from "./pages/OwnerDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/owners" element={<Owners />} />
              <Route
                path="/properties/:propertyId"
                element={<PropertyDetails />}
              />
              <Route
                path="/owner/:ownerId"
                element={<OwnerDetails />}
              />
              <Route
                path="/properties/:propertyId/incomes"
                element={<PropertyIncomes />}
              />
              <Route
                path="/properties/:propertyId/expenses"
                element={<PropertyExpenses />}
              />
              <Route
                path="/properties/:propertyId/analytics"
                element={<PropertyAnalytics />}
              />
              <Route path="/incomes" element={<Incomes />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

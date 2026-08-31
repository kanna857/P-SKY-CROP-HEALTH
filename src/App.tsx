import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import Index from "./pages/Index";
import AnalyzePage from "./pages/AnalyzePage";
import DashboardPage from "./pages/DashboardPage";
import CompareFieldsPage from "./pages/CompareFieldsPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import DiagnosePage from "./pages/DiagnosePage";
import ChatbotPage from "./pages/ChatbotPage";
import HistoryPage from "./pages/HistoryPage";
import SearchEnginePage from "./pages/SearchEnginePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnose" element={<DiagnosePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/search" element={<SearchEnginePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/compare" element={<CompareFieldsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

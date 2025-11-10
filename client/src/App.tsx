import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Prayers from "./pages/Prayers";
import Quran from "./pages/Quran";
import Lessons from "./pages/Lessons";
import Weekly from "./pages/Weekly";
import Statistics from "./pages/Statistics";
import Motivation from "./pages/Motivation";
import Alarms from "./pages/Alarms";
import Settings from "./pages/Settings";

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/prayers" component={Prayers} />
        <Route path="/quran" component={Quran} />
        <Route path="/lessons" component={Lessons} />
        <Route path="/weekly" component={Weekly} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/motivation" component={Motivation} />
        <Route path="/alarms" component={Alarms} />
        <Route path="/settings" component={Settings} />
        <Route component={Dashboard} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

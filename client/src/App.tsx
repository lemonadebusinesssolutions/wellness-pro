import { Switch, Route } from "wouter";
import queryClient from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import Results from "@/pages/Results";
import Dashboard from "@/pages/Dashboard";
import Assessments from "@/pages/Assessments";
import About from "@/pages/About";
import Resources from "@/pages/Resources";
import ArticleView from "@/pages/ArticleView";
import AuthPage from "@/pages/AuthPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JournalPage from "@/components/dashboard/JournalPage";
import { useEffect } from "react";
import { getAnonymousUserId } from "./lib/utils";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  // Ensure user has an anonymous ID
  useEffect(() => {
    getAnonymousUserId();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark:bg-slate-900 dark:text-white">
      <Header />
      <main className="flex-grow dark:bg-slate-900">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/about" component={About} />
          <ProtectedRoute path="/assessments" component={Assessments} />
          <ProtectedRoute path="/quiz/:type" component={Quiz} />
          <ProtectedRoute path="/results/:type/:resultId" component={Results} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/dashboard/journal" component={JournalPage} />
          <ProtectedRoute path="/resources" component={Resources} />
          <ProtectedRoute path="/article/:id" component={ArticleView} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="wellbeing-theme">
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

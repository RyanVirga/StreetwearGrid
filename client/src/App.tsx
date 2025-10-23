import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Gallery from "@/pages/Gallery";
import RequestWizard from "@/pages/RequestWizard";
import ThankYou from "@/pages/ThankYou";
import UploadFiles from "@/pages/UploadFiles";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/request" component={RequestWizard} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/upload-files/:id" component={UploadFiles} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

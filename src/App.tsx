
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OhmsLawCalculator from "./components/OhmsLawCalculator";
import WireSizeCalculator from "./components/WireSizeCalculator";
import VoltageDropCalculator from "./components/VoltageDropCalculator";
import PowerFactorCalculator from "./components/PowerFactorCalculator";
import UnitConverter from "./components/UnitConverter";
import ACCircuitCalculator from "./components/ACCircuitCalculator";
import DCCircuitCalculator from "./components/DCCircuitCalculator";
import ColorCodeCalculator from "./components/ColorCodeCalculator";
import CapacitorCalculator from "./components/CapacitorCalculator";
import InductorCalculator from "./components/InductorCalculator";
import ResonanceCalculator from "./components/ResonanceCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ohms-law" element={<OhmsLawCalculator />} />
          <Route path="/wire-size" element={<WireSizeCalculator />} />
          <Route path="/voltage-drop" element={<VoltageDropCalculator />} />
          <Route path="/power-factor" element={<PowerFactorCalculator />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/ac-circuit" element={<ACCircuitCalculator />} />
          <Route path="/dc-circuit" element={<DCCircuitCalculator />} />
          <Route path="/color-code" element={<ColorCodeCalculator />} />
          <Route path="/capacitor" element={<CapacitorCalculator />} />
          <Route path="/inductor" element={<InductorCalculator />} />
          <Route path="/resonance" element={<ResonanceCalculator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

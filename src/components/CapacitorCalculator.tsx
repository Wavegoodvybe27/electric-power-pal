
import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  calculateCapacitiveReactance, 
  calculateCapacitorEnergy, 
  calculateSeriesCapacitance,
  calculateParallelCapacitance
} from '@/utils/electricalCalculations';

const CapacitorCalculator = () => {
  // Reactance calculator
  const [frequency, setFrequency] = useState<number>(60);
  const [capacitance, setCapacitance] = useState<number>(10);
  const [capacitanceUnit, setCapacitanceUnit] = useState<string>("μF");
  const [reactance, setReactance] = useState<number>(0);
  
  // Energy calculator
  const [voltage, setVoltage] = useState<number>(12);
  const [energyCapacitance, setEnergyCapacitance] = useState<number>(1000);
  const [energyCapacitanceUnit, setEnergyCapacitanceUnit] = useState<string>("μF");
  const [energy, setEnergy] = useState<number>(0);
  
  // Series/Parallel calculator
  const [capacitors, setCapacitors] = useState<number[]>([10, 22, 47]);
  const [capacitorUnit, setCapacitorUnit] = useState<string>("μF");
  const [seriesCapacitance, setSeriesCapacitance] = useState<number>(0);
  const [parallelCapacitance, setParallelCapacitance] = useState<number>(0);
  
  const convertCapacitanceToFarads = (value: number, unit: string): number => {
    switch (unit) {
      case "pF": return value * 1e-12;
      case "nF": return value * 1e-9;
      case "μF": return value * 1e-6;
      case "mF": return value * 1e-3;
      case "F": return value;
      default: return value * 1e-6; // Default to μF
    }
  };
  
  const convertFaradsToSelectedUnit = (farads: number, unit: string): number => {
    switch (unit) {
      case "pF": return farads * 1e12;
      case "nF": return farads * 1e9;
      case "μF": return farads * 1e6;
      case "mF": return farads * 1e3;
      case "F": return farads;
      default: return farads * 1e6; // Default to μF
    }
  };
  
  const calculateReactance = () => {
    const capacitanceInFarads = convertCapacitanceToFarads(capacitance, capacitanceUnit);
    const xc = calculateCapacitiveReactance(frequency, capacitanceInFarads);
    setReactance(xc);
  };
  
  const calculateEnergy = () => {
    const capacitanceInFarads = convertCapacitanceToFarads(energyCapacitance, energyCapacitanceUnit);
    const energyInJoules = calculateCapacitorEnergy(capacitanceInFarads, voltage);
    setEnergy(energyInJoules);
  };
  
  const calculateCombinations = () => {
    const capacitorsInFarads = capacitors.map(c => convertCapacitanceToFarads(c, capacitorUnit));
    
    const seriesResult = calculateSeriesCapacitance(capacitorsInFarads);
    const parallelResult = calculateParallelCapacitance(capacitorsInFarads);
    
    setSeriesCapacitance(convertFaradsToSelectedUnit(seriesResult, capacitorUnit));
    setParallelCapacitance(convertFaradsToSelectedUnit(parallelResult, capacitorUnit));
  };
  
  const handleCapacitorChange = (index: number, value: number) => {
    const newCapacitors = [...capacitors];
    newCapacitors[index] = value;
    setCapacitors(newCapacitors);
  };
  
  const addCapacitor = () => {
    setCapacitors([...capacitors, 10]);
  };
  
  const removeCapacitor = (index: number) => {
    if (capacitors.length > 1) {
      const newCapacitors = [...capacitors];
      newCapacitors.splice(index, 1);
      setCapacitors(newCapacitors);
    }
  };
  
  return (
    <CalculatorLayout 
      title="Capacitor Calculator" 
      description="Calculate capacitor reactance, energy, and series/parallel combinations"
    >
      <Tabs defaultValue="reactance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reactance">Reactance</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="combination">Series/Parallel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reactance" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency" className="calculator-label">Frequency (Hz)</Label>
                <Input
                  id="frequency"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => setFrequency(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="capacitance" className="calculator-label">Capacitance</Label>
                  <Input
                    id="capacitance"
                    type="number"
                    min="0"
                    step="0.1"
                    value={capacitance}
                    onChange={(e) => setCapacitance(parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                </div>
                <div>
                  <Label htmlFor="capacitance-unit" className="calculator-label">Unit</Label>
                  <select
                    id="capacitance-unit"
                    value={capacitanceUnit}
                    onChange={(e) => setCapacitanceUnit(e.target.value)}
                    className="calculator-input h-10"
                  >
                    <option value="pF">pF</option>
                    <option value="nF">nF</option>
                    <option value="μF">μF</option>
                    <option value="mF">mF</option>
                    <option value="F">F</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateReactance} className="w-full">Calculate Reactance</Button>
            
            <div>
              <Label className="calculator-label">Capacitive Reactance (Xc)</Label>
              <div className="calculator-result">{reactance.toFixed(2)} Ω</div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Capacitive reactance (Xc) is the opposition of a capacitor to alternating current due to capacitance.</p>
              <p className="mt-2">Formula: Xc = 1 / (2πfC)</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="energy" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voltage" className="calculator-label">Voltage (V)</Label>
                <Input
                  id="voltage"
                  type="number"
                  min="0"
                  step="0.1"
                  value={voltage}
                  onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="energy-capacitance" className="calculator-label">Capacitance</Label>
                  <Input
                    id="energy-capacitance"
                    type="number"
                    min="0"
                    step="0.1"
                    value={energyCapacitance}
                    onChange={(e) => setEnergyCapacitance(parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                </div>
                <div>
                  <Label htmlFor="energy-capacitance-unit" className="calculator-label">Unit</Label>
                  <select
                    id="energy-capacitance-unit"
                    value={energyCapacitanceUnit}
                    onChange={(e) => setEnergyCapacitanceUnit(e.target.value)}
                    className="calculator-input h-10"
                  >
                    <option value="pF">pF</option>
                    <option value="nF">nF</option>
                    <option value="μF">μF</option>
                    <option value="mF">mF</option>
                    <option value="F">F</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateEnergy} className="w-full">Calculate Energy</Button>
            
            <div>
              <Label className="calculator-label">Stored Energy</Label>
              <div className="calculator-result">
                {energy < 0.001 
                  ? `${(energy * 1000000).toFixed(2)} μJ` 
                  : energy < 1 
                    ? `${(energy * 1000).toFixed(2)} mJ` 
                    : `${energy.toFixed(4)} J`}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>The energy stored in a capacitor is proportional to the square of the voltage.</p>
              <p className="mt-2">Formula: E = ½CV²</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="combination" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-4">
                <Label className="calculator-label">Capacitor Values</Label>
              </div>
              <div>
                <Label className="calculator-label">Unit</Label>
                <select
                  value={capacitorUnit}
                  onChange={(e) => setCapacitorUnit(e.target.value)}
                  className="calculator-input h-10"
                >
                  <option value="pF">pF</option>
                  <option value="nF">nF</option>
                  <option value="μF">μF</option>
                  <option value="mF">mF</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              {capacitors.map((capacitor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={capacitor}
                    onChange={(e) => handleCapacitorChange(index, parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeCapacitor(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={addCapacitor}
              >
                Add Capacitor
              </Button>
            </div>
            
            <Button onClick={calculateCombinations} className="w-full">Calculate Combinations</Button>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="calculator-label">Series Combination</Label>
                <div className="calculator-result">
                  {seriesCapacitance.toFixed(2)} {capacitorUnit}
                </div>
              </div>
              <div>
                <Label className="calculator-label">Parallel Combination</Label>
                <div className="calculator-result">
                  {parallelCapacitance.toFixed(2)} {capacitorUnit}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Series: 1/Ctotal = 1/C1 + 1/C2 + ... + 1/Cn</p>
              <p>Parallel: Ctotal = C1 + C2 + ... + Cn</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorLayout>
  );
};

export default CapacitorCalculator;

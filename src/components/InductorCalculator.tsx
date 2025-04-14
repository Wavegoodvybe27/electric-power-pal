
import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  calculateInductiveReactance, 
  calculateInductorEnergy,
  calculateSeriesInductance,
  calculateParallelInductance
} from '@/utils/electricalCalculations';

const InductorCalculator = () => {
  // Reactance calculator
  const [frequency, setFrequency] = useState<number>(60);
  const [inductance, setInductance] = useState<number>(100);
  const [inductanceUnit, setInductanceUnit] = useState<string>("mH");
  const [reactance, setReactance] = useState<number>(0);
  
  // Energy calculator
  const [current, setCurrent] = useState<number>(1);
  const [energyInductance, setEnergyInductance] = useState<number>(100);
  const [energyInductanceUnit, setEnergyInductanceUnit] = useState<string>("mH");
  const [energy, setEnergy] = useState<number>(0);
  
  // Series/Parallel calculator
  const [inductors, setInductors] = useState<number[]>([10, 22, 47]);
  const [inductorUnit, setInductorUnit] = useState<string>("mH");
  const [seriesInductance, setSeriesInductance] = useState<number>(0);
  const [parallelInductance, setParallelInductance] = useState<number>(0);
  
  const convertInductanceToHenry = (value: number, unit: string): number => {
    switch (unit) {
      case "μH": return value * 1e-6;
      case "mH": return value * 1e-3;
      case "H": return value;
      default: return value * 1e-3; // Default to mH
    }
  };
  
  const convertHenryToSelectedUnit = (henry: number, unit: string): number => {
    switch (unit) {
      case "μH": return henry * 1e6;
      case "mH": return henry * 1e3;
      case "H": return henry;
      default: return henry * 1e3; // Default to mH
    }
  };
  
  const calculateReactance = () => {
    const inductanceInHenry = convertInductanceToHenry(inductance, inductanceUnit);
    const xl = calculateInductiveReactance(frequency, inductanceInHenry);
    setReactance(xl);
  };
  
  const calculateEnergy = () => {
    const inductanceInHenry = convertInductanceToHenry(energyInductance, energyInductanceUnit);
    const energyInJoules = calculateInductorEnergy(inductanceInHenry, current);
    setEnergy(energyInJoules);
  };
  
  const calculateCombinations = () => {
    const inductorsInHenry = inductors.map(i => convertInductanceToHenry(i, inductorUnit));
    
    const seriesResult = calculateSeriesInductance(inductorsInHenry);
    const parallelResult = calculateParallelInductance(inductorsInHenry);
    
    setSeriesInductance(convertHenryToSelectedUnit(seriesResult, inductorUnit));
    setParallelInductance(convertHenryToSelectedUnit(parallelResult, inductorUnit));
  };
  
  const handleInductorChange = (index: number, value: number) => {
    const newInductors = [...inductors];
    newInductors[index] = value;
    setInductors(newInductors);
  };
  
  const addInductor = () => {
    setInductors([...inductors, 10]);
  };
  
  const removeInductor = (index: number) => {
    if (inductors.length > 1) {
      const newInductors = [...inductors];
      newInductors.splice(index, 1);
      setInductors(newInductors);
    }
  };
  
  return (
    <CalculatorLayout 
      title="Inductor Calculator" 
      description="Calculate inductor reactance, energy, and series/parallel combinations"
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
                  <Label htmlFor="inductance" className="calculator-label">Inductance</Label>
                  <Input
                    id="inductance"
                    type="number"
                    min="0"
                    step="0.1"
                    value={inductance}
                    onChange={(e) => setInductance(parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                </div>
                <div>
                  <Label htmlFor="inductance-unit" className="calculator-label">Unit</Label>
                  <select
                    id="inductance-unit"
                    value={inductanceUnit}
                    onChange={(e) => setInductanceUnit(e.target.value)}
                    className="calculator-input h-10"
                  >
                    <option value="μH">μH</option>
                    <option value="mH">mH</option>
                    <option value="H">H</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateReactance} className="w-full">Calculate Reactance</Button>
            
            <div>
              <Label className="calculator-label">Inductive Reactance (XL)</Label>
              <div className="calculator-result">{reactance.toFixed(2)} Ω</div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Inductive reactance (XL) is the opposition of an inductor to alternating current due to inductance.</p>
              <p className="mt-2">Formula: XL = 2πfL</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="energy" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current" className="calculator-label">Current (A)</Label>
                <Input
                  id="current"
                  type="number"
                  min="0"
                  step="0.1"
                  value={current}
                  onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="energy-inductance" className="calculator-label">Inductance</Label>
                  <Input
                    id="energy-inductance"
                    type="number"
                    min="0"
                    step="0.1"
                    value={energyInductance}
                    onChange={(e) => setEnergyInductance(parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                </div>
                <div>
                  <Label htmlFor="energy-inductance-unit" className="calculator-label">Unit</Label>
                  <select
                    id="energy-inductance-unit"
                    value={energyInductanceUnit}
                    onChange={(e) => setEnergyInductanceUnit(e.target.value)}
                    className="calculator-input h-10"
                  >
                    <option value="μH">μH</option>
                    <option value="mH">mH</option>
                    <option value="H">H</option>
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
              <p>The energy stored in an inductor is proportional to the square of the current.</p>
              <p className="mt-2">Formula: E = ½LI²</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="combination" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-4">
                <Label className="calculator-label">Inductor Values</Label>
              </div>
              <div>
                <Label className="calculator-label">Unit</Label>
                <select
                  value={inductorUnit}
                  onChange={(e) => setInductorUnit(e.target.value)}
                  className="calculator-input h-10"
                >
                  <option value="μH">μH</option>
                  <option value="mH">mH</option>
                  <option value="H">H</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              {inductors.map((inductor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={inductor}
                    onChange={(e) => handleInductorChange(index, parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeInductor(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={addInductor}
              >
                Add Inductor
              </Button>
            </div>
            
            <Button onClick={calculateCombinations} className="w-full">Calculate Combinations</Button>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="calculator-label">Series Combination</Label>
                <div className="calculator-result">
                  {seriesInductance.toFixed(2)} {inductorUnit}
                </div>
              </div>
              <div>
                <Label className="calculator-label">Parallel Combination</Label>
                <div className="calculator-result">
                  {parallelInductance.toFixed(2)} {inductorUnit}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Series: Ltotal = L1 + L2 + ... + Ln</p>
              <p>Parallel: 1/Ltotal = 1/L1 + 1/L2 + ... + 1/Ln</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorLayout>
  );
};

export default InductorCalculator;

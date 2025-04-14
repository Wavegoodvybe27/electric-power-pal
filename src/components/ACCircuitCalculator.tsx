
import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  calculateImpedance, 
  calculatePhaseAngle,
  calculateCapacitiveReactance,
  calculateInductiveReactance
} from '@/utils/electricalCalculations';

const ACCircuitCalculator = () => {
  const [resistance, setResistance] = useState<number>(100);
  const [capacitance, setCapacitance] = useState<number>(0);
  const [inductance, setInductance] = useState<number>(0);
  const [frequency, setFrequency] = useState<number>(60);
  const [impedance, setImpedance] = useState<number>(0);
  const [phaseAngle, setPhaseAngle] = useState<number>(0);
  const [capacitiveReactance, setCapacitiveReactance] = useState<number>(0);
  const [inductiveReactance, setInductiveReactance] = useState<number>(0);

  const handleCalculate = () => {
    // Calculate reactances
    const xc = capacitance ? calculateCapacitiveReactance(frequency, capacitance / 1000000) : 0; // μF to F
    const xl = inductance ? calculateInductiveReactance(frequency, inductance / 1000) : 0; // mH to H
    
    setCapacitiveReactance(xc);
    setInductiveReactance(xl);
    
    // Calculate impedance and phase angle
    const z = calculateImpedance(resistance, xc, xl);
    const theta = calculatePhaseAngle(resistance, xc, xl);
    
    setImpedance(z);
    setPhaseAngle(theta);
  };

  return (
    <CalculatorLayout 
      title="AC Circuit Calculator" 
      description="Calculate impedance, reactance, and phase angle in AC circuits"
    >
      <Tabs defaultValue="rlc">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rlc">Impedance & Phase</TabsTrigger>
          <TabsTrigger value="reactance">Reactance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rlc" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resistance" className="calculator-label">Resistance (Ω)</Label>
                <Input
                  id="resistance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={resistance}
                  onChange={(e) => setResistance(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
              <div>
                <Label htmlFor="frequency" className="calculator-label">Frequency (Hz)</Label>
                <Input
                  id="frequency"
                  type="number"
                  min="0"
                  step="0.01"
                  value={frequency}
                  onChange={(e) => setFrequency(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacitance" className="calculator-label">Capacitance (μF)</Label>
                <Input
                  id="capacitance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={capacitance}
                  onChange={(e) => setCapacitance(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
              <div>
                <Label htmlFor="inductance" className="calculator-label">Inductance (mH)</Label>
                <Input
                  id="inductance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={inductance}
                  onChange={(e) => setInductance(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
            </div>
            
            <Button onClick={handleCalculate} className="w-full">Calculate</Button>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="calculator-label">Total Impedance (Z)</p>
                <div className="calculator-result">
                  {impedance.toFixed(2)} Ω
                </div>
              </div>
              <div>
                <p className="calculator-label">Phase Angle (θ)</p>
                <div className="calculator-result">
                  {phaseAngle.toFixed(2)}°
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reactance" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cap-reactance" className="calculator-label">Capacitive Reactance (Xc)</Label>
                <div className="calculator-result">
                  {capacitiveReactance.toFixed(2)} Ω
                </div>
              </div>
              <div>
                <Label htmlFor="ind-reactance" className="calculator-label">Inductive Reactance (Xl)</Label>
                <div className="calculator-result">
                  {inductiveReactance.toFixed(2)} Ω
                </div>
              </div>
            </div>
            
            <div>
              <Label className="calculator-label">Net Reactance</Label>
              <div className="calculator-result">
                {(inductiveReactance - capacitiveReactance).toFixed(2)} Ω
              </div>
            </div>
            
            <div>
              <Label className="calculator-label">Circuit Behavior</Label>
              <div className="calculator-result">
                {inductiveReactance > capacitiveReactance ? 
                  "Inductive (Current lags voltage)" : 
                  inductiveReactance < capacitiveReactance ? 
                  "Capacitive (Current leads voltage)" : 
                  "Resistive (Current in phase with voltage)"}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorLayout>
  );
};

export default ACCircuitCalculator;

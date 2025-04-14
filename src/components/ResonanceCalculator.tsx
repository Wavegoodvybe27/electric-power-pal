
import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { calculateInductiveReactance, calculateCapacitiveReactance } from '@/utils/electricalCalculations';

const ResonanceCalculator = () => {
  // LC Resonance calculator
  const [inductance, setInductance] = useState<number>(100);
  const [inductanceUnit, setInductanceUnit] = useState<string>("mH");
  const [capacitance, setCapacitance] = useState<number>(10);
  const [capacitanceUnit, setCapacitanceUnit] = useState<string>("μF");
  const [resonanceFrequency, setResonanceFrequency] = useState<number>(0);
  const [quality, setQuality] = useState<number>(10);
  const [resistance, setResistance] = useState<number>(10);
  const [bandwidthResult, setBandwidthResult] = useState<number>(0);
  const [impedanceAtResonance, setImpedanceAtResonance] = useState<number>(0);
  
  const convertInductanceToHenry = (value: number, unit: string): number => {
    switch (unit) {
      case "μH": return value * 1e-6;
      case "mH": return value * 1e-3;
      case "H": return value;
      default: return value * 1e-3; // Default to mH
    }
  };
  
  const convertCapacitanceToFarad = (value: number, unit: string): number => {
    switch (unit) {
      case "pF": return value * 1e-12;
      case "nF": return value * 1e-9;
      case "μF": return value * 1e-6;
      case "mF": return value * 1e-3;
      case "F": return value;
      default: return value * 1e-6; // Default to μF
    }
  };
  
  const formatFrequency = (frequencyHz: number): string => {
    if (frequencyHz >= 1e6) {
      return `${(frequencyHz / 1e6).toFixed(2)} MHz`;
    } else if (frequencyHz >= 1e3) {
      return `${(frequencyHz / 1e3).toFixed(2)} kHz`;
    } else {
      return `${frequencyHz.toFixed(2)} Hz`;
    }
  };
  
  const calculateResonance = () => {
    const inductanceH = convertInductanceToHenry(inductance, inductanceUnit);
    const capacitanceF = convertCapacitanceToFarad(capacitance, capacitanceUnit);
    
    // Resonant frequency: f = 1 / (2π√LC)
    const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(inductanceH * capacitanceF));
    setResonanceFrequency(resonantFreq);
    
    // Calculate impedance at resonance (just the resistance)
    setImpedanceAtResonance(resistance);
    
    // Bandwidth calculation: BW = f0/Q
    const bandwidth = resonantFreq / quality;
    setBandwidthResult(bandwidth);
  };
  
  const calculateImpedanceVsFrequency = (frequency: number) => {
    const inductanceH = convertInductanceToHenry(inductance, inductanceUnit);
    const capacitanceF = convertCapacitanceToFarad(capacitance, capacitanceUnit);
    
    const XL = calculateInductiveReactance(frequency, inductanceH);
    const XC = calculateCapacitiveReactance(frequency, capacitanceF);
    
    // Impedance at a specific frequency
    const Z = Math.sqrt(Math.pow(resistance, 2) + Math.pow(XL - XC, 2));
    return Z;
  };

  return (
    <CalculatorLayout 
      title="Resonance Calculator" 
      description="Calculate resonant frequency, bandwidth, and impedance for LC circuits"
    >
      <Tabs defaultValue="resonance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resonance">Resonance Properties</TabsTrigger>
          <TabsTrigger value="impedance">Impedance Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resonance" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="inductance" className="calculator-label">Inductance</Label>
                  <Input
                    id="inductance"
                    type="number"
                    min="0.001"
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
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="capacitance" className="calculator-label">Capacitance</Label>
                  <Input
                    id="capacitance"
                    type="number"
                    min="0.001"
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality" className="calculator-label">Quality Factor (Q)</Label>
                <Input
                  id="quality"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
              <div>
                <Label htmlFor="resistance" className="calculator-label">Series Resistance (Ω)</Label>
                <Input
                  id="resistance"
                  type="number"
                  min="0"
                  step="0.1"
                  value={resistance}
                  onChange={(e) => setResistance(parseFloat(e.target.value) || 0)}
                  className="calculator-input"
                />
              </div>
            </div>
            
            <Button onClick={calculateResonance} className="w-full">Calculate Resonance</Button>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="calculator-label">Resonance Frequency</p>
                <div className="calculator-result">
                  {resonanceFrequency ? formatFrequency(resonanceFrequency) : "—"}
                </div>
              </div>
              <div>
                <p className="calculator-label">Impedance at Resonance</p>
                <div className="calculator-result">
                  {impedanceAtResonance ? `${impedanceAtResonance.toFixed(2)} Ω` : "—"}
                </div>
              </div>
            </div>
            
            <div>
              <p className="calculator-label">Bandwidth</p>
              <div className="calculator-result">
                {bandwidthResult ? formatFrequency(bandwidthResult) : "—"}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Resonance occurs when inductive and capacitive reactances are equal.</p>
              <p className="mt-2">Resonant Frequency: f₀ = 1/(2π√LC)</p>
              <p>Bandwidth: BW = f₀/Q</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="impedance" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This tab shows impedance values at different frequencies relative to the resonance point.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="calculator-label">At 0.5× Resonance</p>
                  <div className="calculator-result">
                    {resonanceFrequency ? 
                      `${calculateImpedanceVsFrequency(resonanceFrequency * 0.5).toFixed(2)} Ω` : 
                      "Calculate resonance first"}
                  </div>
                </div>
                <div>
                  <p className="calculator-label">At 0.9× Resonance</p>
                  <div className="calculator-result">
                    {resonanceFrequency ? 
                      `${calculateImpedanceVsFrequency(resonanceFrequency * 0.9).toFixed(2)} Ω` : 
                      "Calculate resonance first"}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="calculator-label">At Resonance</p>
                <div className="calculator-result">
                  {resonanceFrequency ? 
                    `${calculateImpedanceVsFrequency(resonanceFrequency).toFixed(2)} Ω` : 
                    "Calculate resonance first"}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="calculator-label">At 1.1× Resonance</p>
                  <div className="calculator-result">
                    {resonanceFrequency ? 
                      `${calculateImpedanceVsFrequency(resonanceFrequency * 1.1).toFixed(2)} Ω` : 
                      "Calculate resonance first"}
                  </div>
                </div>
                <div>
                  <p className="calculator-label">At 2× Resonance</p>
                  <div className="calculator-result">
                    {resonanceFrequency ? 
                      `${calculateImpedanceVsFrequency(resonanceFrequency * 2).toFixed(2)} Ω` : 
                      "Calculate resonance first"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>At resonance, the impedance is at its minimum in a series circuit (equal to R).</p>
              <p>Below resonance, the circuit is capacitive dominant.</p>
              <p>Above resonance, the circuit is inductive dominant.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorLayout>
  );
};

export default ResonanceCalculator;

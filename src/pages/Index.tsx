
import React from 'react';
import CalculatorCard from '@/components/CalculatorCard';
import { Battery, Bolt, Cable, Calculator, Gauge, PlugZap, Zap, CircuitBoard, FlaskConical, Cpu, Layers, Lightbulb, Waves } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-12 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Electrician Calculator</h1>
          </div>
          <p className="mt-4 text-primary-foreground/90 max-w-xl">
            Professional-grade calculators for electrical calculations. 
            Simplify your electrical work with accurate calculations for Ohm's Law, 
            wire sizing, voltage drop, AC/DC circuits, component values, and more.
          </p>
        </div>
      </header>
      
      <main className="container py-12">
        <h2 className="text-2xl font-bold mb-8">Available Calculators</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard 
            title="Ohm's Law Calculator" 
            description="Calculate voltage, current, resistance, and power using Ohm's Law."
            icon={Bolt}
            path="/ohms-law"
          />
          
          <CalculatorCard 
            title="Wire Size Calculator" 
            description="Determine appropriate wire gauge (AWG) based on current and distance."
            icon={Cable}
            path="/wire-size"
          />
          
          <CalculatorCard 
            title="Voltage Drop Calculator" 
            description="Calculate voltage drop in circuits and check against NEC recommendations."
            icon={Zap}
            path="/voltage-drop"
          />
          
          <CalculatorCard 
            title="Power Factor Calculator" 
            description="Calculate and analyze power factor in AC electrical systems."
            icon={Gauge}
            path="/power-factor"
          />
          
          <CalculatorCard 
            title="AC Circuit Calculator" 
            description="Calculate impedance, phase angle, and power in AC circuits with resistors, capacitors, and inductors."
            icon={CircuitBoard}
            path="/ac-circuit"
          />
          
          <CalculatorCard 
            title="DC Circuit Calculator" 
            description="Analyze series, parallel, and complex DC circuits with multiple power sources."
            icon={Battery}
            path="/dc-circuit"
          />
          
          <CalculatorCard 
            title="Color Code Calculator" 
            description="Decode and encode resistor, inductor, and capacitor color bands."
            icon={Lightbulb}
            path="/color-code"
          />
          
          <CalculatorCard 
            title="Capacitor Calculator" 
            description="Calculate capacitance, reactance, impedance, and energy storage in capacitors."
            icon={FlaskConical}
            path="/capacitor"
          />
          
          <CalculatorCard 
            title="Inductor Calculator" 
            description="Calculate inductance, reactance, impedance, and energy storage in inductors."
            icon={Cpu}
            path="/inductor"
          />
          
          <CalculatorCard 
            title="Resonance Calculator" 
            description="Calculate resonant frequency, bandwidth, and impedance for LC circuits."
            icon={Waves}
            path="/resonance"
          />
          
          <CalculatorCard 
            title="Unit Converter" 
            description="Convert between different electrical units (voltage, current, power, resistance)."
            icon={PlugZap}
            path="/unit-converter"
          />
        </div>
      </main>
      
      <footer className="bg-muted py-6">
        <div className="container text-center text-muted-foreground">
          <p className="text-sm">
            This calculator is for reference only. Always consult with a licensed electrician 
            and follow local electrical codes for all electrical work.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

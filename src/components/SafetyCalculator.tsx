
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";

const SafetyCalculator: React.FC = () => {
  const { toast } = useToast();
  
  // GFCI Trip Time Calculator
  const [faultCurrent, setFaultCurrent] = useState<number | ''>('');
  const [gfciTripTime, setGfciTripTime] = useState<string>('');
  
  // Arc Flash Calculator
  const [voltage, setVoltage] = useState<number | ''>('');
  const [current, setCurrent] = useState<number | ''>('');
  const [distance, setDistance] = useState<number | ''>('');
  const [arcFlashEnergy, setArcFlashEnergy] = useState<string>('');
  
  // Touch Potential Calculator
  const [bodyResistance, setBodyResistance] = useState<number | ''>(1000);
  const [touchVoltage, setTouchVoltage] = useState<number | ''>('');
  const [touchCurrent, setTouchCurrent] = useState<string>('');

  // Safe Disconnection Time Calculator
  const [systemVoltage, setSystemVoltage] = useState<number | ''>('');
  const [bodyWeight, setBodyWeight] = useState<number | ''>('');
  const [safeDisconnectionTime, setSafeDisconnectionTime] = useState<string>('');

  const calculateGfciTripTime = () => {
    if (faultCurrent === '') {
      toast({
        title: "Missing values",
        description: "Please enter the fault current",
        variant: "destructive",
      });
      return;
    }

    let tripTime: string;
    const faultCurrentValue = Number(faultCurrent);
    
    if (faultCurrentValue <= 5) {
      tripTime = "≥ 25 ms";
    } else if (faultCurrentValue <= 15) {
      tripTime = "≤ 10 ms";
    } else if (faultCurrentValue <= 30) {
      tripTime = "≤ 5 ms";
    } else {
      tripTime = "≤ 3 ms";
    }
    
    setGfciTripTime(tripTime);
    
    toast({
      title: "Calculation Complete",
      description: "GFCI trip time calculated successfully.",
    });
  };

  const calculateArcFlash = () => {
    if (voltage === '' || current === '' || distance === '') {
      toast({
        title: "Missing values",
        description: "Please enter all values for arc flash calculation",
        variant: "destructive",
      });
      return;
    }

    // Simplified arc flash energy calculation
    // This is a basic approximation - real calculations are more complex
    const voltageValue = Number(voltage);
    const currentValue = Number(current);
    const distanceValue = Number(distance);
    
    // E = (V × I × t) / (2 × π × D²)
    // Using a fixed time of 0.2 seconds for this example
    const arcTime = 0.2; // seconds
    const energy = (voltageValue * currentValue * arcTime) / (2 * Math.PI * Math.pow(distanceValue, 2));
    
    let hazardCategory = "";
    if (energy < 4) {
      hazardCategory = "Category 1";
    } else if (energy < 8) {
      hazardCategory = "Category 2";
    } else if (energy < 25) {
      hazardCategory = "Category 3";
    } else if (energy < 40) {
      hazardCategory = "Category 4";
    } else {
      hazardCategory = "Dangerous - No Standard PPE Available";
    }
    
    setArcFlashEnergy(`${energy.toFixed(2)} cal/cm² - ${hazardCategory}`);
    
    toast({
      title: "Calculation Complete",
      description: "Arc flash energy calculated successfully.",
    });
  };

  const calculateTouchPotential = () => {
    if (touchVoltage === '' || bodyResistance === '') {
      toast({
        title: "Missing values",
        description: "Please enter touch voltage and body resistance",
        variant: "destructive",
      });
      return;
    }

    // I = V/R
    const current = Number(touchVoltage) / Number(bodyResistance);
    
    // Current in milliamps
    const currentInMA = current * 1000;
    
    let effect = "";
    if (currentInMA < 1) {
      effect = "Generally not perceptible";
    } else if (currentInMA < 5) {
      effect = "Slight tingling sensation";
    } else if (currentInMA < 10) {
      effect = "Paresthesia (tingling)";
    } else if (currentInMA < 30) {
      effect = "Muscular contraction possible";
    } else if (currentInMA < 50) {
      effect = "Pain, strong muscular contraction";
    } else if (currentInMA < 100) {
      effect = "Ventricular fibrillation possible";
    } else if (currentInMA < 200) {
      effect = "Ventricular fibrillation likely";
    } else {
      effect = "Severe burns and cardiac arrest";
    }
    
    setTouchCurrent(`${currentInMA.toFixed(2)} mA - ${effect}`);
    
    toast({
      title: "Calculation Complete",
      description: "Touch current calculated successfully.",
    });
  };

  const calculateSafeDisconnection = () => {
    if (systemVoltage === '' || bodyWeight === '') {
      toast({
        title: "Missing values",
        description: "Please enter system voltage and body weight",
        variant: "destructive",
      });
      return;
    }

    // This is a simplified calculation for educational purposes
    // Real calculations would follow specific safety standards
    
    const voltageValue = Number(systemVoltage);
    const weightValue = Number(bodyWeight);
    
    // Simplified formula: t = (116 / V) * (W/70)^0.75
    // where t is time in seconds, V is voltage, W is weight in kg
    
    const safeTime = (116 / voltageValue) * Math.pow((weightValue/70), 0.75);
    
    let recommendation = "";
    if (safeTime < 0.05) {
      recommendation = "Immediate disconnection required";
    } else if (safeTime < 0.2) {
      recommendation = "Fast disconnection recommended";
    } else if (safeTime < 0.5) {
      recommendation = "Standard protection sufficient";
    } else {
      recommendation = "Basic protection acceptable";
    }
    
    setSafeDisconnectionTime(`${safeTime.toFixed(3)} seconds - ${recommendation}`);
    
    toast({
      title: "Calculation Complete",
      description: "Safe disconnection time calculated successfully.",
    });
  };

  return (
    <CalculatorLayout 
      title="Safety Calculator" 
      description="Calculate electrical safety parameters including GFCI trip time, arc flash energy, touch potential, and safe disconnection time."
    >
      <div className="space-y-6">
        <Collapsible className="w-full border rounded-lg p-2">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">GFCI Trip Time Calculator</h3>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
            <div>
              <Label htmlFor="faultCurrent">Fault Current (mA)</Label>
              <Input 
                id="faultCurrent" 
                type="number" 
                placeholder="Enter fault current"
                value={faultCurrent}
                onChange={(e) => setFaultCurrent(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            
            <Button onClick={calculateGfciTripTime}>
              Calculate GFCI Trip Time
            </Button>
            
            {gfciTripTime && (
              <Card className="mt-4 bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-semibold">Expected GFCI Trip Time:</h4>
                  <p className="text-xl font-bold mt-2">{gfciTripTime}</p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Class A GFCI devices must trip when ground faults are 6mA or higher.
                  </p>
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="w-full border rounded-lg p-2">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Arc Flash Calculator</h3>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
            <div>
              <Label htmlFor="voltage">System Voltage (V)</Label>
              <Input 
                id="voltage" 
                type="number" 
                placeholder="Enter system voltage"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            
            <div>
              <Label htmlFor="current">Fault Current (kA)</Label>
              <Input 
                id="current" 
                type="number" 
                placeholder="Enter fault current"
                value={current}
                onChange={(e) => setCurrent(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            
            <div>
              <Label htmlFor="distance">Working Distance (feet)</Label>
              <Input 
                id="distance" 
                type="number" 
                placeholder="Enter working distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            
            <Button onClick={calculateArcFlash}>
              Calculate Arc Flash Energy
            </Button>
            
            {arcFlashEnergy && (
              <Card className="mt-4 bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-semibold">Arc Flash Energy:</h4>
                  <p className="text-xl font-bold mt-2">{arcFlashEnergy}</p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Note: This is a simplified calculation. For critical safety analysis, a detailed arc flash study should be performed.
                  </p>
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="w-full border rounded-lg p-2">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Touch Potential Calculator</h3>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
            <div>
              <Label htmlFor="touchVoltage">Touch Voltage (V)</Label>
              <Input 
                id="touchVoltage" 
                type="number" 
                placeholder="Enter touch voltage"
                value={touchVoltage}
                onChange={(e) => setTouchVoltage(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            
            <div>
              <Label htmlFor="bodyResistance">Body Resistance (Ω)</Label>
              <Input 
                id="bodyResistance" 
                type="number" 
                placeholder="Enter body resistance"
                value={bodyResistance}
                onChange={(e) => setBodyResistance(e.target.value ? parseFloat(e.target.value) : '')}
              />
              <p className="text-xs text-muted-foreground mt-1">Typical dry skin resistance: 1,000-100,000Ω. Wet skin: 300-1,000Ω.</p>
            </div>
            
            <Button onClick={calculateTouchPotential}>
              Calculate Touch Current
            </Button>
            
            {touchCurrent && (
              <Card className="mt-4 bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-semibold">Touch Current:</h4>
                  <p className="text-xl font-bold mt-2">{touchCurrent}</p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    As little as 10mA can cause painful to severe shock. Currents above 100mA can be lethal.
                  </p>
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="w-full border rounded-lg p-2">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Safe Disconnection Time Calculator</h3>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
            <div>
              <Label htmlFor="systemVoltage">System Voltage (V)</Label>
              <Input 
                id="systemVoltage" 
                type="number" 
                placeholder="Enter system voltage"
                value={systemVoltage}
                onChange={(e) => setSystemVoltage(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            
            <div>
              <Label htmlFor="bodyWeight">Body Weight (kg)</Label>
              <Input 
                id="bodyWeight" 
                type="number" 
                placeholder="Enter body weight"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            
            <Button onClick={calculateSafeDisconnection}>
              Calculate Safe Disconnection Time
            </Button>
            
            {safeDisconnectionTime && (
              <Card className="mt-4 bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-semibold">Safe Disconnection Time:</h4>
                  <p className="text-xl font-bold mt-2">{safeDisconnectionTime}</p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    This indicates the maximum time a circuit should remain energized under fault conditions to prevent injury or death.
                  </p>
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>

        <div className="p-4 bg-accent rounded-lg mt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Safety Compliance Guidelines:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>NFPA 70E requires an Arc Flash Analysis for equipment operating at 50V or higher</li>
            <li>OSHA 1910.333 requires safe work practices to prevent electric shock</li>
            <li>NEC 210.8 requires GFCI protection for all 125V-250V, 15A and 20A receptacles in specific locations</li>
            <li>IEEE 80 provides guidelines for limiting touch and step potentials in substations</li>
            <li>NEC 250 details grounding and bonding requirements for electrical safety</li>
          </ul>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default SafetyCalculator;

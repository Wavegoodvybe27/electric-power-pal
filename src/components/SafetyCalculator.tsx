import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronDown, ShieldCheck, Bolt, Zap, PlugZap, CircuitBoard, Thermometer } from "lucide-react";
import { calculateJouleHeating, calculateVoltageDivider, calculateCurrentDivider } from '@/utils/safetyCalculations';

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

  // AC/DC Shock Risk Calculator
  const [circuitType, setCircuitType] = useState<string>('ac');
  const [circuitVoltage, setCircuitVoltage] = useState<number | ''>('');
  const [exposureCondition, setExposureCondition] = useState<string>('dry');
  const [shockRisk, setShockRisk] = useState<string>('');
  
  // Joule Effect Calculator
  const [conductorCurrent, setConductorCurrent] = useState<number | ''>('');
  const [conductorResistance, setConductorResistance] = useState<number | ''>('');
  const [heatTime, setHeatTime] = useState<number | ''>(1);
  const [jouleHeat, setJouleHeat] = useState<string>('');
  
  // Environmental Risk Assessment
  const [environment, setEnvironment] = useState<string>('dry');
  const [atmosphereType, setAtmosphereType] = useState<string>('normal');
  const [temperatureC, setTemperatureC] = useState<number | ''>(20);
  const [environmentalRisk, setEnvironmentalRisk] = useState<string>('');
  
  // Voltage Divider Calculator
  const [inputVoltage, setInputVoltage] = useState<number | ''>('');
  const [resistor1, setResistor1] = useState<number | ''>('');
  const [resistor2, setResistor2] = useState<number | ''>('');
  const [outputVoltage, setOutputVoltage] = useState<string>('');
  
  // Current Divider Calculator
  const [totalCurrent, setTotalCurrent] = useState<number | ''>('');
  const [resistorA, setResistorA] = useState<number | ''>('');
  const [resistorB, setResistorB] = useState<number | ''>('');
  const [currentThroughA, setCurrentThroughA] = useState<string>('');
  const [currentThroughB, setCurrentThroughB] = useState<string>('');

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
  
  const calculateACDCShockRisk = () => {
    if (circuitVoltage === '') {
      toast({
        title: "Missing values",
        description: "Please enter the circuit voltage",
        variant: "destructive",
      });
      return;
    }
    
    const voltageValue = Number(circuitVoltage);
    let riskLevel = "";
    let riskDescription = "";
    
    // Adjust risk calculation based on AC or DC
    if (circuitType === 'ac') {
      if (exposureCondition === 'wet') {
        // Higher risk in wet conditions
        if (voltageValue < 5) {
          riskLevel = "Very Low";
          riskDescription = "Generally safe but avoid prolonged contact";
        } else if (voltageValue < 30) {
          riskLevel = "Low";
          riskDescription = "Mild shock sensation, can be dangerous with prolonged contact";
        } else if (voltageValue < 50) {
          riskLevel = "Moderate";
          riskDescription = "Painful shock, muscle control difficulty possible";
        } else if (voltageValue < 100) {
          riskLevel = "High";
          riskDescription = "Severe shock, respiratory arrest possible";
        } else {
          riskLevel = "Extreme";
          riskDescription = "Potential cardiac arrest and severe burns";
        }
      } else {
        // Dry conditions
        if (voltageValue < 25) {
          riskLevel = "Very Low";
          riskDescription = "Generally safe but avoid prolonged contact";
        } else if (voltageValue < 50) {
          riskLevel = "Low";
          riskDescription = "Mild shock sensation, not usually harmful";
        } else if (voltageValue < 120) {
          riskLevel = "Moderate";
          riskDescription = "Painful shock, involuntary muscle contraction possible";
        } else if (voltageValue < 240) {
          riskLevel = "High";
          riskDescription = "Severe shock, respiratory arrest possible";
        } else {
          riskLevel = "Extreme";
          riskDescription = "Potential cardiac arrest and severe burns";
        }
      }
    } else {
      // DC generally less dangerous at the same voltage level
      if (exposureCondition === 'wet') {
        if (voltageValue < 10) {
          riskLevel = "Very Low";
          riskDescription = "Generally safe";
        } else if (voltageValue < 40) {
          riskLevel = "Low";
          riskDescription = "Mild shock sensation possible";
        } else if (voltageValue < 60) {
          riskLevel = "Moderate";
          riskDescription = "Painful shock possible";
        } else if (voltageValue < 120) {
          riskLevel = "High";
          riskDescription = "Severe shock, risk of injury";
        } else {
          riskLevel = "Extreme";
          riskDescription = "Risk of cardiac effects and severe burns";
        }
      } else {
        if (voltageValue < 40) {
          riskLevel = "Very Low";
          riskDescription = "Generally safe";
        } else if (voltageValue < 60) {
          riskLevel = "Low";
          riskDescription = "Mild shock sensation possible";
        } else if (voltageValue < 120) {
          riskLevel = "Moderate";
          riskDescription = "Painful shock possible";
        } else if (voltageValue < 300) {
          riskLevel = "High";
          riskDescription = "Severe shock possible";
        } else {
          riskLevel = "Extreme";
          riskDescription = "Risk of cardiac effects and severe burns";
        }
      }
    }
    
    setShockRisk(`${riskLevel} - ${riskDescription}`);
    
    toast({
      title: "Calculation Complete",
      description: "AC/DC shock risk calculated successfully.",
    });
  };
  
  const calculateJouleHeatEffect = () => {
    if (conductorCurrent === '' || conductorResistance === '' || heatTime === '') {
      toast({
        title: "Missing values",
        description: "Please enter all values for Joule heating calculation",
        variant: "destructive",
      });
      return;
    }
    
    const result = calculateJouleHeating(
      Number(conductorCurrent),
      Number(conductorResistance),
      Number(heatTime)
    );
    
    setJouleHeat(`${result.energy.toFixed(2)} Joules - ${result.temperature.toFixed(2)} °C rise`);
    
    toast({
      title: "Calculation Complete",
      description: "Joule heating calculated successfully.",
    });
  };
  
  const assessEnvironmentalRisk = () => {
    if (temperatureC === '') {
      toast({
        title: "Missing values",
        description: "Please enter the temperature",
        variant: "destructive",
      });
      return;
    }
    
    let riskLevel = "";
    let recommendations = "";
    
    const tempValue = Number(temperatureC);
    
    // Base risk level on environment
    if (environment === 'wet') {
      riskLevel = "High";
      recommendations = "Use GFCI protection, insulated tools and rubber mats";
    } else if (environment === 'damp') {
      riskLevel = "Moderate";
      recommendations = "Use GFCI protection and maintain proper insulation";
    } else {
      riskLevel = "Lower";
      recommendations = "Standard safety protocols sufficient";
    }
    
    // Adjust for temperature
    if (tempValue > 35) {
      riskLevel = "Very High";
      recommendations += ", limit work duration, ensure proper hydration";
    } else if (tempValue < 0) {
      riskLevel = "High";
      recommendations += ", beware of reduced dexterity from cold, use proper gloves";
    }
    
    // Adjust for atmosphere
    if (atmosphereType === 'explosive') {
      riskLevel = "Extreme";
      recommendations = "Use intrinsically safe equipment, avoid all sparks, implement hot work permit system";
    } else if (atmosphereType === 'corrosive') {
      riskLevel = "Very High";
      recommendations += ", use corrosion-resistant equipment, minimize exposure time";
    } else if (atmosphereType === 'conductive') {
      riskLevel = "High";
      recommendations += ", use extra insulation, isolated power supplies";
    }
    
    setEnvironmentalRisk(`${riskLevel} - ${recommendations}`);
    
    toast({
      title: "Assessment Complete",
      description: "Environmental risk assessment completed successfully.",
    });
  };
  
  const calculateVDivider = () => {
    if (inputVoltage === '' || resistor1 === '' || resistor2 === '') {
      toast({
        title: "Missing values",
        description: "Please enter all values for voltage divider calculation",
        variant: "destructive",
      });
      return;
    }
    
    const result = calculateVoltageDivider(
      Number(inputVoltage),
      Number(resistor1),
      Number(resistor2)
    );
    
    setOutputVoltage(`${result.outputVoltage.toFixed(2)} V - Current: ${result.current.toFixed(4)} A`);
    
    toast({
      title: "Calculation Complete",
      description: "Voltage divider calculated successfully.",
    });
  };
  
  const calculateCDivider = () => {
    if (totalCurrent === '' || resistorA === '' || resistorB === '') {
      toast({
        title: "Missing values",
        description: "Please enter all values for current divider calculation",
        variant: "destructive",
      });
      return;
    }
    
    const result = calculateCurrentDivider(
      Number(totalCurrent),
      Number(resistorA),
      Number(resistorB)
    );
    
    setCurrentThroughA(`${result.currentA.toFixed(4)} A`);
    setCurrentThroughB(`${result.currentB.toFixed(4)} A`);
    
    toast({
      title: "Calculation Complete",
      description: "Current divider calculated successfully.",
    });
  };

  return (
    <CalculatorLayout 
      title="Safety Calculator" 
      description="Calculate electrical safety parameters including GFCI trip time, arc flash energy, touch potential, and safe disconnection time."
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic Safety</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Safety</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <Collapsible className="w-full border rounded-lg p-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
              <div className="flex items-center gap-2">
                <CircuitBoard className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">AC/DC Shock Risk Calculator</h3>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="circuitType">Circuit Type</Label>
                  <Select
                    value={circuitType}
                    onValueChange={setCircuitType}
                  >
                    <SelectTrigger id="circuitType">
                      <SelectValue placeholder="Select circuit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ac">AC (Alternating Current)</SelectItem>
                      <SelectItem value="dc">DC (Direct Current)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="exposureCondition">Exposure Condition</Label>
                  <Select
                    value={exposureCondition}
                    onValueChange={setExposureCondition}
                  >
                    <SelectTrigger id="exposureCondition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry">Dry Conditions</SelectItem>
                      <SelectItem value="wet">Wet/Damp Conditions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="circuitVoltage">Circuit Voltage (V)</Label>
                <Input 
                  id="circuitVoltage" 
                  type="number" 
                  placeholder="Enter circuit voltage"
                  value={circuitVoltage}
                  onChange={(e) => setCircuitVoltage(e.target.value ? parseFloat(e.target.value) : '')}
                />
              </div>
              
              <Button onClick={calculateACDCShockRisk}>
                Calculate Shock Risk
              </Button>
              
              {shockRisk && (
                <Card className="mt-4 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Shock Risk Assessment:</h4>
                    <p className="text-xl font-bold mt-2">{shockRisk}</p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      {circuitType === 'ac' ? 
                        "AC is generally more dangerous than DC at the same voltage level due to its effect on the heart." :
                        "DC is generally less dangerous than AC at the same voltage level but can cause muscle tetanus."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="w-full border rounded-lg p-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Joule Heating Calculator</h3>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="conductorCurrent">Current (A)</Label>
                  <Input 
                    id="conductorCurrent" 
                    type="number" 
                    placeholder="Enter current"
                    value={conductorCurrent}
                    onChange={(e) => setConductorCurrent(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="conductorResistance">Resistance (Ω)</Label>
                  <Input 
                    id="conductorResistance" 
                    type="number" 
                    placeholder="Enter resistance"
                    value={conductorResistance}
                    onChange={(e) => setConductorResistance(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="heatTime">Time (seconds)</Label>
                <Input 
                  id="heatTime" 
                  type="number" 
                  placeholder="Enter time"
                  value={heatTime}
                  onChange={(e) => setHeatTime(e.target.value ? parseFloat(e.target.value) : '')}
                />
              </div>
              
              <Button onClick={calculateJouleHeatEffect}>
                Calculate Joule Heating
              </Button>
              
              {jouleHeat && (
                <Card className="mt-4 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Joule Heating Effect:</h4>
                    <p className="text-xl font-bold mt-2">{jouleHeat}</p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Joule heating (I²R) can cause thermal damage to conductors and surrounding materials.
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
                <h3 className="text-lg font-medium">Environmental Risk Assessment</h3>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={environment}
                    onValueChange={setEnvironment}
                  >
                    <SelectTrigger id="environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry">Dry</SelectItem>
                      <SelectItem value="damp">Damp</SelectItem>
                      <SelectItem value="wet">Wet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="atmosphereType">Atmosphere</Label>
                  <Select
                    value={atmosphereType}
                    onValueChange={setAtmosphereType}
                  >
                    <SelectTrigger id="atmosphereType">
                      <SelectValue placeholder="Select atmosphere" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="dusty">Dusty</SelectItem>
                      <SelectItem value="conductive">Conductive Dust</SelectItem>
                      <SelectItem value="corrosive">Corrosive</SelectItem>
                      <SelectItem value="explosive">Explosive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="temperatureC">Temperature (°C)</Label>
                <Input 
                  id="temperatureC" 
                  type="number" 
                  placeholder="Enter temperature"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(e.target.value ? parseFloat(e.target.value) : '')}
                />
              </div>
              
              <Button onClick={assessEnvironmentalRisk}>
                Assess Environmental Risk
              </Button>
              
              {environmentalRisk && (
                <Card className="mt-4 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Environmental Risk Assessment:</h4>
                    <p className="text-xl font-bold mt-2">{environmentalRisk}</p>
                  </CardContent>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="w-full border rounded-lg p-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Voltage Divider Calculator</h3>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
              <div>
                <Label htmlFor="inputVoltage">Input Voltage (V)</Label>
                <Input 
                  id="inputVoltage" 
                  type="number" 
                  placeholder="Enter input voltage"
                  value={inputVoltage}
                  onChange={(e) => setInputVoltage(e.target.value ? parseFloat(e.target.value) : '')}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resistor1">Resistor 1 (Ω)</Label>
                  <Input 
                    id="resistor1" 
                    type="number" 
                    placeholder="Enter R1 value"
                    value={resistor1}
                    onChange={(e) => setResistor1(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="resistor2">Resistor 2 (Ω)</Label>
                  <Input 
                    id="resistor2" 
                    type="number" 
                    placeholder="Enter R2 value"
                    value={resistor2}
                    onChange={(e) => setResistor2(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
              </div>
              
              <Button onClick={calculateVDivider}>
                Calculate Output Voltage
              </Button>
              
              {outputVoltage && (
                <Card className="mt-4 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Voltage Divider Output:</h4>
                    <p className="text-xl font-bold mt-2">{outputVoltage}</p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Formula: Vout = Vin × (R2 / (R1 + R2))
                    </p>
                  </CardContent>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="w-full border rounded-lg p-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
              <div className="flex items-center gap-2">
                <Bolt className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Current Divider Calculator</h3>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pt-2 pb-4 space-y-4">
              <div>
                <Label htmlFor="totalCurrent">Total Current (A)</Label>
                <Input 
                  id="totalCurrent" 
                  type="number" 
                  placeholder="Enter total current"
                  value={totalCurrent}
                  onChange={(e) => setTotalCurrent(e.target.value ? parseFloat(e.target.value) : '')}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resistorA">Resistor A (Ω)</Label>
                  <Input 
                    id="resistorA" 
                    type="number" 
                    placeholder="Enter RA value"
                    value={resistorA}
                    onChange={(e) => setResistorA(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="resistorB">Resistor B (Ω)</Label>
                  <Input 
                    id="resistorB" 
                    type="number" 
                    placeholder="Enter RB value"
                    value={resistorB}
                    onChange={(e) => setResistorB(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
              </div>
              
              <Button onClick={calculateCDivider}>
                Calculate Branch Currents
              </Button>
              
              {currentThroughA && (
                <Card className="mt-4 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Current Divider Results:</h4>
                    <p className="font-medium mt-2">Current through Resistor A: <span className="font-bold">{currentThroughA}</span></p>
                    <p className="font-medium">Current through Resistor B: <span className="font-bold">{currentThroughB}</span></p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Formula: IA = I × (RB / (RA + RB))
                    </p>
                  </CardContent>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>
      </Tabs>

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
          <li>IEEE 1584 provides a guide for performing arc flash hazard calculations</li>
          <li>NFPA 497 covers classification of hazardous locations for electrical installations</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
};

export default SafetyCalculator;

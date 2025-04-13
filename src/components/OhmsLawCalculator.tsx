
import React, { useState, useEffect } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateVoltage, calculateCurrent, calculateResistance, calculatePower } from '@/utils/electricalCalculations';
import { useToast } from "@/components/ui/use-toast";

const OhmsLawCalculator: React.FC = () => {
  const { toast } = useToast();
  const [voltage, setVoltage] = useState<number | ''>('');
  const [current, setCurrent] = useState<number | ''>('');
  const [resistance, setResistance] = useState<number | ''>('');
  const [power, setPower] = useState<number | ''>('');
  const [solveFor, setSolveFor] = useState('voltage');

  const handleCalculate = () => {
    try {
      if (solveFor === 'voltage') {
        if (current === '' || resistance === '') {
          toast({
            title: "Missing values",
            description: "Please enter current and resistance values",
            variant: "destructive",
          });
          return;
        }
        const result = calculateVoltage(Number(current), Number(resistance));
        setVoltage(result);
        setPower(calculatePower(result, Number(current)));
      } 
      else if (solveFor === 'current') {
        if (voltage === '' || resistance === '') {
          toast({
            title: "Missing values",
            description: "Please enter voltage and resistance values",
            variant: "destructive",
          });
          return;
        }
        const result = calculateCurrent(Number(voltage), Number(resistance));
        setCurrent(result);
        setPower(calculatePower(Number(voltage), result));
      } 
      else if (solveFor === 'resistance') {
        if (voltage === '' || current === '') {
          toast({
            title: "Missing values",
            description: "Please enter voltage and current values",
            variant: "destructive",
          });
          return;
        }
        const result = calculateResistance(Number(voltage), Number(current));
        setResistance(result);
        setPower(calculatePower(Number(voltage), Number(current)));
      } 
      else if (solveFor === 'power') {
        if (voltage === '' || current === '') {
          toast({
            title: "Missing values",
            description: "Please enter voltage and current values",
            variant: "destructive",
          });
          return;
        }
        const result = calculatePower(Number(voltage), Number(current));
        setPower(result);
      }

      toast({
        title: "Calculation Complete",
        description: `${solveFor.charAt(0).toUpperCase() + solveFor.slice(1)} calculated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was an error performing the calculation.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setPower('');
  };

  useEffect(() => {
    // Clear the field we're solving for
    if (solveFor === 'voltage') setVoltage('');
    else if (solveFor === 'current') setCurrent('');
    else if (solveFor === 'resistance') setResistance('');
    else if (solveFor === 'power') setPower('');
  }, [solveFor]);

  return (
    <CalculatorLayout 
      title="Ohm's Law Calculator" 
      description="Calculate voltage, current, resistance, and power using Ohm's Law."
    >
      <div className="space-y-6">
        <div>
          <Label>Solve for</Label>
          <Select 
            value={solveFor} 
            onValueChange={(value) => setSolveFor(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value to calculate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voltage">Voltage (V)</SelectItem>
              <SelectItem value="current">Current (A)</SelectItem>
              <SelectItem value="resistance">Resistance (Ω)</SelectItem>
              <SelectItem value="power">Power (W)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="voltage">Voltage (V)</Label>
            <Input 
              id="voltage" 
              type="number" 
              placeholder="Enter voltage"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value ? parseFloat(e.target.value) : '')}
              disabled={solveFor === 'voltage'}
              className="calculator-input"
            />
          </div>
          
          <div>
            <Label htmlFor="current">Current (A)</Label>
            <Input 
              id="current" 
              type="number" 
              placeholder="Enter current"
              value={current}
              onChange={(e) => setCurrent(e.target.value ? parseFloat(e.target.value) : '')}
              disabled={solveFor === 'current'}
              className="calculator-input"
            />
          </div>
          
          <div>
            <Label htmlFor="resistance">Resistance (Ω)</Label>
            <Input 
              id="resistance" 
              type="number" 
              placeholder="Enter resistance"
              value={resistance}
              onChange={(e) => setResistance(e.target.value ? parseFloat(e.target.value) : '')}
              disabled={solveFor === 'resistance'}
              className="calculator-input"
            />
          </div>
          
          <div>
            <Label htmlFor="power">Power (W)</Label>
            <Input 
              id="power" 
              type="number" 
              placeholder="Enter power"
              value={power}
              onChange={(e) => setPower(e.target.value ? parseFloat(e.target.value) : '')}
              disabled={solveFor === 'power'}
              className="calculator-input"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleCalculate}>
            Calculate
          </Button>
        </div>

        {/* Formulas reference */}
        <div className="mt-6 p-4 bg-accent rounded-md">
          <h3 className="font-semibold mb-2">Ohm's Law Formulas:</h3>
          <ul className="space-y-1 text-sm">
            <li>Voltage (V) = Current (I) × Resistance (R)</li>
            <li>Current (I) = Voltage (V) ÷ Resistance (R)</li>
            <li>Resistance (R) = Voltage (V) ÷ Current (I)</li>
            <li>Power (P) = Voltage (V) × Current (I)</li>
          </ul>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default OhmsLawCalculator;

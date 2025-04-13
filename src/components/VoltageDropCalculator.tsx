
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateVoltageDrop } from '@/utils/electricalCalculations';
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const VoltageDropCalculator: React.FC = () => {
  const { toast } = useToast();
  const [current, setCurrent] = useState<number | ''>('');
  const [length, setLength] = useState<number | ''>('');
  const [wireSize, setWireSize] = useState('10');
  const [material, setMaterial] = useState('copper');
  const [voltageDrop, setVoltageDrop] = useState<number | null>(null);
  const [systemVoltage, setSystemVoltage] = useState<number | ''>('');
  const [dropPercentage, setDropPercentage] = useState<number | null>(null);

  const handleCalculate = () => {
    try {
      if (current === '' || length === '' || systemVoltage === '') {
        toast({
          title: "Missing values",
          description: "Please enter all required values",
          variant: "destructive",
        });
        return;
      }

      const vDrop = calculateVoltageDrop(Number(current), Number(length), wireSize, material);
      setVoltageDrop(parseFloat(vDrop.toFixed(2)));
      
      // Calculate percentage of voltage drop
      const percentDrop = (vDrop / Number(systemVoltage)) * 100;
      setDropPercentage(parseFloat(percentDrop.toFixed(2)));

      toast({
        title: "Calculation Complete",
        description: "Voltage drop calculated successfully.",
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
    setCurrent('');
    setLength('');
    setWireSize('10');
    setMaterial('copper');
    setSystemVoltage('');
    setVoltageDrop(null);
    setDropPercentage(null);
  };

  return (
    <CalculatorLayout 
      title="Voltage Drop Calculator" 
      description="Calculate voltage drop in electrical circuits based on wire length and size."
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="current">Current (Amps)</Label>
          <Input 
            id="current" 
            type="number" 
            placeholder="Enter current"
            value={current}
            onChange={(e) => setCurrent(e.target.value ? parseFloat(e.target.value) : '')}
            className="calculator-input"
          />
        </div>
        
        <div>
          <Label htmlFor="systemVoltage">System Voltage (V)</Label>
          <Input 
            id="systemVoltage" 
            type="number" 
            placeholder="Enter system voltage (e.g., 120, 240)"
            value={systemVoltage}
            onChange={(e) => setSystemVoltage(e.target.value ? parseFloat(e.target.value) : '')}
            className="calculator-input"
          />
        </div>
        
        <div>
          <Label htmlFor="length">Wire Length (feet) - one way distance</Label>
          <Input 
            id="length" 
            type="number" 
            placeholder="Enter wire length"
            value={length}
            onChange={(e) => setLength(e.target.value ? parseFloat(e.target.value) : '')}
            className="calculator-input"
          />
        </div>
        
        <div>
          <Label>Wire Size (AWG)</Label>
          <Select value={wireSize} onValueChange={setWireSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select wire size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14">14 AWG</SelectItem>
              <SelectItem value="12">12 AWG</SelectItem>
              <SelectItem value="10">10 AWG</SelectItem>
              <SelectItem value="8">8 AWG</SelectItem>
              <SelectItem value="6">6 AWG</SelectItem>
              <SelectItem value="4">4 AWG</SelectItem>
              <SelectItem value="2">2 AWG</SelectItem>
              <SelectItem value="1">1 AWG</SelectItem>
              <SelectItem value="1/0">1/0 AWG</SelectItem>
              <SelectItem value="2/0">2/0 AWG</SelectItem>
              <SelectItem value="3/0">3/0 AWG</SelectItem>
              <SelectItem value="4/0">4/0 AWG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Wire Material</Label>
          <RadioGroup 
            value={material} 
            onValueChange={setMaterial}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="copper" id="copper" />
              <Label htmlFor="copper" className="cursor-pointer">Copper</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aluminum" id="aluminum" />
              <Label htmlFor="aluminum" className="cursor-pointer">Aluminum</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleCalculate}>
            Calculate
          </Button>
        </div>

        {voltageDrop !== null && dropPercentage !== null && (
          <div className="calculator-result">
            <h3 className="font-semibold">Voltage Drop Results:</h3>
            <div className="mt-2">
              <p className="text-xl font-bold">{voltageDrop} V</p>
              <p className="text-lg">{dropPercentage}% of supply voltage</p>
              
              <div className="mt-3 text-sm">
                <p className={dropPercentage <= 3 ? "text-green-600" : "text-red-600"}>
                  {dropPercentage <= 3 
                    ? "✓ Within recommended limits (under 3%)" 
                    : "⚠ Exceeds recommended 3% voltage drop limit"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Voltage Drop Info */}
        <div className="mt-6 p-4 bg-accent rounded-md">
          <h3 className="font-semibold mb-2">About Voltage Drop:</h3>
          <p className="text-sm">
            The National Electrical Code (NEC) recommends keeping voltage drop under 3% for 
            branch circuits or 5% for the combined feeder and branch circuit. Excessive voltage 
            drop can cause poor performance, overheating, and damage to electrical equipment.
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default VoltageDropCalculator;


import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateWireSize } from '@/utils/electricalCalculations';
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const WireSizeCalculator: React.FC = () => {
  const { toast } = useToast();
  const [current, setCurrent] = useState<number | ''>('');
  const [length, setLength] = useState<number | ''>('');
  const [material, setMaterial] = useState('copper');
  const [wireSize, setWireSize] = useState<string>('');

  const handleCalculate = () => {
    try {
      if (current === '' || length === '') {
        toast({
          title: "Missing values",
          description: "Please enter current and wire length values",
          variant: "destructive",
        });
        return;
      }

      const result = calculateWireSize(Number(current), Number(length), material);
      setWireSize(result);

      toast({
        title: "Calculation Complete",
        description: "Wire size calculated successfully.",
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
    setMaterial('copper');
    setWireSize('');
  };

  return (
    <CalculatorLayout 
      title="Wire Size Calculator" 
      description="Calculate the appropriate wire size (AWG) based on current and distance."
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

        {wireSize && (
          <div className="calculator-result">
            <h3 className="font-semibold">Recommended Wire Size:</h3>
            <p className="text-2xl font-bold mt-2">{wireSize}</p>
            <p className="text-sm mt-2 text-muted-foreground">
              Note: This is a simplified calculation. Always consult local electrical codes and a licensed electrician.
            </p>
          </div>
        )}

        {/* Common Wire Sizes Reference */}
        <div className="mt-6 p-4 bg-accent rounded-md">
          <h3 className="font-semibold mb-2">Common Wire Sizes:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>AWG 14: 15 Amps</div>
            <div>AWG 12: 20 Amps</div>
            <div>AWG 10: 30 Amps</div>
            <div>AWG 8: 40 Amps</div>
            <div>AWG 6: 55 Amps</div>
            <div>AWG 4: 70 Amps</div>
            <div>AWG 2: 95 Amps</div>
            <div>AWG 1/0: 125 Amps</div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default WireSizeCalculator;

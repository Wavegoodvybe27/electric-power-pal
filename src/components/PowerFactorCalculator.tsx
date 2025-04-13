
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculatePowerFactor, calculateReactivePower, calculateApparentPower } from '@/utils/electricalCalculations';
import { useToast } from "@/components/ui/use-toast";

const PowerFactorCalculator: React.FC = () => {
  const { toast } = useToast();
  const [realPower, setRealPower] = useState<number | ''>('');
  const [apparentPower, setApparentPower] = useState<number | ''>('');
  const [powerFactor, setPowerFactor] = useState<number | ''>('');
  const [reactivePower, setReactivePower] = useState<number | ''>('');
  const [solveFor, setSolveFor] = useState('powerFactor');

  const handleCalculate = () => {
    try {
      if (solveFor === 'powerFactor') {
        if (realPower === '' || apparentPower === '') {
          toast({
            title: "Missing values",
            description: "Please enter real power and apparent power values",
            variant: "destructive",
          });
          return;
        }
        
        const result = calculatePowerFactor(Number(realPower), Number(apparentPower));
        setPowerFactor(parseFloat(result.toFixed(3)));
        
        // Calculate reactive power
        const reactiveResult = calculateReactivePower(Number(apparentPower), result);
        setReactivePower(parseFloat(reactiveResult.toFixed(2)));
      } 
      else if (solveFor === 'reactivePower') {
        if (realPower === '' || powerFactor === '') {
          toast({
            title: "Missing values",
            description: "Please enter real power and power factor values",
            variant: "destructive",
          });
          return;
        }
        
        // Calculate apparent power first
        const apparentResult = calculateApparentPower(Number(realPower), Number(powerFactor));
        setApparentPower(parseFloat(apparentResult.toFixed(2)));
        
        // Then calculate reactive power
        const result = calculateReactivePower(apparentResult, Number(powerFactor));
        setReactivePower(parseFloat(result.toFixed(2)));
      } 
      else if (solveFor === 'apparentPower') {
        if (realPower === '' || powerFactor === '') {
          toast({
            title: "Missing values",
            description: "Please enter real power and power factor values",
            variant: "destructive",
          });
          return;
        }
        
        const result = calculateApparentPower(Number(realPower), Number(powerFactor));
        setApparentPower(parseFloat(result.toFixed(2)));
        
        // Calculate reactive power
        const reactiveResult = calculateReactivePower(result, Number(powerFactor));
        setReactivePower(parseFloat(reactiveResult.toFixed(2)));
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
    setRealPower('');
    setApparentPower('');
    setPowerFactor('');
    setReactivePower('');
  };

  return (
    <CalculatorLayout 
      title="Power Factor Calculator" 
      description="Calculate power factor and related power values in AC electrical systems."
    >
      <div className="space-y-6">
        <div>
          <Label>Solve for</Label>
          <Select 
            value={solveFor} 
            onValueChange={(value) => {
              setSolveFor(value);
              // Reset the field that will be calculated
              if (value === 'powerFactor') setPowerFactor('');
              else if (value === 'reactivePower') setReactivePower('');
              else if (value === 'apparentPower') setApparentPower('');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value to calculate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="powerFactor">Power Factor (PF)</SelectItem>
              <SelectItem value="reactivePower">Reactive Power (VAR)</SelectItem>
              <SelectItem value="apparentPower">Apparent Power (VA)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="realPower">Real Power (W)</Label>
            <Input 
              id="realPower" 
              type="number" 
              placeholder="Enter real power"
              value={realPower}
              onChange={(e) => setRealPower(e.target.value ? parseFloat(e.target.value) : '')}
              className="calculator-input"
            />
          </div>
          
          <div>
            <Label htmlFor="apparentPower">Apparent Power (VA)</Label>
            <Input 
              id="apparentPower" 
              type="number" 
              placeholder="Enter apparent power"
              value={apparentPower}
              onChange={(e) => setApparentPower(e.target.value ? parseFloat(e.target.value) : '')}
              disabled={solveFor === 'apparentPower'}
              className="calculator-input"
            />
          </div>
          
          <div>
            <Label htmlFor="powerFactor">Power Factor (0-1)</Label>
            <Input 
              id="powerFactor" 
              type="number" 
              placeholder="Enter power factor"
              value={powerFactor}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : '';
                if (typeof value === 'number' && (value < 0 || value > 1)) {
                  toast({
                    title: "Invalid Value",
                    description: "Power factor must be between 0 and 1",
                    variant: "destructive",
                  });
                  return;
                }
                setPowerFactor(value);
              }}
              disabled={solveFor === 'powerFactor'}
              min="0"
              max="1"
              step="0.01"
              className="calculator-input"
            />
          </div>
          
          <div>
            <Label htmlFor="reactivePower">Reactive Power (VAR)</Label>
            <Input 
              id="reactivePower" 
              type="number" 
              placeholder="Enter reactive power"
              value={reactivePower}
              onChange={(e) => setReactivePower(e.target.value ? parseFloat(e.target.value) : '')}
              disabled={solveFor === 'reactivePower'}
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

        {/* Power Triangle Visualization */}
        {realPower && apparentPower && powerFactor && (
          <div className="calculator-result">
            <h3 className="font-semibold mb-2">Power Factor Quality:</h3>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-full rounded-full ${Number(powerFactor) >= 0.95 
                ? 'bg-green-500' 
                : Number(powerFactor) >= 0.85 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'}`}>
                <div 
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Number(powerFactor) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{typeof powerFactor === 'number' ? (powerFactor * 100).toFixed(1) : 0}%</span>
            </div>
            
            <div className="mt-3 text-sm">
              <p className={typeof powerFactor === 'number' && powerFactor >= 0.95 
                ? "text-green-600" 
                : typeof powerFactor === 'number' && powerFactor >= 0.85 
                  ? "text-yellow-600" 
                  : "text-red-600"}>
                {typeof powerFactor === 'number' && powerFactor >= 0.95 
                  ? "✓ Excellent power factor (≥ 0.95)" 
                  : typeof powerFactor === 'number' && powerFactor >= 0.85 
                    ? "⚠ Acceptable power factor (0.85-0.94)" 
                    : "⚠ Poor power factor (< 0.85), consider correction"}
              </p>
            </div>
          </div>
        )}

        {/* Power Factor Info */}
        <div className="mt-6 p-4 bg-accent rounded-md">
          <h3 className="font-semibold mb-2">About Power Factor:</h3>
          <p className="text-sm mb-2">
            Power factor is the ratio of real power (kW) to apparent power (kVA) and indicates
            how efficiently electrical power is being used. A power factor of 1 (100%) means 
            all power is being used efficiently.
          </p>
          <p className="text-sm">
            <span className="font-medium">Formulas:</span><br />
            Power Factor = Real Power (W) ÷ Apparent Power (VA)<br />
            Reactive Power = Apparent Power × sin(arccos(Power Factor))<br />
            Apparent Power = Real Power ÷ Power Factor
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default PowerFactorCalculator;

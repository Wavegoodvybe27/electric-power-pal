
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { electricalUnitConversions, convertUnit } from '@/utils/electricalCalculations';
import { useToast } from "@/components/ui/use-toast";

const UnitConverter: React.FC = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState('voltage');
  const [inputValue, setInputValue] = useState<number | ''>('');
  const [fromUnit, setFromUnit] = useState('V');
  const [toUnit, setToUnit] = useState('kV');
  const [result, setResult] = useState<number | null>(null);

  const unitOptions = {
    'voltage': ['V', 'kV', 'mV'],
    'current': ['A', 'mA', 'kA'],
    'power': ['W', 'kW', 'MW'],
    'resistance': ['Ω', 'kΩ', 'MΩ']
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    
    // Reset units when changing category
    setFromUnit(unitOptions[newCategory as keyof typeof unitOptions][0]);
    setToUnit(unitOptions[newCategory as keyof typeof unitOptions][1]);
    setResult(null);
  };

  const handleConvert = () => {
    try {
      if (inputValue === '') {
        toast({
          title: "Missing value",
          description: "Please enter a value to convert",
          variant: "destructive",
        });
        return;
      }

      const convertedValue = convertUnit(Number(inputValue), fromUnit, toUnit, category);
      setResult(parseFloat(convertedValue.toFixed(6)));

      toast({
        title: "Conversion Complete",
        description: "Unit conversion calculated successfully.",
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "There was an error performing the conversion.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setInputValue('');
    setResult(null);
  };

  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setResult(null);
  };

  return (
    <CalculatorLayout 
      title="Electrical Unit Converter" 
      description="Convert between different electrical units like volts, amps, watts, and ohms."
    >
      <div className="space-y-6">
        <Tabs 
          defaultValue="voltage" 
          value={category}
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="voltage">Voltage</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="power">Power</TabsTrigger>
            <TabsTrigger value="resistance">Resistance</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="inputValue">Value</Label>
              <Input 
                id="inputValue" 
                type="number" 
                placeholder="Enter value to convert"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value ? parseFloat(e.target.value) : '')}
                className="calculator-input"
              />
            </div>
            
            <div>
              <Label htmlFor="fromUnit">From Unit</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions[category as keyof typeof unitOptions].map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center h-10">
              <Button 
                variant="outline" 
                className="rounded-full h-10 w-10 p-0"
                onClick={handleSwapUnits}
              >
                ⇄
              </Button>
            </div>
            
            <div>
              <Label htmlFor="toUnit">To Unit</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions[category as keyof typeof unitOptions].map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleConvert}>
            Convert
          </Button>
        </div>

        {result !== null && (
          <div className="calculator-result">
            <h3 className="font-semibold">Conversion Result:</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl font-bold">{result}</p>
              <p className="text-lg">{toUnit}</p>
            </div>
            
            <p className="text-sm mt-2">
              {inputValue} {fromUnit} = {result} {toUnit}
            </p>
          </div>
        )}

        {/* Unit Reference */}
        <div className="mt-6 p-4 bg-accent rounded-md">
          <h3 className="font-semibold mb-2">Common Electrical Units:</h3>
          <ul className="space-y-1 text-sm">
            <li><strong>Voltage:</strong> V (volts), kV (kilovolts), mV (millivolts)</li>
            <li><strong>Current:</strong> A (amps), mA (milliamps), kA (kiloamps)</li>
            <li><strong>Power:</strong> W (watts), kW (kilowatts), MW (megawatts)</li>
            <li><strong>Resistance:</strong> Ω (ohms), kΩ (kilohms), MΩ (megohms)</li>
          </ul>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default UnitConverter;

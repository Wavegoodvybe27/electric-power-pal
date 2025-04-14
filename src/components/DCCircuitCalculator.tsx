
import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  calculateSeriesResistance,
  calculateParallelResistance,
  calculateVoltage,
  calculateCurrent
} from '@/utils/electricalCalculations';

const DCCircuitCalculator = () => {
  // Series circuit state
  const [seriesResistors, setSeriesResistors] = useState<number[]>([1000, 2200, 3300]);
  const [seriesVoltage, setSeriesVoltage] = useState<number>(12);
  const [seriesResult, setSeriesResult] = useState({
    totalResistance: 0,
    current: 0,
    voltageDrops: [0, 0, 0],
    power: 0
  });

  // Parallel circuit state
  const [parallelResistors, setParallelResistors] = useState<number[]>([1000, 2200, 3300]);
  const [parallelVoltage, setParallelVoltage] = useState<number>(12);
  const [parallelResult, setParallelResult] = useState({
    totalResistance: 0,
    totalCurrent: 0,
    branchCurrents: [0, 0, 0],
    power: 0
  });

  // Handle inputs 
  const handleSeriesResistorChange = (index: number, value: number) => {
    const newResistors = [...seriesResistors];
    newResistors[index] = value;
    setSeriesResistors(newResistors);
  };

  const handleParallelResistorChange = (index: number, value: number) => {
    const newResistors = [...parallelResistors];
    newResistors[index] = value;
    setParallelResistors(newResistors);
  };

  const addSeriesResistor = () => {
    setSeriesResistors([...seriesResistors, 1000]);
  };

  const removeSeriesResistor = (index: number) => {
    if (seriesResistors.length > 1) {
      const newResistors = [...seriesResistors];
      newResistors.splice(index, 1);
      setSeriesResistors(newResistors);
    }
  };

  const addParallelResistor = () => {
    setParallelResistors([...parallelResistors, 1000]);
  };

  const removeParallelResistor = (index: number) => {
    if (parallelResistors.length > 1) {
      const newResistors = [...parallelResistors];
      newResistors.splice(index, 1);
      setParallelResistors(newResistors);
    }
  };

  // Calculate series circuit
  const calculateSeries = () => {
    const totalResistance = calculateSeriesResistance(seriesResistors);
    const current = calculateCurrent(seriesVoltage, totalResistance);
    const voltageDrops = seriesResistors.map(r => current * r);
    const power = seriesVoltage * current;

    setSeriesResult({
      totalResistance,
      current,
      voltageDrops,
      power
    });
  };

  // Calculate parallel circuit
  const calculateParallel = () => {
    const totalResistance = calculateParallelResistance(parallelResistors);
    const totalCurrent = calculateCurrent(parallelVoltage, totalResistance);
    const branchCurrents = parallelResistors.map(r => 
      calculateCurrent(parallelVoltage, r)
    );
    const power = parallelVoltage * totalCurrent;

    setParallelResult({
      totalResistance,
      totalCurrent,
      branchCurrents,
      power
    });
  };

  return (
    <CalculatorLayout 
      title="DC Circuit Calculator" 
      description="Analyze series and parallel DC circuits"
    >
      <Tabs defaultValue="series">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="series">Series Circuit</TabsTrigger>
          <TabsTrigger value="parallel">Parallel Circuit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="series" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="series-voltage" className="calculator-label">Supply Voltage (V)</Label>
              <Input
                id="series-voltage"
                type="number"
                min="0"
                step="0.1"
                value={seriesVoltage}
                onChange={(e) => setSeriesVoltage(parseFloat(e.target.value) || 0)}
                className="calculator-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="calculator-label">Resistors (Ω)</Label>
              {seriesResistors.map((resistor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={resistor}
                    onChange={(e) => handleSeriesResistorChange(index, parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeSeriesResistor(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={addSeriesResistor}
              >
                Add Resistor
              </Button>
            </div>
            
            <Button onClick={calculateSeries} className="w-full">Calculate Series Circuit</Button>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="calculator-label">Total Resistance</p>
                  <div className="calculator-result">
                    {seriesResult.totalResistance.toFixed(2)} Ω
                  </div>
                </div>
                <div>
                  <p className="calculator-label">Circuit Current</p>
                  <div className="calculator-result">
                    {seriesResult.current.toFixed(3)} A
                  </div>
                </div>
              </div>
              
              <div>
                <p className="calculator-label">Voltage Drops</p>
                <div className="space-y-2">
                  {seriesResult.voltageDrops.map((voltage, index) => (
                    <div key={index} className="calculator-result">
                      R{index + 1}: {voltage.toFixed(2)} V
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="calculator-label">Total Power</p>
                <div className="calculator-result">
                  {seriesResult.power.toFixed(2)} W
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="parallel" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="parallel-voltage" className="calculator-label">Supply Voltage (V)</Label>
              <Input
                id="parallel-voltage"
                type="number"
                min="0"
                step="0.1"
                value={parallelVoltage}
                onChange={(e) => setParallelVoltage(parseFloat(e.target.value) || 0)}
                className="calculator-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="calculator-label">Resistors (Ω)</Label>
              {parallelResistors.map((resistor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={resistor}
                    onChange={(e) => handleParallelResistorChange(index, parseFloat(e.target.value) || 0)}
                    className="calculator-input"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeParallelResistor(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={addParallelResistor}
              >
                Add Resistor
              </Button>
            </div>
            
            <Button onClick={calculateParallel} className="w-full">Calculate Parallel Circuit</Button>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="calculator-label">Total Resistance</p>
                  <div className="calculator-result">
                    {parallelResult.totalResistance.toFixed(2)} Ω
                  </div>
                </div>
                <div>
                  <p className="calculator-label">Total Current</p>
                  <div className="calculator-result">
                    {parallelResult.totalCurrent.toFixed(3)} A
                  </div>
                </div>
              </div>
              
              <div>
                <p className="calculator-label">Branch Currents</p>
                <div className="space-y-2">
                  {parallelResult.branchCurrents.map((current, index) => (
                    <div key={index} className="calculator-result">
                      Branch {index + 1}: {current.toFixed(3)} A
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="calculator-label">Total Power</p>
                <div className="calculator-result">
                  {parallelResult.power.toFixed(2)} W
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorLayout>
  );
};

export default DCCircuitCalculator;

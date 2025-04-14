
import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resistorColorCodes, decodeResistorValue, encodeResistorValue } from '@/utils/electricalCalculations';

const ColorCodeCalculator = () => {
  // Decode (color bands to value)
  const [selectedBands, setSelectedBands] = useState<string[]>(["brown", "black", "red", "gold"]);
  const [bandCount, setBandCount] = useState<number>(4);
  const [decodedValue, setDecodedValue] = useState<string>("");
  
  // Encode (value to color bands)
  const [resistorValue, setResistorValue] = useState<number>(1000);
  const [toleranceValue, setToleranceValue] = useState<number>(5);
  const [encodedBands, setEncodedBands] = useState<string[]>([]);

  const handleBandChange = (index: number, color: string) => {
    const newBands = [...selectedBands];
    newBands[index] = color;
    setSelectedBands(newBands);
  };

  const handleBandCountChange = (count: number) => {
    setBandCount(count);
    
    // Resize bands array based on count
    if (count > selectedBands.length) {
      // Add more bands
      setSelectedBands([...selectedBands, ...Array(count - selectedBands.length).fill("black")]);
    } else if (count < selectedBands.length) {
      // Remove bands
      setSelectedBands(selectedBands.slice(0, count));
    }
  };

  const decodeResistor = () => {
    const result = decodeResistorValue(selectedBands.slice(0, bandCount));
    setDecodedValue(result.formatted);
  };

  const encodeResistor = () => {
    const bands = encodeResistorValue(resistorValue, toleranceValue);
    setEncodedBands(bands);
  };

  return (
    <CalculatorLayout 
      title="Color Code Calculator" 
      description="Decode and encode resistor color codes"
    >
      <Tabs defaultValue="decode">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="decode">Color to Value</TabsTrigger>
          <TabsTrigger value="encode">Value to Color</TabsTrigger>
        </TabsList>
        
        <TabsContent value="decode" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div>
              <Label className="calculator-label">Number of Bands</Label>
              <Select 
                value={bandCount.toString()} 
                onValueChange={(value) => handleBandCountChange(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select band count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Bands</SelectItem>
                  <SelectItem value="4">4 Bands</SelectItem>
                  <SelectItem value="5">5 Bands</SelectItem>
                  <SelectItem value="6">6 Bands</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-1 h-24 bg-muted rounded-md p-4">
                {selectedBands.slice(0, bandCount).map((band, index) => {
                  const colorInfo = resistorColorCodes.find(b => b.color === band);
                  return (
                    <div 
                      key={index}
                      className="h-full w-10 rounded-sm" 
                      style={{ backgroundColor: colorInfo?.colorHex || '#000000' }}
                    />
                  );
                })}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: bandCount }).map((_, index) => (
                  <div key={index}>
                    <Label className="calculator-label">Band {index + 1}</Label>
                    <Select 
                      value={selectedBands[index] || "black"} 
                      onValueChange={(value) => handleBandChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {resistorColorCodes.map((code) => (
                          <SelectItem key={code.color} value={code.color}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: code.colorHex }}
                              />
                              <span className="capitalize">{code.color}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={decodeResistor} className="w-full">Decode Resistor Value</Button>
            
            <div>
              <Label className="calculator-label">Resistor Value</Label>
              <div className="calculator-result">{decodedValue || "Select bands to decode"}</div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="encode" className="space-y-4">
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="resistor-value" className="calculator-label">Resistor Value (Ω)</Label>
              <Input
                id="resistor-value"
                type="number"
                min="0"
                step="0.01"
                value={resistorValue}
                onChange={(e) => setResistorValue(parseFloat(e.target.value) || 0)}
                className="calculator-input"
              />
            </div>
            
            <div>
              <Label className="calculator-label">Tolerance</Label>
              <Select 
                value={toleranceValue.toString()} 
                onValueChange={(value) => setToleranceValue(parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tolerance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">±1% (Brown)</SelectItem>
                  <SelectItem value="2">±2% (Red)</SelectItem>
                  <SelectItem value="0.5">±0.5% (Green)</SelectItem>
                  <SelectItem value="0.25">±0.25% (Blue)</SelectItem>
                  <SelectItem value="0.1">±0.1% (Violet)</SelectItem>
                  <SelectItem value="0.05">±0.05% (Grey)</SelectItem>
                  <SelectItem value="5">±5% (Gold)</SelectItem>
                  <SelectItem value="10">±10% (Silver)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={encodeResistor} className="w-full">Generate Color Bands</Button>
            
            {encodedBands.length > 0 && (
              <div>
                <Label className="calculator-label">Color Bands</Label>
                <div className="flex items-center justify-center gap-1 h-24 bg-muted rounded-md p-4">
                  {encodedBands.map((band, index) => {
                    const colorInfo = resistorColorCodes.find(b => b.color === band);
                    return (
                      <div 
                        key={index}
                        className="h-full w-10 rounded-sm" 
                        style={{ backgroundColor: colorInfo?.colorHex || '#000000' }}
                      />
                    );
                  })}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {encodedBands.map((band, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="h-6 w-6 rounded-full mx-auto" 
                        style={{ backgroundColor: resistorColorCodes.find(b => b.color === band)?.colorHex || '#000000' }}
                      />
                      <p className="text-xs mt-1 capitalize">{band}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorLayout>
  );
};

export default ColorCodeCalculator;

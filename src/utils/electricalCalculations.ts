
// Ohm's Law calculations
export const calculateVoltage = (current: number, resistance: number): number => {
  return current * resistance;
};

export const calculateCurrent = (voltage: number, resistance: number): number => {
  return resistance === 0 ? 0 : voltage / resistance;
};

export const calculateResistance = (voltage: number, current: number): number => {
  return current === 0 ? 0 : voltage / current;
};

export const calculatePower = (voltage: number, current: number): number => {
  return voltage * current;
};

// Wire Size Calculator functions
export const calculateWireSize = (current: number, length: number, material: string = "copper"): string => {
  // This is a simplified calculation - in reality, wire sizing involves more factors
  // including temperature, insulation type, and installation methods
  const resistivity = material === "copper" ? 1.0 : 1.68; // Aluminum has higher resistivity
  const area = (current * length * resistivity) / 12.0;
  
  // Map calculated area to AWG sizes (simplified)
  const awgSizes = [
    { awg: 14, maxAmp: 15, area: 2.08 },
    { awg: 12, maxAmp: 20, area: 3.31 },
    { awg: 10, maxAmp: 30, area: 5.26 },
    { awg: 8, maxAmp: 40, area: 8.37 },
    { awg: 6, maxAmp: 55, area: 13.3 },
    { awg: 4, maxAmp: 70, area: 21.2 },
    { awg: 2, maxAmp: 95, area: 33.6 },
    { awg: 1, maxAmp: 110, area: 42.4 },
    { awg: "1/0", maxAmp: 125, area: 53.5 },
    { awg: "2/0", maxAmp: 145, area: 67.4 },
    { awg: "3/0", maxAmp: 165, area: 85.0 },
    { awg: "4/0", maxAmp: 195, area: 107.2 }
  ];
  
  // Find the smallest wire that can handle the current
  for (const size of awgSizes) {
    if (current <= size.maxAmp) {
      return `AWG ${size.awg}`;
    }
  }
  
  return "Wire size too large for calculator";
};

// Voltage Drop Calculator
export const calculateVoltageDrop = (
  current: number, 
  length: number, 
  wireSize: string, 
  material: string = "copper"
): number => {
  // Convert AWG to area in circular mils
  const awgToCircularMils: Record<string, number> = {
    "14": 4110,
    "12": 6530,
    "10": 10380,
    "8": 16510,
    "6": 26240,
    "4": 41740,
    "2": 66360,
    "1": 83690,
    "1/0": 105600,
    "2/0": 133100,
    "3/0": 167800,
    "4/0": 211600
  };
  
  // Extract numeric AWG value
  const awgValue = wireSize.replace("AWG ", "");
  const circularMils = awgToCircularMils[awgValue] || 10380; // Default to AWG 10 if not found
  
  // Resistivity in ohm-circular mil/ft
  const resistivity = material === "copper" ? 10.371 : 17.0; // copper vs aluminum
  
  // Calculate voltage drop (one-way distance)
  // VD = 2 * I * L * R / 1000 (for single phase)
  // where R = (resistivity * length) / circular mils
  return (2 * current * length * resistivity) / (circularMils * 1000);
};

// Power Factor Calculator
export const calculatePowerFactor = (realPower: number, apparentPower: number): number => {
  return apparentPower === 0 ? 0 : realPower / apparentPower;
};

export const calculateReactivePower = (apparentPower: number, powerFactor: number): number => {
  // Q = S * sin(arccos(PF))
  return apparentPower * Math.sin(Math.acos(powerFactor));
};

export const calculateApparentPower = (realPower: number, powerFactor: number): number => {
  return powerFactor === 0 ? 0 : realPower / powerFactor;
};

// Unit conversion functions
export type UnitConversion = {
  from: string;
  to: string;
  factor: number;
};

export const electricalUnitConversions: Record<string, UnitConversion[]> = {
  "voltage": [
    { from: "V", to: "kV", factor: 0.001 },
    { from: "V", to: "mV", factor: 1000 },
    { from: "kV", to: "V", factor: 1000 },
    { from: "mV", to: "V", factor: 0.001 }
  ],
  "current": [
    { from: "A", to: "mA", factor: 1000 },
    { from: "A", to: "kA", factor: 0.001 },
    { from: "mA", to: "A", factor: 0.001 },
    { from: "kA", to: "A", factor: 1000 }
  ],
  "power": [
    { from: "W", to: "kW", factor: 0.001 },
    { from: "W", to: "MW", factor: 0.000001 },
    { from: "kW", to: "W", factor: 1000 },
    { from: "kW", to: "MW", factor: 0.001 },
    { from: "MW", to: "W", factor: 1000000 },
    { from: "MW", to: "kW", factor: 1000 }
  ],
  "resistance": [
    { from: "Ω", to: "kΩ", factor: 0.001 },
    { from: "Ω", to: "MΩ", factor: 0.000001 },
    { from: "kΩ", to: "Ω", factor: 1000 },
    { from: "kΩ", to: "MΩ", factor: 0.001 },
    { from: "MΩ", to: "Ω", factor: 1000000 },
    { from: "MΩ", to: "kΩ", factor: 1000 }
  ]
};

export const convertUnit = (value: number, from: string, to: string, category: string): number => {
  if (from === to) return value;
  
  const conversions = electricalUnitConversions[category];
  if (!conversions) return value;
  
  const conversion = conversions.find(c => c.from === from && c.to === to);
  
  if (conversion) {
    return value * conversion.factor;
  }
  
  return value;
};

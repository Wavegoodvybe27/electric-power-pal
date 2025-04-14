
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
  ],
  "capacitance": [
    { from: "F", to: "mF", factor: 1000 },
    { from: "F", to: "μF", factor: 1000000 },
    { from: "F", to: "nF", factor: 1000000000 },
    { from: "F", to: "pF", factor: 1000000000000 },
    { from: "mF", to: "F", factor: 0.001 },
    { from: "mF", to: "μF", factor: 1000 },
    { from: "μF", to: "F", factor: 0.000001 },
    { from: "μF", to: "mF", factor: 0.001 },
    { from: "μF", to: "nF", factor: 1000 },
    { from: "nF", to: "F", factor: 0.000000001 },
    { from: "nF", to: "μF", factor: 0.001 },
    { from: "nF", to: "pF", factor: 1000 },
    { from: "pF", to: "F", factor: 0.000000000001 },
    { from: "pF", to: "nF", factor: 0.001 }
  ],
  "inductance": [
    { from: "H", to: "mH", factor: 1000 },
    { from: "H", to: "μH", factor: 1000000 },
    { from: "mH", to: "H", factor: 0.001 },
    { from: "mH", to: "μH", factor: 1000 },
    { from: "μH", to: "H", factor: 0.000001 },
    { from: "μH", to: "mH", factor: 0.001 }
  ],
  "frequency": [
    { from: "Hz", to: "kHz", factor: 0.001 },
    { from: "Hz", to: "MHz", factor: 0.000001 },
    { from: "kHz", to: "Hz", factor: 1000 },
    { from: "kHz", to: "MHz", factor: 0.001 },
    { from: "MHz", to: "Hz", factor: 1000000 },
    { from: "MHz", to: "kHz", factor: 1000 }
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

// AC Circuit Calculations
export const calculateImpedance = (
  resistance: number,
  capacitiveReactance: number = 0,
  inductiveReactance: number = 0
): number => {
  // Z = √(R² + (XL - XC)²)
  const reactance = inductiveReactance - capacitiveReactance;
  return Math.sqrt(Math.pow(resistance, 2) + Math.pow(reactance, 2));
};

export const calculatePhaseAngle = (
  resistance: number,
  capacitiveReactance: number = 0,
  inductiveReactance: number = 0
): number => {
  // θ = tan⁻¹((XL - XC) / R)
  const reactance = inductiveReactance - capacitiveReactance;
  return Math.atan2(reactance, resistance) * (180 / Math.PI);
};

export const calculateCapacitiveReactance = (frequency: number, capacitance: number): number => {
  // XC = 1 / (2πfC)
  return capacitance === 0 ? 0 : 1 / (2 * Math.PI * frequency * capacitance);
};

export const calculateInductiveReactance = (frequency: number, inductance: number): number => {
  // XL = 2πfL
  return 2 * Math.PI * frequency * inductance;
};

export const calculateCapacitance = (voltage: number, charge: number): number => {
  // C = Q / V
  return voltage === 0 ? 0 : charge / voltage;
};

export const calculateCapacitorEnergy = (capacitance: number, voltage: number): number => {
  // E = 0.5 * C * V²
  return 0.5 * capacitance * Math.pow(voltage, 2);
};

export const calculateInductorEnergy = (inductance: number, current: number): number => {
  // E = 0.5 * L * I²
  return 0.5 * inductance * Math.pow(current, 2);
};

// Series and Parallel Component Calculations
export const calculateSeriesResistance = (resistances: number[]): number => {
  return resistances.reduce((sum, r) => sum + r, 0);
};

export const calculateParallelResistance = (resistances: number[]): number => {
  const sum = resistances.reduce((sum, r) => sum + (r === 0 ? 0 : 1 / r), 0);
  return sum === 0 ? 0 : 1 / sum;
};

export const calculateSeriesCapacitance = (capacitances: number[]): number => {
  const sum = capacitances.reduce((sum, c) => sum + (c === 0 ? 0 : 1 / c), 0);
  return sum === 0 ? 0 : 1 / sum;
};

export const calculateParallelCapacitance = (capacitances: number[]): number => {
  return capacitances.reduce((sum, c) => sum + c, 0);
};

export const calculateSeriesInductance = (inductances: number[]): number => {
  return inductances.reduce((sum, l) => sum + l, 0);
};

export const calculateParallelInductance = (inductances: number[]): number => {
  const sum = inductances.reduce((sum, l) => sum + (l === 0 ? 0 : 1 / l), 0);
  return sum === 0 ? 0 : 1 / sum;
};

// Resistor Color Code Functions
export type ResistorBand = {
  color: string;
  value: number;
  multiplier: number;
  tolerance: number;
  tempCoefficient: number;
  colorHex: string;
};

export const resistorColorCodes: ResistorBand[] = [
  { color: 'black', value: 0, multiplier: 1, tolerance: 0, tempCoefficient: 250, colorHex: '#000000' },
  { color: 'brown', value: 1, multiplier: 10, tolerance: 1, tempCoefficient: 100, colorHex: '#8B4513' },
  { color: 'red', value: 2, multiplier: 100, tolerance: 2, tempCoefficient: 50, colorHex: '#FF0000' },
  { color: 'orange', value: 3, multiplier: 1000, tolerance: 0, tempCoefficient: 15, colorHex: '#FFA500' },
  { color: 'yellow', value: 4, multiplier: 10000, tolerance: 0, tempCoefficient: 25, colorHex: '#FFFF00' },
  { color: 'green', value: 5, multiplier: 100000, tolerance: 0.5, tempCoefficient: 20, colorHex: '#008000' },
  { color: 'blue', value: 6, multiplier: 1000000, tolerance: 0.25, tempCoefficient: 10, colorHex: '#0000FF' },
  { color: 'violet', value: 7, multiplier: 10000000, tolerance: 0.1, tempCoefficient: 5, colorHex: '#EE82EE' },
  { color: 'grey', value: 8, multiplier: 100000000, tolerance: 0.05, tempCoefficient: 1, colorHex: '#808080' },
  { color: 'white', value: 9, multiplier: 1000000000, tolerance: 0, tempCoefficient: 0, colorHex: '#FFFFFF' },
  { color: 'gold', value: -1, multiplier: 0.1, tolerance: 5, tempCoefficient: 0, colorHex: '#FFD700' },
  { color: 'silver', value: -2, multiplier: 0.01, tolerance: 10, tempCoefficient: 0, colorHex: '#C0C0C0' }
];

export const decodeResistorValue = (bands: string[]): {
  value: number;
  tolerance: number;
  formatted: string;
} => {
  // Get band values
  const bandValues = bands.map(color => 
    resistorColorCodes.find(b => b.color === color.toLowerCase()) || resistorColorCodes[0]
  );
  
  let value = 0;
  let tolerance = 20; // Default tolerance
  let multiplier = 1;
  
  if (bands.length === 3) {
    // 3-band resistor (no tolerance band)
    value = (bandValues[0].value * 10 + bandValues[1].value) * bandValues[2].multiplier;
  } else if (bands.length === 4) {
    // 4-band resistor (with tolerance band)
    value = (bandValues[0].value * 10 + bandValues[1].value) * bandValues[2].multiplier;
    tolerance = bandValues[3].tolerance;
  } else if (bands.length === 5) {
    // 5-band resistor
    value = (bandValues[0].value * 100 + bandValues[1].value * 10 + bandValues[2].value) * bandValues[3].multiplier;
    tolerance = bandValues[4].tolerance;
  } else if (bands.length === 6) {
    // 6-band resistor (with temperature coefficient)
    value = (bandValues[0].value * 100 + bandValues[1].value * 10 + bandValues[2].value) * bandValues[3].multiplier;
    tolerance = bandValues[4].tolerance;
    // Temperature coefficient is bandValues[5].tempCoefficient
  }
  
  // Format the value with proper unit
  let formatted = '';
  if (value >= 1000000) {
    formatted = `${(value / 1000000).toFixed(2)} MΩ ±${tolerance}%`;
  } else if (value >= 1000) {
    formatted = `${(value / 1000).toFixed(2)} kΩ ±${tolerance}%`;
  } else {
    formatted = `${value.toFixed(2)} Ω ±${tolerance}%`;
  }
  
  return { value, tolerance, formatted };
};

export const encodeResistorValue = (value: number, tolerance: number = 5): string[] => {
  let digits: number[] = [];
  let multiplier = 0;
  
  // Normalize to 2 or 3 significant digits
  if (value >= 100) {
    // Get first 3 digits
    while (value >= 1000) {
      value /= 10;
      multiplier += 1;
    }
    digits = [
      Math.floor(value / 100),
      Math.floor((value % 100) / 10),
      Math.floor(value % 10)
    ];
  } else {
    // Get first 2 digits
    while (value >= 100) {
      value /= 10;
      multiplier += 1;
    }
    digits = [
      Math.floor(value / 10),
      Math.floor(value % 10)
    ];
  }
  
  // Find color bands
  const colorBands = digits.map(digit => 
    resistorColorCodes.find(band => band.value === digit)?.color || 'black'
  );
  
  // Add multiplier band
  const multiplierBand = resistorColorCodes.find(band => 
    Math.log10(band.multiplier) === multiplier
  )?.color || 'black';
  
  colorBands.push(multiplierBand);
  
  // Add tolerance band
  const toleranceBand = resistorColorCodes.find(band => 
    band.tolerance === tolerance
  )?.color || 'silver'; // Default to 10% if not found
  
  colorBands.push(toleranceBand);
  
  return colorBands;
};

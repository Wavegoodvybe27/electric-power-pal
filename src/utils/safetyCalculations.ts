
/**
 * Calculates Joule heating effect
 * @param current Current in amperes (A)
 * @param resistance Resistance in ohms (Ω)
 * @param time Time in seconds (s)
 * @returns Object containing energy in joules and temperature rise
 */
export const calculateJouleHeating = (
  current: number,
  resistance: number,
  time: number
): { energy: number; temperature: number } => {
  // Energy = I²Rt
  const energy = Math.pow(current, 2) * resistance * time;
  
  // Simplified temperature rise calculation
  // Assumes copper conductor with typical specific heat
  // This is an approximation for educational purposes
  const temperatureRise = energy * 0.005; // Simplified conversion factor
  
  return {
    energy,
    temperature: temperatureRise
  };
};

/**
 * Calculates voltage divider output
 * @param inputVoltage Input voltage in volts (V)
 * @param resistor1 First resistor in ohms (Ω)
 * @param resistor2 Second resistor in ohms (Ω)
 * @returns Object containing output voltage and current
 */
export const calculateVoltageDivider = (
  inputVoltage: number,
  resistor1: number,
  resistor2: number
): { outputVoltage: number; current: number } => {
  // Vout = Vin × (R2 / (R1 + R2))
  const outputVoltage = inputVoltage * (resistor2 / (resistor1 + resistor2));
  
  // Calculate current through the divider
  const totalResistance = resistor1 + resistor2;
  const current = inputVoltage / totalResistance;
  
  return {
    outputVoltage,
    current
  };
};

/**
 * Calculates current divider output
 * @param totalCurrent Total current in amperes (A)
 * @param resistorA First resistor in ohms (Ω)
 * @param resistorB Second resistor in ohms (Ω)
 * @returns Object containing currents through each resistor
 */
export const calculateCurrentDivider = (
  totalCurrent: number,
  resistorA: number,
  resistorB: number
): { currentA: number; currentB: number } => {
  // IA = I × (RB / (RA + RB))
  const totalResistance = resistorA + resistorB;
  const currentA = totalCurrent * (resistorB / totalResistance);
  
  // IB = I × (RA / (RA + RB))
  const currentB = totalCurrent * (resistorA / totalResistance);
  
  return {
    currentA,
    currentB
  };
};

/**
 * Calculates electrical shock risk level
 * @param voltage Voltage in volts (V)
 * @param isAC Boolean indicating if AC (true) or DC (false)
 * @param isWet Boolean indicating if wet conditions
 * @returns Risk level as string
 */
export const calculateShockRisk = (
  voltage: number,
  isAC: boolean,
  isWet: boolean
): string => {
  let riskLevel: string;
  
  if (isAC) {
    if (isWet) {
      if (voltage < 5) riskLevel = "Very Low";
      else if (voltage < 30) riskLevel = "Low";
      else if (voltage < 50) riskLevel = "Moderate";
      else if (voltage < 100) riskLevel = "High";
      else riskLevel = "Extreme";
    } else {
      if (voltage < 25) riskLevel = "Very Low";
      else if (voltage < 50) riskLevel = "Low";
      else if (voltage < 120) riskLevel = "Moderate";
      else if (voltage < 240) riskLevel = "High";
      else riskLevel = "Extreme";
    }
  } else {
    // DC shock risk
    if (isWet) {
      if (voltage < 10) riskLevel = "Very Low";
      else if (voltage < 40) riskLevel = "Low";
      else if (voltage < 60) riskLevel = "Moderate";
      else if (voltage < 120) riskLevel = "High";
      else riskLevel = "Extreme";
    } else {
      if (voltage < 40) riskLevel = "Very Low";
      else if (voltage < 60) riskLevel = "Low";
      else if (voltage < 120) riskLevel = "Moderate";
      else if (voltage < 300) riskLevel = "High";
      else riskLevel = "Extreme";
    }
  }
  
  return riskLevel;
};

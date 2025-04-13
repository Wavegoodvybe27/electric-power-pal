
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CalculatorLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ title, description, children }) => {
  const navigate = useNavigate();

  return (
    <div className="container py-8 max-w-3xl">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Calculators
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="calculator-header">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorLayout;

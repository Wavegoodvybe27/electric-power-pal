
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, description, icon: Icon, path }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-sm mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Content can be added here if needed */}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(path)}
        >
          Open Calculator
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalculatorCard;

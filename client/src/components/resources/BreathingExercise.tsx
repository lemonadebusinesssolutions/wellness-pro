import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";

type BreathPattern = {
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  description: string;
};

const breathPatterns: BreathPattern[] = [
  {
    name: "Box Breathing",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: "Equal counts for all phases. Used by Navy SEALs for stress management."
  },
  {
    name: "4-7-8 Breathing",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: "Developed by Dr. Andrew Weil for relaxation and sleep."
  },
  {
    name: "Relaxing Breath",
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    description: "Longer exhales than inhales to activate the parasympathetic system."
  },
  {
    name: "Energizing Breath",
    inhale: 6,
    hold1: 2,
    exhale: 4,
    hold2: 0,
    description: "Longer inhales to increase energy and focus."
  }
];

export default function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(breathPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(selectedPattern.inhale);
  const [totalCycles, setTotalCycles] = useState(3);
  const [currentCycle, setCurrentCycle] = useState(1);
  const { theme } = useTheme();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Colors for dark/light theme
  const circleColor = theme === 'dark' ? '#1e293b' : '#f8fafc';
  const progressColor = theme === 'dark' ? '#38bdf8' : '#0ea5e9';
  const textColor = theme === 'dark' ? '#f1f5f9' : '#334155';
  
  // Calculate circle size based on browser width
  const circleSize = 240;
  const circleRadius = circleSize / 2;
  const circleCircumference = 2 * Math.PI * (circleRadius - 10);
  
  // Calculate progress for the circle animation
  const getProgress = () => {
    const total = selectedPattern[phase];
    return (total - secondsLeft) / total;
  };
  
  const strokeDashoffset = circleCircumference - (getProgress() * circleCircumference);
  
  // Reset timer when selecting a new pattern
  useEffect(() => {
    if (!isActive) {
      setPhase('inhale');
      setSecondsLeft(selectedPattern.inhale);
    }
  }, [selectedPattern, isActive]);
  
  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Move to next phase or cycle
            let nextPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
            let nextCycle = currentCycle;
            
            switch (phase) {
              case 'inhale':
                nextPhase = 'hold1';
                break;
              case 'hold1':
                nextPhase = 'exhale';
                break;
              case 'exhale':
                nextPhase = 'hold2';
                break;
              case 'hold2':
                nextPhase = 'inhale';
                if (currentCycle >= totalCycles) {
                  // Exercise complete
                  clearInterval(timerRef.current!);
                  setIsActive(false);
                  return 0;
                }
                nextCycle = currentCycle + 1;
                break;
            }
            
            // Skip phases with 0 seconds
            if (selectedPattern[nextPhase] === 0) {
              if (nextPhase === 'hold1') nextPhase = 'exhale';
              else if (nextPhase === 'hold2') {
                nextPhase = 'inhale';
                if (currentCycle >= totalCycles) {
                  // Exercise complete
                  clearInterval(timerRef.current!);
                  setIsActive(false);
                  return 0;
                }
                nextCycle = currentCycle + 1;
              }
            }
            
            setPhase(nextPhase);
            setCurrentCycle(nextCycle);
            return selectedPattern[nextPhase];
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isActive, phase, selectedPattern, currentCycle, totalCycles]);
  
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inhale';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'hold2': return 'Hold';
    }
  };
  
  const handleStart = () => {
    setPhase('inhale');
    setSecondsLeft(selectedPattern.inhale);
    setCurrentCycle(1);
    setIsActive(true);
  };
  
  const handleStop = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-center text-xl dark:text-white">Breathing Exercise</CardTitle>
        <CardDescription className="text-center dark:text-gray-300">
          Follow the visual guide for a calming breath practice
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Label className="text-sm text-gray-500 dark:text-gray-400">Select breathing pattern</Label>
          <Select
            disabled={isActive}
            value={selectedPattern.name}
            onValueChange={(value) => {
              const pattern = breathPatterns.find(p => p.name === value);
              if (pattern) setSelectedPattern(pattern);
            }}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>
            <SelectContent>
              {breathPatterns.map((pattern) => (
                <SelectItem key={pattern.name} value={pattern.name}>
                  {pattern.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
            {selectedPattern.description}
          </p>
        </div>
        
        {!isActive && (
          <div className="space-y-3">
            <Label className="text-sm text-gray-500 dark:text-gray-400">Number of cycles</Label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[3]}
                min={1}
                max={10}
                step={1}
                value={[totalCycles]}
                onValueChange={(value) => setTotalCycles(value[0])}
              />
              <span className="w-8 text-center">{totalCycles}</span>
            </div>
          </div>
        )}
        
        {/* Breathing Circle Animation */}
        <div className="relative flex justify-center items-center py-4">
          <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
            {/* Background Circle */}
            <circle
              cx={circleRadius}
              cy={circleRadius}
              r={circleRadius - 10}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
            />
            
            {/* Progress Circle */}
            {isActive && (
              <circle
                cx={circleRadius}
                cy={circleRadius}
                r={circleRadius - 10}
                fill="none"
                stroke={progressColor}
                strokeWidth="6"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${circleRadius} ${circleRadius})`}
                style={{ 
                  transition: phase === 'inhale' ? 'stroke-dashoffset 0.3s linear' : 'stroke-dashoffset 0.3s linear',
                }}
              />
            )}
            
            {/* Center Text */}
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              fill={textColor}
              fontSize="20"
              fontWeight="bold"
            >
              {isActive ? getPhaseText() : "Ready"}
            </text>
            
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              fill={textColor}
              fontSize="28"
              fontWeight="bold"
            >
              {isActive ? secondsLeft : ""}
            </text>
            
            {isActive && (
              <text
                x="50%"
                y="75%"
                textAnchor="middle"
                fill={textColor}
                fontSize="14"
              >
                Cycle {currentCycle} of {totalCycles}
              </text>
            )}
          </svg>
        </div>
        
        <div className="flex justify-center gap-3 pt-2">
          {!isActive ? (
            <Button onClick={handleStart} className="w-32">Begin</Button>
          ) : (
            <Button onClick={handleStop} variant="outline" className="w-32">Stop</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
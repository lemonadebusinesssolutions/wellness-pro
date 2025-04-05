import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Smile, Frown, Meh, Heart, ThumbsUp, ThumbsDown, Zap, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

type MoodEntry = {
  date: string;
  mood: string;
  energy: string;
  note: string;
};

const moods = [
  { value: 'great', icon: <Smile className="h-6 w-6" />, label: 'Great', color: 'text-green-500' },
  { value: 'good', icon: <ThumbsUp className="h-6 w-6" />, label: 'Good', color: 'text-blue-500' },
  { value: 'okay', icon: <Meh className="h-6 w-6" />, label: 'Okay', color: 'text-yellow-500' },
  { value: 'poor', icon: <ThumbsDown className="h-6 w-6" />, label: 'Poor', color: 'text-orange-500' },
  { value: 'bad', icon: <Frown className="h-6 w-6" />, label: 'Bad', color: 'text-red-500' },
];

const energyLevels = [
  { value: 'high', icon: <Zap className="h-6 w-6" />, label: 'High', color: 'text-purple-500' },
  { value: 'medium', icon: <Heart className="h-6 w-6" />, label: 'Medium', color: 'text-pink-500' },
  { value: 'low', icon: <Clock className="h-6 w-6" />, label: 'Low', color: 'text-blue-400' },
];

export default function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [saved, setSaved] = useState(false);
  
  // Date for today
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error('Failed to parse saved entries', e);
      }
    }
  }, []);
  
  // Save entries to localStorage when they change
  useEffect(() => {
    // Always save entries to localStorage, even if empty (to clear previous entries if needed)
    localStorage.setItem('moodEntries', JSON.stringify(entries));
    console.log('Saving mood entries to localStorage:', entries);
  }, [entries]);
  
  // Check if we already have an entry for today
  useEffect(() => {
    const todayEntry = entries.find(entry => entry.date === today);
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setSelectedEnergy(todayEntry.energy);
      setNote(todayEntry.note);
    } else {
      setSelectedMood('');
      setSelectedEnergy('');
      setNote('');
    }
  }, [entries, today]);
  
  // Save current mood entry
  const saveMoodEntry = () => {
    if (!selectedMood || !selectedEnergy) {
      return;
    }
    
    const newEntry: MoodEntry = {
      date: today,
      mood: selectedMood,
      energy: selectedEnergy,
      note: note.trim()
    };
    
    // Check if we already have an entry for today
    const existingEntryIndex = entries.findIndex(entry => entry.date === today);
    
    let updatedEntries: MoodEntry[];
    
    if (existingEntryIndex >= 0) {
      // Replace today's entry
      updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = newEntry;
    } else {
      // Add new entry
      updatedEntries = [...entries, newEntry];
    }
    
    // Update state
    setEntries(updatedEntries);
    
    // Directly save to localStorage as well (as a backup)
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
    console.log('Directly saved mood entries:', updatedEntries);
    
    // Show saved message
    setSaved(true);
    
    // Hide saved message after 3 seconds
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  
  // Generate last 14 days for visualization
  const last14Days = eachDayOfInterval({
    start: subDays(new Date(), 13),
    end: new Date()
  }).map(date => format(date, 'yyyy-MM-dd'));
  
  // Get icon for a specific mood
  const getMoodIcon = (moodValue: string) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? <span className={mood.color}>{mood.icon}</span> : null;
  };
  
  // Get icon for a specific energy level
  const getEnergyIcon = (energyValue: string) => {
    const energy = energyLevels.find(e => e.value === energyValue);
    return energy ? <span className={energy.color}>{energy.icon}</span> : null;
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM d');
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-center text-xl dark:text-white">Mood Tracker</CardTitle>
        <CardDescription className="text-center dark:text-gray-300">
          Track your mood and energy levels daily
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Today's Mood Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm block mb-3 dark:text-gray-300">How are you feeling today?</Label>
            <div className="flex justify-between">
              <TooltipProvider>
                {moods.map((mood) => (
                  <Tooltip key={mood.value}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedMood === mood.value ? "default" : "outline"}
                        size="icon"
                        className={`h-12 w-12 ${selectedMood === mood.value ? mood.color : ''}`}
                        onClick={() => setSelectedMood(mood.value)}
                      >
                        {mood.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{mood.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
          
          <div>
            <Label className="text-sm block mb-3 dark:text-gray-300">What's your energy level?</Label>
            <div className="flex justify-evenly">
              <TooltipProvider>
                {energyLevels.map((energy) => (
                  <Tooltip key={energy.value}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedEnergy === energy.value ? "default" : "outline"}
                        size="icon"
                        className={`h-12 w-12 ${selectedEnergy === energy.value ? energy.color : ''}`}
                        onClick={() => setSelectedEnergy(energy.value)}
                      >
                        {energy.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{energy.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm dark:text-gray-300">Notes (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What affected your mood today?"
              className="resize-none dark:bg-slate-700 dark:text-gray-100"
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {saved && <span className="text-green-600 dark:text-green-400">✓ Saved</span>}
            </div>
            <Button 
              onClick={saveMoodEntry} 
              disabled={!selectedMood || !selectedEnergy}
            >
              Save Today's Mood
            </Button>
          </div>
        </div>
        
        {/* Mood History Visualization */}
        {entries.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium dark:text-white">Your Mood History</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {last14Days.map((date) => {
                  const entry = entries.find(e => e.date === date);
                  return (
                    <div key={date} className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                      <div className="w-16 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(date)}
                      </div>
                      
                      {entry ? (
                        <>
                          <div className="flex items-center ml-4 mr-2">
                            {getMoodIcon(entry.mood)}
                          </div>
                          <div className="flex items-center ml-2 mr-4">
                            {getEnergyIcon(entry.energy)}
                          </div>
                          {entry.note && (
                            <div className="ml-2 text-sm text-gray-500 truncate dark:text-gray-400">
                              {entry.note}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="ml-4 text-sm text-gray-400 dark:text-gray-500">No entry</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
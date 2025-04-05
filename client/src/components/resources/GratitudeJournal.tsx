import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { X, Calendar } from 'lucide-react';

type JournalEntry = {
  id: string;
  date: string;
  entries: string[];
};

export default function GratitudeJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<string[]>(['', '', '']);
  const [saved, setSaved] = useState(false);
  
  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeEntries');
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
    if (entries.length > 0) {
      localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
    }
  }, [entries]);
  
  // Handle input change for each gratitude entry
  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...currentEntry];
    newEntries[index] = value;
    setCurrentEntry(newEntries);
    setSaved(false);
  };
  
  // Save the current journal entry
  const saveEntry = () => {
    // Don't save if all entries are empty
    if (currentEntry.every(entry => entry.trim() === '')) {
      return;
    }
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: today,
      entries: currentEntry.filter(entry => entry.trim() !== '')
    };
    
    // Check if we already have an entry for today
    const existingEntryIndex = entries.findIndex(entry => entry.date === today);
    
    if (existingEntryIndex >= 0) {
      // Replace today's entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = newEntry;
      setEntries(updatedEntries);
    } else {
      // Add new entry
      setEntries([newEntry, ...entries]);
    }
    
    // Reset form and show saved message
    setCurrentEntry(['', '', '']);
    setSaved(true);
    
    // Hide saved message after 3 seconds
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  
  // Delete an entry
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-center text-xl dark:text-white">Gratitude Journal</CardTitle>
        <CardDescription className="text-center dark:text-gray-300">
          Record three things you're grateful for today
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Entry Form */}
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <Label className="text-sm dark:text-gray-400">
                I'm grateful for...
              </Label>
              <Textarea
                value={currentEntry[index]}
                onChange={(e) => handleEntryChange(index, e.target.value)}
                placeholder={`Write gratitude #${index + 1}`}
                className="resize-none dark:bg-slate-700 dark:text-gray-100"
              />
            </div>
          ))}
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {saved && <span className="text-green-600 dark:text-green-400">✓ Saved</span>}
            </div>
            <Button onClick={saveEntry} disabled={currentEntry.every(entry => entry.trim() === '')}>
              Save Today's Entry
            </Button>
          </div>
        </div>
        
        {/* Previous Entries */}
        {entries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3 dark:text-white">Previous Entries</h3>
            <ScrollArea className="h-60 rounded-md border dark:border-gray-700">
              <div className="space-y-4 p-4">
                {entries.map((entry) => (
                  <div key={entry.id} className="pb-3 border-b last:border-0 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(entry.date)}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteEntry(entry.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ul className="list-disc list-inside space-y-1 dark:text-gray-200">
                      {entry.entries.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
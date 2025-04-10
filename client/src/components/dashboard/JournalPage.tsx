import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface JournalEntry {
  id: number;
  entry: string;
  createdAt: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entryText, setEntryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch journal entries on load
  useEffect(() => {
    fetch("/api/journal", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated or failed to load");
        return res.json();
      })
      .then(setEntries)
      .catch(err => setError(err.message));
  }, []);

  // Submit new entry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ entry: entryText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save entry");
      }

      // Refresh entries
      const updated = await fetch("/api/journal", {
        credentials: "include",
      }).then(res => res.json());

      setEntries(updated);
      setEntryText("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Journal</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Textarea
          placeholder="Write your thoughts..."
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          rows={4}
        />
        <div className="flex items-center space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Entry"}
          </Button>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </form>

      <div className="space-y-6">
        {entries.length === 0 ? (
          <p className="text-muted-foreground">No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="p-4 border rounded-md bg-background">
              <div className="text-sm text-muted-foreground mb-2">
                {format(new Date(entry.createdAt), "PPP p")}
              </div>
              <p className="text-foreground whitespace-pre-wrap">{entry.entry}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

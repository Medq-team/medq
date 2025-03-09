
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface AutoParseInputProps {
  onParsedContent: (questionText: string, options: { id: string; text: string }[]) => void;
}

export function AutoParseInput({ onParsedContent }: AutoParseInputProps) {
  const [rawText, setRawText] = useState('');

  const parseContent = () => {
    if (!rawText.trim()) {
      toast({
        title: "Empty input",
        description: "Please paste a question with answer choices",
        variant: "destructive",
      });
      return;
    }

    try {
      // Common patterns for answer choices
      const optionPatterns = [
        /([A-E]\)|\([A-E]\)|[A-E]\.)\s*(.*?)(?=(?:[A-E]\)|\([A-E]\)|[A-E]\.)|$)/gs,
        /([a-e]\)|\([a-e]\)|[a-e]\.)\s*(.*?)(?=(?:[a-e]\)|\([a-e]\)|[a-e]\.)|$)/gs,
      ];

      // Find the first pattern that matches
      let matches: RegExpMatchArray[] = [];
      let patternUsed = null;

      for (const pattern of optionPatterns) {
        const tempMatches = [...rawText.matchAll(pattern)];
        if (tempMatches.length >= 2) {
          matches = tempMatches;
          patternUsed = pattern;
          break;
        }
      }

      if (!matches.length || !patternUsed) {
        toast({
          title: "Parsing failed",
          description: "Could not detect answer choices in the format A), B), etc.",
          variant: "destructive",
        });
        return;
      }

      // Find the position of the first match to split the question text
      const firstMatchPos = rawText.search(patternUsed);
      const questionText = firstMatchPos > 0 
        ? rawText.substring(0, firstMatchPos).trim() 
        : "Could not extract question text";

      // Process matches into options
      const options = matches.map((match, index) => ({
        id: String(index + 1),
        text: match[2].trim()
      }));

      // Send parsed content to parent component
      onParsedContent(questionText, options);

      toast({
        title: "Parsing successful",
        description: `Extracted ${options.length} answer choices`,
      });
    } catch (error) {
      console.error("Parsing error:", error);
      toast({
        title: "Parsing error",
        description: "An error occurred while parsing the content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-md bg-slate-50">
      <h3 className="text-sm font-medium">Auto-Parse Question</h3>
      <Textarea
        placeholder="Paste your full question with answer choices (e.g., 'What is X?&#10;A) Option 1&#10;B) Option 2&#10;C) Option 3')"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="min-h-32 font-mono text-sm"
      />
      <Button 
        type="button" 
        onClick={parseContent} 
        size="sm"
        className="w-full"
      >
        Parse Question
      </Button>
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Share2, Baby, Sparkles, Moon, Sun } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import NameCard from '@/components/NameCard';
import AIChat from '@/components/AIChat';
import { generateNames } from '@/utils/nameGenerator';

interface NamePreferences {
  fatherName: string;
  motherName: string;
  gender: string;
  religion: string;
  culture: string;
  startLetter: string;
  endLetter: string;
  mustInclude: string;
  meaningPreference: string;
  siblingNames: string;
  birthDate: string;
  birthTime: string;
  nameRules: string[];
}

interface GeneratedName {
  name: string;
  meaning: string;
  origin: string;
  gender: string;
  pronunciation: string;
  popularity: number;
  numerology?: number;
  astrology?: string;
  siblingMatch?: boolean;
}

const Index = () => {
  const [preferences, setPreferences] = useState<NamePreferences>({
    fatherName: '',
    motherName: '',
    gender: '',
    religion: '',
    culture: '',
    startLetter: '',
    endLetter: '',
    mustInclude: '',
    meaningPreference: '',
    siblingNames: '',
    birthDate: '',
    birthTime: '',
    nameRules: []
  });

  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [favorites, setFavorites] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');

  const religions = ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Buddhist', 'Jewish', 'Other'];
  const cultures = ['Sanskrit', 'Tamil', 'Hindi', 'Arabic', 'Western', 'Modern', 'Traditional', 'Hebrew', 'Greek'];
  const meanings = ['Joyful', 'Divine', 'Brave', 'Peaceful', 'Intelligent', 'Strong', 'Beautiful', 'Prosperous', 'Blessed'];
  
  const nameRuleOptions = [
    'First letter from father + last letter from mother',
    'Combination of parent names',
    'Phonetic blend (AI-based)',
    'Only names with meaningful origin',
    'Astrology-based suggestion',
    'Sibling name compatibility'
  ];

  const handleInputChange = (field: keyof NamePreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleRuleChange = (rule: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      nameRules: checked 
        ? [...prev.nameRules, rule]
        : prev.nameRules.filter(r => r !== rule)
    }));
  };

  const handleGenerateNames = async () => {
    if (!preferences.fatherName || !preferences.motherName || !preferences.gender) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the parent names and baby gender.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const names = await generateNames(preferences);
      setGeneratedNames(names);
      toast({
        title: "Names Generated!",
        description: `Found ${names.length} beautiful name suggestions for you.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate names. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (name: GeneratedName) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.name === name.name);
      if (exists) {
        return prev.filter(f => f.name !== name.name);
      } else {
        return [...prev, name];
      }
    });
  };

  const isFavorite = (name: GeneratedName) => {
    return favorites.some(f => f.name === name.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Baby className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Baby Name Generator
            </h1>
            <Sparkles className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect name for your little one with AI-powered suggestions based on culture, meaning, and family preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="generator">Name Generator</TabsTrigger>
            <TabsTrigger value="results">Results ({generatedNames.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-purple-600" />
                  Tell us about your preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input
                      id="fatherName"
                      value={preferences.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name *</Label>
                    <Input
                      id="motherName"
                      value={preferences.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                      placeholder="Enter mother's name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Baby Gender *</Label>
                    <Select value={preferences.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boy">Boy</SelectItem>
                        <SelectItem value="girl">Girl</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Religion</Label>
                    <Select value={preferences.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        {religions.map(religion => (
                          <SelectItem key={religion} value={religion.toLowerCase()}>{religion}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cultural Preference</Label>
                    <Select value={preferences.culture} onValueChange={(value) => handleInputChange('culture', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select culture" />
                      </SelectTrigger>
                      <SelectContent>
                        {cultures.map(culture => (
                          <SelectItem key={culture} value={culture.toLowerCase()}>{culture}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startLetter">Preferred Start Letter</Label>
                    <Input
                      id="startLetter"
                      value={preferences.startLetter}
                      onChange={(e) => handleInputChange('startLetter', e.target.value.toUpperCase())}
                      placeholder="A"
                      maxLength={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endLetter">Preferred End Letter</Label>
                    <Input
                      id="endLetter"
                      value={preferences.endLetter}
                      onChange={(e) => handleInputChange('endLetter', e.target.value.toLowerCase())}
                      placeholder="a"
                      maxLength={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mustInclude">Must Include Letters</Label>
                    <Input
                      id="mustInclude"
                      value={preferences.mustInclude}
                      onChange={(e) => handleInputChange('mustInclude', e.target.value)}
                      placeholder="ar, sh"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Meaning Preference</Label>
                  <Select value={preferences.meaningPreference} onValueChange={(value) => handleInputChange('meaningPreference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred meaning" />
                    </SelectTrigger>
                    <SelectContent>
                      {meanings.map(meaning => (
                        <SelectItem key={meaning} value={meaning.toLowerCase()}>{meaning}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siblingNames">Sibling Names (Optional)</Label>
                  <Input
                    id="siblingNames"
                    value={preferences.siblingNames}
                    onChange={(e) => handleInputChange('siblingNames', e.target.value)}
                    placeholder="Enter sibling names separated by commas"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date (Optional)</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={preferences.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthTime">Birth Time (Optional)</Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={preferences.birthTime}
                      onChange={(e) => handleInputChange('birthTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Name Generation Rules</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {nameRuleOptions.map((rule) => (
                      <div key={rule} className="flex items-center space-x-2">
                        <Checkbox
                          id={rule}
                          checked={preferences.nameRules.includes(rule)}
                          onCheckedChange={(checked) => handleRuleChange(rule, checked as boolean)}
                        />
                        <Label htmlFor={rule} className="text-sm">{rule}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateNames} 
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating Names...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generate Names
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedNames.map((name, index) => (
                <NameCard
                  key={index}
                  name={name}
                  isFavorite={isFavorite(name)}
                  onToggleFavorite={() => toggleFavorite(name)}
                />
              ))}
              {generatedNames.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Sun className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No names generated yet. Use the generator to create suggestions!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((name, index) => (
                <NameCard
                  key={index}
                  name={name}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(name)}
                />
              ))}
              {favorites.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No favorites yet. Heart the names you love!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <AIChat preferences={preferences} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

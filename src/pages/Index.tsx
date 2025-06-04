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
import { Heart, Star, Share2, Baby, Sparkles, Moon, Sun, ChevronDown, ChevronUp, Settings, Download, Copy } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import NameCard from '@/components/NameCard';
import AIChat from '@/components/AIChat';
import { generateNames } from '@/utils/nameGenerator';
import { exportToExcel, copyAllNamesAndMeanings } from '@/utils/excelExport';
import MagicalBackground from '@/components/MagicalBackground';

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
  searchType: string; // New field
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
    nameRules: [],
    searchType: 'traditional'
  });

  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [favorites, setFavorites] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const religions = ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Buddhist', 'Jewish', 'Other'];
  const cultures = ['Sanskrit', 'Tamil', 'Hindi', 'Arabic', 'Western', 'Modern', 'Traditional', 'Hebrew', 'Greek'];
  const meanings = ['Joyful', 'Divine', 'Brave', 'Peaceful', 'Intelligent', 'Strong', 'Beautiful', 'Prosperous', 'Blessed'];
  
  const searchTypes = [
    { value: 'traditional', label: 'Traditional Names' },
    { value: 'first-letters', label: 'First Letter Combinations' },
    { value: 'syllable-blend', label: 'Syllable Blending' },
    { value: 'vowel-consonant', label: 'Vowel-Consonant Patterns' },
    { value: 'meaning-based', label: 'Meaning-Based Search' },
    { value: 'cultural-fusion', label: 'Cultural Fusion' }
  ];
  
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
        description: "Please fill in the parent names and baby gender.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const names = await generateNames(preferences);
      setGeneratedNames(names);
      setActiveTab('results');
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

  const handleExportToExcel = () => {
    if (generatedNames.length === 0) {
      toast({
        title: "No Names to Export",
        description: "Generate some names first before exporting.",
        variant: "destructive"
      });
      return;
    }

    exportToExcel(generatedNames, 'astroname-suggestions');
    toast({
      title: "Excel Export Complete!",
      description: `Exported ${generatedNames.length} names to CSV file.`,
    });
  };

  const handleCopyAllNames = async () => {
    if (generatedNames.length === 0) {
      toast({
        title: "No Names to Copy",
        description: "Generate some names first before copying.",
        variant: "destructive"
      });
      return;
    }

    const success = await copyAllNamesAndMeanings(generatedNames);
    if (success) {
      toast({
        title: "All Names Copied!",
        description: `Copied ${generatedNames.length} names and meanings to clipboard.`,
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      <MagicalBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Baby className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              AstroName AI
            </h1>
            <Sparkles className="h-8 w-8 text-pink-400" />
          </div>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto font-medium">
            "Where love, stars, and names align."
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Discover the perfect name for your little one with AI-powered suggestions and cosmic insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="generator" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Name Generator</TabsTrigger>
            <TabsTrigger value="results" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Results ({generatedNames.length})</TabsTrigger>
            <TabsTrigger value="favorites" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="chat" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Card className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border border-purple-100/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Moon className="h-5 w-5 text-purple-600" />
                  Tell us about your preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Essential Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fatherName" className="text-base font-medium">Father's Name *</Label>
                      <Input
                        id="fatherName"
                        value={preferences.fatherName}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        placeholder="Enter father's name"
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherName" className="text-base font-medium">Mother's Name *</Label>
                      <Input
                        id="motherName"
                        value={preferences.motherName}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                        placeholder="Enter mother's name"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Baby Gender *</Label>
                    <Select value={preferences.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boy">Boy</SelectItem>
                        <SelectItem value="girl">Girl</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Settings */}
                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full h-12 text-base">
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                      {showAdvanced ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="startLetter">Start Letter</Label>
                        <Input
                          id="startLetter"
                          value={preferences.startLetter}
                          onChange={(e) => handleInputChange('startLetter', e.target.value.toUpperCase())}
                          placeholder="A"
                          maxLength={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endLetter">End Letter</Label>
                        <Input
                          id="endLetter"
                          value={preferences.endLetter}
                          onChange={(e) => handleInputChange('endLetter', e.target.value.toLowerCase())}
                          placeholder="a"
                          maxLength={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mustInclude">Must Include</Label>
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
                      <Label htmlFor="siblingNames">Sibling Names</Label>
                      <Input
                        id="siblingNames"
                        value={preferences.siblingNames}
                        onChange={(e) => handleInputChange('siblingNames', e.target.value)}
                        placeholder="Enter sibling names (optional)"
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
                  </CollapsibleContent>
                </Collapsible>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Search Type</Label>
                  <Select value={preferences.searchType} onValueChange={(value) => handleInputChange('searchType', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Choose how to generate names" />
                    </SelectTrigger>
                    <SelectContent>
                      {searchTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {preferences.searchType === 'first-letters' && "Combines first letters from both parent names"}
                    {preferences.searchType === 'syllable-blend' && "Blends syllables from parent names creatively"}
                    {preferences.searchType === 'vowel-consonant' && "Uses vowel-consonant patterns from parent names"}
                    {preferences.searchType === 'meaning-based' && "Focuses on meanings related to parent names"}
                    {preferences.searchType === 'cultural-fusion' && "Blends cultural elements from both parents"}
                  </p>
                </div>

                <Button 
                  onClick={handleGenerateNames} 
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Names...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generate Beautiful Names
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              {generatedNames.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={handleCopyAllNames}
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-purple-200 text-purple-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Names & Meanings
                  </Button>
                  <Button
                    onClick={handleExportToExcel}
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-green-200 text-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                </div>
              )}
              
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
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="space-y-6">
              {favorites.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={() => copyAllNamesAndMeanings(favorites)}
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-purple-200 text-purple-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Favorites
                  </Button>
                  <Button
                    onClick={() => exportToExcel(favorites, 'favorite-names')}
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-green-200 text-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Favorites to Excel
                  </Button>
                </div>
              )}
              
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

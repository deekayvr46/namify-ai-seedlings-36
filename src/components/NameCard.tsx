import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Star, Volume2, Sparkles, Users } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

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
  derivation?: string;
  parentConnection?: string;
}

interface NameCardProps {
  name: GeneratedName;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const NameCard: React.FC<NameCardProps> = ({ name, isFavorite, onToggleFavorite }) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Baby Name Suggestion: ${name.name}`,
        text: `${name.name} - ${name.meaning} (${name.origin} origin)`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${name.name} - ${name.meaning} (${name.origin} origin)`);
      toast({
        title: "Copied to clipboard!",
        description: "Name details copied to clipboard."
      });
    }
  };

  const handlePronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(name.name);
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Pronunciation",
        description: name.pronunciation
      });
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'bg-green-100 text-green-800';
    if (popularity >= 60) return 'bg-yellow-100 text-yellow-800';
    if (popularity >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getPopularityText = (popularity: number) => {
    if (popularity >= 80) return 'Very Popular';
    if (popularity >= 60) return 'Popular';
    if (popularity >= 40) return 'Moderate';
    return 'Unique';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm border border-purple-100/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              {name.name}
              {name.parentConnection && <Users className="h-4 w-4 text-purple-500" />}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePronunciation}
                className="p-1 h-auto text-gray-600 hover:text-purple-600"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500 font-mono">
                {name.pronunciation}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={`p-2 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-blue-500"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Meaning</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{name.meaning}</p>
        </div>

        {name.parentConnection && (
          <div className="space-y-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold text-purple-700 text-sm">Parent Connection</h4>
            </div>
            <p className="text-purple-600 text-xs leading-relaxed">{name.parentConnection}</p>
          </div>
        )}

        {name.derivation && (
          <div className="space-y-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-700 text-sm">How It's Derived</h4>
            <p className="text-blue-600 text-xs leading-relaxed">{name.derivation}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {name.origin}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {name.gender}
          </Badge>
          <Badge variant="secondary" className={getPopularityColor(name.popularity)}>
            {getPopularityText(name.popularity)}
          </Badge>
        </div>

        {name.siblingMatch && (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <Star className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Great sibling match!</span>
          </div>
        )}

        {(name.numerology || name.astrology) && (
          <div className="space-y-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            {name.numerology && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Numerology</span>
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  {name.numerology}
                </Badge>
              </div>
            )}
            {name.astrology && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Astrology</span>
                <Badge variant="outline" className="border-pink-300 text-pink-700">
                  {name.astrology}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NameCard;

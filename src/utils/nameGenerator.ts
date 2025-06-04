const GEMINI_API_KEY = "AIzaSyAsRmslyg9KCbG09LfiX5qts_5Fsj3xd5o";

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
  searchType: string; // New field for search types
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
  derivation?: string; // New field for parent name derivation
  parentConnection?: string; // How it connects to parent names
}

// Numerology calculation
const calculateNumerology = (name: string): number => {
  const nameValue = name.toLowerCase().split('').reduce((sum, char) => {
    const charCode = char.charCodeAt(0);
    if (charCode >= 97 && charCode <= 122) {
      return sum + (charCode - 96);
    }
    return sum;
  }, 0);
  
  // Reduce to single digit
  let result = nameValue;
  while (result > 9) {
    result = result.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return result;
};

// Astrology sign calculation
const getAstrologySign = (birthDate: string): string => {
  if (!birthDate) return '';
  
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  
  return '';
};

// Parent name blending algorithms
const blendParentNames = (fatherName: string, motherName: string, rules: string[], searchType: string): { name: string; explanation: string }[] => {
  const blended: { name: string; explanation: string }[] = [];
  
  if (searchType === 'first-letters' || rules.includes('First letter from father + last letter from mother')) {
    if (fatherName && motherName) {
      const name = fatherName[0] + motherName.slice(-1);
      blended.push({
        name: name,
        explanation: `Combines first letter '${fatherName[0]}' from father's name '${fatherName}' with last letter '${motherName.slice(-1)}' from mother's name '${motherName}'`
      });
    }
  }
  
  if (searchType === 'syllable-blend' || rules.includes('Combination of parent names')) {
    if (fatherName && motherName) {
      const fatherMid = Math.floor(fatherName.length / 2);
      const motherMid = Math.floor(motherName.length / 2);
      
      const blend1 = fatherName.slice(0, fatherMid) + motherName.slice(motherMid);
      const blend2 = motherName.slice(0, motherMid) + fatherName.slice(fatherMid);
      
      blended.push({
        name: blend1,
        explanation: `Syllable fusion: '${fatherName.slice(0, fatherMid)}' (first half of ${fatherName}) + '${motherName.slice(motherMid)}' (second half of ${motherName})`
      });
      
      blended.push({
        name: blend2,
        explanation: `Syllable fusion: '${motherName.slice(0, motherMid)}' (first half of ${motherName}) + '${fatherName.slice(fatherMid)}' (second half of ${fatherName})`
      });
    }
  }
  
  if (searchType === 'vowel-consonant') {
    if (fatherName && motherName) {
      const fatherVowels = fatherName.match(/[aeiou]/gi) || [];
      const motherConsonants = motherName.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
      
      if (fatherVowels.length > 0 && motherConsonants.length > 0) {
        const name = motherConsonants[0] + fatherVowels[0] + (motherConsonants[1] || '') + (fatherVowels[1] || '');
        blended.push({
          name: name,
          explanation: `Vowel-consonant pattern: Uses vowels from '${fatherName}' (${fatherVowels.join(', ')}) and consonants from '${motherName}' (${motherConsonants.join(', ')})`
        });
      }
    }
  }
  
  return blended.filter(item => item.name.length >= 3 && item.name.length <= 8);
};

// Check sibling compatibility
const checkSiblingCompatibility = (name: string, siblingNames: string): boolean => {
  if (!siblingNames) return false;
  
  const siblings = siblingNames.split(',').map(s => s.trim().toLowerCase());
  const nameLower = name.toLowerCase();
  
  // Check for similar starting letters
  const nameStart = nameLower[0];
  const siblingStarts = siblings.map(s => s[0]);
  
  // Check for rhythmic similarity (syllable count)
  const nameLength = name.length;
  const siblingLengths = siblings.map(s => s.length);
  
  return siblingStarts.includes(nameStart) || siblingLengths.some(len => Math.abs(len - nameLength) <= 2);
};

export const generateNames = async (preferences: NamePreferences): Promise<GeneratedName[]> => {
  try {
    // Build the prompt based on preferences
    let prompt = `Generate 12 meaningful baby names with detailed explanations of how they connect to the parent names or preferences:
    
Father's name: ${preferences.fatherName}
Mother's name: ${preferences.motherName}
Gender: ${preferences.gender}
Religion: ${preferences.religion || 'any'}
Culture/Language: ${preferences.culture || 'any'}
Search Type: ${preferences.searchType || 'traditional'}
`;

    if (preferences.startLetter) {
      prompt += `Start with letter: ${preferences.startLetter}\n`;
    }
    
    if (preferences.endLetter) {
      prompt += `End with letter: ${preferences.endLetter}\n`;
    }
    
    if (preferences.mustInclude) {
      prompt += `Must include letters: ${preferences.mustInclude}\n`;
    }
    
    if (preferences.meaningPreference) {
      prompt += `Preferred meaning: ${preferences.meaningPreference}\n`;
    }
    
    if (preferences.siblingNames) {
      prompt += `Sibling names for compatibility: ${preferences.siblingNames}\n`;
    }

    prompt += `
For each name, provide detailed explanation of:
1. How it relates to the parent names (if applicable)
2. Cultural significance
3. Meaning derivation
4. Why it fits the preferences

Please provide each name in this exact JSON format:
{
  "name": "Name",
  "meaning": "Detailed meaning description",
  "origin": "Cultural origin",
  "gender": "boy/girl/unisex",
  "pronunciation": "phonetic pronunciation",
  "popularity": number between 1-100,
  "derivation": "How this name relates to or derives from the parent names and preferences",
  "parentConnection": "Specific connection to father/mother names if any"
}

Return an array of 12 such name objects. Focus on meaningful connections and beautiful derivations.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      console.error('API Response:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response format');
    }
    
    let generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response to extract JSON
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let names: GeneratedName[];
    try {
      names = JSON.parse(generatedText);
    } catch (parseError) {
      console.log('JSON parse failed, using fallback names');
      names = getFallbackNames(preferences);
    }

    // Apply additional processing
    const processedNames = names.map(name => {
      const processedName = { ...name };
      
      // Add numerology if birth date provided
      if (preferences.birthDate) {
        processedName.numerology = calculateNumerology(name.name);
        processedName.astrology = getAstrologySign(preferences.birthDate);
      }
      
      // Check sibling compatibility
      if (preferences.siblingNames) {
        processedName.siblingMatch = checkSiblingCompatibility(name.name, preferences.siblingNames);
      }
      
      return processedName;
    });

    // Add blended names with explanations
    const blendedNames = blendParentNames(preferences.fatherName, preferences.motherName, preferences.nameRules, preferences.searchType);
    if (blendedNames.length > 0) {
      const blendedNameObjects = blendedNames.slice(0, 3).map(blendedItem => ({
        name: blendedItem.name.charAt(0).toUpperCase() + blendedItem.name.slice(1),
        meaning: `Creative blend of parent names`,
        origin: 'Parent blend',
        gender: preferences.gender,
        pronunciation: blendedItem.name.toLowerCase(),
        popularity: 30,
        derivation: blendedItem.explanation,
        parentConnection: `Direct combination of ${preferences.fatherName} and ${preferences.motherName}`,
        numerology: preferences.birthDate ? calculateNumerology(blendedItem.name) : undefined,
        astrology: preferences.birthDate ? getAstrologySign(preferences.birthDate) : undefined,
        siblingMatch: preferences.siblingNames ? checkSiblingCompatibility(blendedItem.name, preferences.siblingNames) : undefined
      }));
      
      processedNames.splice(0, 0, ...blendedNameObjects);
    }

    return processedNames.slice(0, 15); // Limit to 15 names
  } catch (error) {
    console.error('Error generating names:', error);
    return getFallbackNames(preferences);
  }
};

export const chatWithAI = async (message: string, preferences: NamePreferences): Promise<ChatResponse> => {
  try {
    const context = `User preferences: Gender: ${preferences.gender}, Religion: ${preferences.religion}, Culture: ${preferences.culture}, Father: ${preferences.fatherName}, Mother: ${preferences.motherName}`;
    
    const prompt = `${context}

User question: ${message}

Please provide a helpful response about baby names. If the user is asking for specific name suggestions, provide 3-5 names with brief explanations. Keep the response conversational and helpful.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Generate follow-up suggestions based on the conversation
    const suggestions = [
      "Tell me more about the origin of these names",
      "Suggest similar names with different meanings",
      "What are some unique variations?",
      "How do these names sound with our last name?"
    ];

    return {
      content,
      suggestions: suggestions.slice(0, 3)
    };
  } catch (error) {
    console.error('Error in AI chat:', error);
    return {
      content: "I'm sorry, I'm having trouble connecting right now. Please try asking your question again in a moment.",
      suggestions: [
        "Give me traditional names for boys",
        "Suggest modern names for girls", 
        "What are some unisex name options?"
      ]
    };
  }
};

// Fallback names if API fails
const getFallbackNames = (preferences: NamePreferences): GeneratedName[] => {
  const fallbackNames = [
    { name: "Arjun", meaning: "Bright, shining, white", origin: "Sanskrit", gender: "boy", pronunciation: "AR-jun", popularity: 85 },
    { name: "Aaradhya", meaning: "Worshipped, blessed", origin: "Sanskrit", gender: "girl", pronunciation: "aa-RAADH-ya", popularity: 78 },
    { name: "Advait", meaning: "Unique, without a second", origin: "Sanskrit", gender: "boy", pronunciation: "ad-VAIT", popularity: 72 },
    { name: "Ananya", meaning: "Unique, incomparable", origin: "Sanskrit", gender: "girl", pronunciation: "a-NAN-ya", popularity: 80 },
    { name: "Vivaan", meaning: "Full of life", origin: "Sanskrit", gender: "boy", pronunciation: "vi-VAAN", popularity: 88 },
    { name: "Saisha", meaning: "Meaningful life", origin: "Sanskrit", gender: "girl", pronunciation: "SAI-sha", popularity: 65 }
  ];

  return fallbackNames.filter(name => 
    !preferences.gender || preferences.gender === 'unisex' || name.gender === preferences.gender
  ).map(name => ({
    ...name,
    numerology: preferences.birthDate ? calculateNumerology(name.name) : undefined,
    astrology: preferences.birthDate ? getAstrologySign(preferences.birthDate) : undefined,
    siblingMatch: preferences.siblingNames ? checkSiblingCompatibility(name.name, preferences.siblingNames) : undefined
  }));
};

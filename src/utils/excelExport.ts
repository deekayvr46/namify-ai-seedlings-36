
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

export const exportToExcel = (names: GeneratedName[], fileName: string = 'baby-names') => {
  // Create CSV content
  const headers = [
    'Name',
    'Meaning',
    'Origin',
    'Gender',
    'Pronunciation',
    'Popularity',
    'Parent Connection',
    'Derivation',
    'Numerology',
    'Astrology',
    'Sibling Match'
  ];

  const csvContent = [
    headers.join(','),
    ...names.map(name => [
      `"${name.name}"`,
      `"${name.meaning}"`,
      `"${name.origin}"`,
      `"${name.gender}"`,
      `"${name.pronunciation}"`,
      name.popularity,
      `"${name.parentConnection || ''}"`,
      `"${name.derivation || ''}"`,
      name.numerology || '',
      `"${name.astrology || ''}"`,
      name.siblingMatch ? 'Yes' : 'No'
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const copyAllNamesAndMeanings = async (names: GeneratedName[]) => {
  const content = names.map(name => {
    let text = `${name.name} - ${name.meaning}`;
    text += `\nOrigin: ${name.origin} | Gender: ${name.gender}`;
    text += `\nPronunciation: ${name.pronunciation}`;
    
    if (name.parentConnection) {
      text += `\nParent Connection: ${name.parentConnection}`;
    }
    
    if (name.derivation) {
      text += `\nDerivation: ${name.derivation}`;
    }
    
    return text;
  }).join('\n\n---\n\n');

  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

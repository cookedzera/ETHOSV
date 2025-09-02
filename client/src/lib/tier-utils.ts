export interface TierInfo {
  name: string;
  color: string;
  icon: string;
  range: [number, number];
}

export function getTierInfo(score: number): TierInfo {
  if (score >= 2600) {
    return {
      name: 'Renowned',
      color: '#FFD700', // Bright Gold - Highest tier
      icon: '👑',
      range: [2600, 2800]
    };
  } else if (score >= 2400) {
    return {
      name: 'Revered',
      color: '#FF6B35', // Vibrant Orange - Very high
      icon: '👑',
      range: [2400, 2599]
    };
  } else if (score >= 2200) {
    return {
      name: 'Distinguished',
      color: '#8E44AD', // Deep Purple - High
      icon: '👑',
      range: [2200, 2399]
    };
  } else if (score >= 2000) {
    return {
      name: 'Exemplary',
      color: '#27AE60', // Emerald Green - Good
      icon: '👑',
      range: [2000, 2199]
    };
  } else if (score >= 1800) {
    return {
      name: 'Reputable',
      color: '#3498DB', // Bright Blue - Trustworthy
      icon: '🏆',
      range: [1800, 1999]
    };
  } else if (score >= 1600) {
    return {
      name: 'Established',
      color: '#E74C3C', // Clear Red - Established
      icon: '⭐',
      range: [1600, 1799]
    };
  } else if (score >= 1400) {
    return {
      name: 'Known',
      color: '#F39C12', // Amber Orange - Known entity
      icon: '🔥',
      range: [1400, 1599]
    };
  } else if (score >= 1200) {
    return {
      name: 'Neutral',
      color: '#95A5A6', // Cool Gray - Neutral
      icon: '⚡',
      range: [1200, 1399]
    };
  } else if (score >= 800) {
    return {
      name: 'Questionable',
      color: '#F59E0B', // Amber
      icon: '⚠️',
      range: [800, 1199]
    };
  } else {
    return {
      name: 'Untrusted',
      color: '#6B7280', // Gray
      icon: '🛡️',
      range: [0, 799]
    };
  }
}
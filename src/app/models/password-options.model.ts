export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSpecial: boolean;
  ignoreChars: string;
}

export type PasswordStrength = 'weak' | 'moderate' | 'strong' | 'very-strong';

export interface PasswordHistoryEntry {
  password: string;
  timestamp: Date;
  strength: PasswordStrength;
}

import { PasswordStrength } from './password-strength.model';

export interface PasswordHistoryEntry {
  password: string;
  timestamp: Date;
  strength: PasswordStrength;
}
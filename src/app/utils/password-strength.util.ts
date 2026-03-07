import { PasswordStrength } from "../models/password-strength.model";

/**
 * Calculates password strength based on length and character diversity.
 *
 * Scoring:
 *   Length  >= 20 → +3 | >= 16 → +2 | >= 12 → +1 | < 12 → +0
 *   Diversity (unique char classes present): score += (classes - 1), clamped 0..3
 *
 * Final score → strength:
 *   0-1 → weak | 2-3 → moderate | 4-5 → strong | 6+ → very-strong
 */
export function calculateStrength(password: string): PasswordStrength {
  if (!password || password.length < 4) return "weak";

  const len = password.length;
  let score = 0;

  // Length score
  if (len >= 20) score += 3;
  else if (len >= 16) score += 2;
  else if (len >= 12) score += 1;

  // Diversity score
  let diversity = 0;
  if (/[A-Z]/.test(password)) diversity++;
  if (/[a-z]/.test(password)) diversity++;
  if (/[0-9]/.test(password)) diversity++;
  if (/[^A-Za-z0-9]/.test(password)) diversity++;
  score += Math.max(0, diversity - 1);

  if (score >= 6) return "very-strong";
  if (score >= 4) return "strong";
  if (score >= 2) return "moderate";
  return "weak";
}

export function getStrengthLabel(strength: PasswordStrength): string {
  const labels: Record<PasswordStrength, string> = {
    weak: "Weak",
    moderate: "Moderate",
    strong: "Strong",
    "very-strong": "Very Strong",
  };
  return labels[strength];
}

export function getStrengthPercent(strength: PasswordStrength): number {
  const percents: Record<PasswordStrength, number> = {
    weak: 25,
    moderate: 50,
    strong: 75,
    "very-strong": 100,
  };
  return percents[strength];
}

import { Injectable } from '@angular/core';
import { PasswordOptions } from '../models/password-options.model';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  /**
   * Builds the character pool from selected options, removing ignored characters.
   * Returns an empty string if the pool is empty after filtering.
   */
  buildCharPool(options: PasswordOptions): string {
    let pool = '';
    if (options.includeUppercase) pool += UPPERCASE;
    if (options.includeLowercase) pool += LOWERCASE;
    if (options.includeNumbers) pool += NUMBERS;
    if (options.includeSpecial) pool += SPECIAL;

    if (options.ignoreChars) {
      const ignoreSet = new Set(options.ignoreChars.split(''));
      pool = pool
        .split('')
        .filter((c) => !ignoreSet.has(c))
        .join('');
    }

    return pool;
  }

  /**
   * Generates a cryptographically secure random password.
   * Returns null if the character pool is empty (impossible to generate).
   */
  generatePassword(options: PasswordOptions): string | null {
    const pool = this.buildCharPool(options);
    if (!pool.length) return null;

    // Use crypto.getRandomValues for secure randomness
    const bytes = new Uint32Array(options.length);
    crypto.getRandomValues(bytes);

    return Array.from(bytes, (v) => pool[v % pool.length]).join('');
  }
}

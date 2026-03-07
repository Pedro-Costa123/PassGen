import { Component, OnInit, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PasswordService } from '../../services/password.service';
import { ThemeService } from '../../services/theme.service';
import { PasswordOptions, PasswordHistoryEntry, PasswordStrength } from '../../models/password-options.model';
import {
  calculateStrength,
  getStrengthLabel,
  getStrengthPercent,
} from '../../utils/password-strength.util';

interface CharOption {
  key: keyof Pick<PasswordOptions, 'includeUppercase' | 'includeLowercase' | 'includeNumbers' | 'includeSpecial'>;
  label: string;
  example: string;
}

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.scss',
})
export class PasswordGeneratorComponent implements OnInit {
  form!: FormGroup;

  readonly generatedPassword = signal('');
  readonly copiedMain = signal(false);
  readonly copiedHistoryIndex = signal<number | null>(null);
  readonly history = signal<PasswordHistoryEntry[]>([]);
  readonly validationError = signal('');

  readonly strength = computed(() => calculateStrength(this.generatedPassword()));
  readonly strengthLabel = computed(() => getStrengthLabel(this.strength()));
  readonly strengthPercent = computed(() => getStrengthPercent(this.strength()));

  readonly charOptions: CharOption[] = [
    { key: 'includeUppercase', label: 'Uppercase', example: 'A–Z' },
    { key: 'includeLowercase', label: 'Lowercase', example: 'a–z' },
    { key: 'includeNumbers', label: 'Numbers', example: '0–9' },
    { key: 'includeSpecial', label: 'Special', example: '!@#$%' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly passwordService: PasswordService,
    public readonly themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      length: [16, [Validators.required, Validators.min(4), Validators.max(128)]],
      includeUppercase: [true],
      includeLowercase: [true],
      includeNumbers: [true],
      includeSpecial: [true],
      ignoreChars: [''],
    });

    // Generate a password immediately so the UI is populated on load
    this.generatePassword();
  }

  get lengthValue(): number {
    return this.form.get('length')?.value ?? 16;
  }

  generatePassword(): void {
    const options: PasswordOptions = this.form.value as PasswordOptions;

    const anyTypeSelected =
      options.includeUppercase ||
      options.includeLowercase ||
      options.includeNumbers ||
      options.includeSpecial;

    if (!anyTypeSelected) {
      this.validationError.set('Select at least one character type to generate a password.');
      return;
    }

    const password = this.passwordService.generatePassword(options);

    if (!password) {
      this.validationError.set(
        'No characters remain after excluding the ignored ones. Please adjust your settings.',
      );
      return;
    }

    this.validationError.set('');
    this.generatedPassword.set(password);

    const entry: PasswordHistoryEntry = {
      password,
      timestamp: new Date(),
      strength: calculateStrength(password),
    };

    this.history.update((h) => [entry, ...h].slice(0, 10));
  }

  async copyToClipboard(text: string, isMain: boolean, historyIndex?: number): Promise<void> {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for environments where Clipboard API is unavailable
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    if (isMain) {
      this.copiedMain.set(true);
      setTimeout(() => this.copiedMain.set(false), 2000);
    } else if (historyIndex !== undefined) {
      this.copiedHistoryIndex.set(historyIndex);
      setTimeout(() => this.copiedHistoryIndex.set(null), 2000);
    }
  }

  clearHistory(): void {
    this.history.set([]);
  }

  getStrengthLabelFor(strength: PasswordStrength): string {
    return getStrengthLabel(strength);
  }

  getStrengthPercentFor(strength: PasswordStrength): number {
    return getStrengthPercent(strength);
  }
}

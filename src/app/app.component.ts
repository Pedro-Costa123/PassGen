import { Component, ChangeDetectionStrategy } from "@angular/core";
import { PasswordGeneratorComponent } from "./components/password-generator/password-generator.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [PasswordGeneratorComponent],
  template: `<app-password-generator />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [],
})
export class AppComponent {}

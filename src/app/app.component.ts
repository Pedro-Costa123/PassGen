import { Component } from "@angular/core";
import { PasswordGeneratorComponent } from "./components/password-generator/password-generator.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [PasswordGeneratorComponent],
  template: `<app-password-generator />`,
  styles: [],
})
export class AppComponent {}

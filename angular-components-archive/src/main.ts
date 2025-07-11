import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckboxComponent } from './app/components/checkbox/checkbox.component';
import { CheckboxGroupComponent, CheckboxOption } from './app/components/checkbox/checkbox-group.component';
import { RadioComponent } from './app/components/radio/radio.component';
import { RadioGroupComponent, RadioOption } from './app/components/radio/radio-group.component';
import { TextFieldComponent } from './app/components/text-field/text-field.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    CheckboxGroupComponent,
    RadioComponent,
    RadioGroupComponent,
    TextFieldComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>C4 Text Fields, Checkbox, Radio Button Components (DSD-23,34,33)</h1>
        <p>C4 Text Fields, Checkbox, Radio Button Components (DSD-23,34,33) based on Figma design specification files</p>
      </header>

      <main class="app-main">
        <!-- Basic Checkbox Examples -->
        <section class="demo-section">
          <h2>Basic Checkbox States</h2>
          <div class="checkbox-examples">
            <div class="example-group">
              <h3>Default States</h3>
              <app-checkbox label="Default checkbox" />
              <app-checkbox label="Checked checkbox" [checked]="true" />
              <app-checkbox label="Disabled checkbox" [disabled]="true" />
              <app-checkbox label="Disabled checked" [checked]="true" [disabled]="true" />
            </div>

            <div class="example-group">
              <h3>Error States</h3>
              <app-checkbox label="Error checkbox" [error]="true" />
              <app-checkbox label="Error checked" [checked]="true" [error]="true" />
            </div>

            <div class="example-group">
              <h3>Indeterminate State</h3>
              <app-checkbox label="Indeterminate checkbox" [indeterminate]="true" />
            </div>
          </div>
        </section>

        <!-- Radio Button Examples -->
        <section class="demo-section">
          <h2>Basic Radio Button States</h2>
          <p class="section-description">
            Radio buttons with all states including selected hover, focus, and pressed states as per Figma design.
          </p>
          <div class="checkbox-examples">
            <div class="example-group">
              <h3>Default States</h3>
              <app-radio name="demo1" label="Default radio" value="default" />
              <app-radio name="demo2" label="Selected radio" value="selected" [selected]="true" />
              <app-radio name="demo3" label="Disabled radio" value="disabled" [disabled]="true" />
              <app-radio name="demo4" label="Disabled selected" value="disabled-selected" [selected]="true" [disabled]="true" />
            </div>

            <div class="example-group">
              <h3>Error States</h3>
              <app-radio name="demo5" label="Error radio" value="error" [error]="true" />
              <app-radio name="demo6" label="Error selected" value="error-selected" [selected]="true" [error]="true" />
            </div>

            <div class="example-group">
              <h3>Interactive States Demo</h3>
              <p class="state-demo-note">Hover over these selected radio buttons to see the updated styling:</p>
              <app-radio name="interactive1" label="Selected - hover to see blue border" value="interactive1" [selected]="true" />
              <app-radio name="interactive2" label="Selected - focus with Tab key" value="interactive2" [selected]="true" />
              <app-radio name="interactive3" label="Selected - click to see pressed state" value="interactive3" [selected]="true" />
            </div>
          </div>
        </section>

        <!-- Text Field Examples -->
        <section class="demo-section">
          <h2>Text Field Components</h2>
          <p class="section-description">
            Comprehensive text field components with multiple variants, validation, and interactive features.
          </p>
          
          <div class="text-field-examples">
            <div class="example-group">
              <h3>Basic States</h3>
              <app-text-field
                label="Default text field"
                placeholder="Enter some text"
                helperText="This is helper text"
              />
              <app-text-field
                label="Required field"
                placeholder="This field is required"
                [required]="true"
                [validation]="{ required: true }"
                helperText="Required field with validation"
              />
              <app-text-field
                label="Error state"
                placeholder="This field has an error"
                [error]="true"
                errorMessage="This field has an error"
              />
              <app-text-field
                label="Disabled field"
                placeholder="This field is disabled"
                [disabled]="true"
                value="Disabled value"
                helperText="This field is disabled"
              />
            </div>

            <div class="example-group">
              <h3>Specialized Variants</h3>
              <app-text-field
                variant="email"
                label="Email Address"
                [showHelperIcon]="true"
                prefixIcon="email"
              />
              <app-text-field
                variant="password"
                label="Password"
                [showPasswordToggle]="true"
              />
              <app-text-field
                variant="phone"
                label="Phone Number"
                prefixIcon="phone"
                [showHelperIcon]="true"
                helperText="Format: (555) 123-4567"
              />
              <app-text-field
                variant="search"
                label="Search"
                [clearable]="true"
                [debounceTime]="300"
                prefixIcon="search"
                (valueChange)="onSearchChange($event)"
              />
            </div>

            <div class="example-group">
              <h3>Advanced Features</h3>
              <app-text-field
                label="Character Counter"
                placeholder="Type something..."
                [maxLength]="50"
                [showCharacterCounter]="true"
                helperText="Maximum 50 characters"
              />
              <app-text-field
                label="With Help Icon"
                placeholder="Hover the help icon"
                [showHelpIcon]="true"
                helperText="Click the help icon for more information"
                (helpClick)="onHelpClick()"
              />
              <app-text-field
                variant="currency"
                label="Amount"
                helperText="Enter amount in USD"
              />
              <app-text-field
                variant="url"
                label="Website URL"
                helperText="Must start with http:// or https://"
              />
            </div>
          </div>
        </section>

        <!-- Text Field Form Integration -->
        <section class="demo-section">
          <h2>Text Field Form Integration</h2>
          <form [formGroup]="textFieldForm" class="form-example">
            <div class="form-row">
              <app-text-field
                variant="firstName"
                label="First Name"
                formControlName="firstName"
                [error]="isTextFieldInvalid('firstName')"
                [errorMessage]="getTextFieldError('firstName')"
              />
              <app-text-field
                variant="lastName"
                label="Last Name"
                formControlName="lastName"
                [error]="isTextFieldInvalid('lastName')"
                [errorMessage]="getTextFieldError('lastName')"
              />
            </div>
            
            <app-text-field
              variant="email"
              label="Email Address"
              formControlName="email"
              prefixIcon="email"
              [error]="isTextFieldInvalid('email')"
              [errorMessage]="getTextFieldError('email')"
            />
            
            <app-text-field
              variant="phone"
              label="Phone Number"
              formControlName="phone"
              prefixIcon="phone"
              [error]="isTextFieldInvalid('phone')"
              [errorMessage]="getTextFieldError('phone')"
            />
            
            <app-text-field
              variant="newPassword"
              label="Create Password"
              formControlName="password"
              [showPasswordToggle]="true"
              helperText="Must contain uppercase, lowercase, number, and special character"
              [error]="isTextFieldInvalid('password')"
              [errorMessage]="getTextFieldError('password')"
            />
            
            <div class="form-actions">
              <button 
                type="submit" 
                [disabled]="textFieldForm.invalid"
                class="submit-button"
                (click)="onTextFieldFormSubmit()"
              >
                Submit Text Field Form
              </button>
              <button type="button" class="reset-button" (click)="resetTextFieldForm()">
                Reset
              </button>
            </div>
            
            <div class="form-debug">
              <p>Form Value: {{ textFieldForm.value | json }}</p>
              <p>Form Valid: {{ textFieldForm.valid }}</p>
              <p>Form Errors: {{ getFormErrors() | json }}</p>
            </div>
          </form>
        </section>

        <!-- Text Field States -->
        <section class="demo-section">
          <h2>Text Field States</h2>
          <p class="section-description">
            Text field component with all states as per Figma design specifications.
          </p>
          <div class="text-field-examples">
            <div class="example-group">
              <h3>Default States</h3>
              <app-text-field
                label="Label"
                placeholder="User typed text"
                helperText="Helper text"
              />
              <app-text-field
                label="Label"
                placeholder="User typed text"
                helperText="Helper text"
                value="User typed text"
              />
            </div>

            <div class="example-group">
              <h3>Required & Optional</h3>
              <app-text-field
                label="Required Field"
                placeholder="Enter required information"
                [required]="true"
                helperText="This field is required"
              />
              <app-text-field
                label="Optional Field"
                placeholder="Enter optional information"
                [showOptionalLabel]="true"
                helperText="This field is optional"
              />
            </div>

            <div class="example-group">
              <h3>Error States</h3>
              <app-text-field
                label="Label"
                placeholder="User typed text"
                [error]="true"
                errorMessage="Error text"
              />
              <app-text-field
                label="Label"
                value="User typed text"
                [error]="true"
                errorMessage="Error text"
              />
            </div>

            <div class="example-group">
              <h3>Disabled States</h3>
              <app-text-field
                label="Label"
                placeholder="User typed text"
                helperText="Helper text"
                [disabled]="true"
              />
              <app-text-field
                label="Label"
                value="User typed text"
                helperText="Helper text"
                [disabled]="true"
              />
            </div>

            <div class="example-group">
              <h3>With Help Icon</h3>
              <app-text-field
                label="Field with Help"
                placeholder="Enter information"
                helperText="Click the help icon for more information"
                [showHelpIcon]="true"
                (helpClick)="onHelpClick()"
              />
            </div>

            <div class="example-group">
              <h3>Character Counter</h3>
              <app-text-field
                label="Limited Text"
                placeholder="Type up to 50 characters"
                helperText="Character limit enforced"
                [maxLength]="50"
                [showCharacterCounter]="true"
              />
            </div>
          </div>
        </section>

        <!-- Reactive Forms Integration -->
        <section class="demo-section">
          <h2>Reactive Forms Integration</h2>
          <form [formGroup]="checkboxForm" class="form-example">
            <div class="form-group">
              <app-checkbox
                label="Accept terms and conditions"
                formControlName="termsAccepted"
                [error]="isFieldInvalid('termsAccepted')"
              />
              <div *ngIf="isFieldInvalid('termsAccepted')" class="error-message">
                Please accept the terms and conditions
              </div>
            </div>

            <div class="form-group">
              <app-checkbox
                label="Subscribe to newsletter"
                formControlName="newsletter"
              />
            </div>

            <div class="form-group">
              <app-checkbox
                label="Enable notifications"
                formControlName="notifications"
              />
            </div>

            <div class="form-group">
              <app-text-field
                label="Full Name"
                placeholder="Enter your full name"
                formControlName="fullName"
                [required]="true"
                [error]="isFieldInvalid('fullName')"
                [errorMessage]="getFieldError('fullName')"
                helperText="Enter your first and last name"
              />
            </div>

            <div class="form-group">
              <app-text-field
                label="Email Address"
                placeholder="Enter your email"
                inputType="email"
                formControlName="email"
                [required]="true"
                [error]="isFieldInvalid('email')"
                [errorMessage]="getFieldError('email')"
                helperText="We'll never share your email"
                [validation]="{ email: true }"
              />
            </div>

            <div class="form-group">
              <app-text-field
                label="Phone Number"
                placeholder="(555) 123-4567"
                inputType="tel"
                formControlName="phone"
                [showOptionalLabel]="true"
                helperText="Optional contact number"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Preferred contact method:</label>
              <app-radio-group
                groupId="contactMethod"
                [options]="contactMethodOptions"
                formControlName="contactMethod"
                [errorMessage]="isFieldInvalid('contactMethod') ? 'Please select a contact method' : ''"
                [required]="true"
                layout="horizontal"
              />
              <div *ngIf="isFieldInvalid('contactMethod')" class="error-message">
                Please select a contact method
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                [disabled]="checkboxForm.invalid"
                class="submit-button"
                (click)="onSubmit()"
              >
                Submit
              </button>
              <button type="button" class="reset-button" (click)="resetForm()">
                Reset
              </button>
            </div>
          </form>
        </section>

        <!-- Text Field Validation Demo -->
        <section class="demo-section">
          <h2>Text Field Validation</h2>
          <form [formGroup]="textFieldForm" class="form-example">
            <div class="form-group">
              <app-text-field
                label="Username"
                placeholder="Enter username"
                formControlName="username"
                [required]="true"
                [validation]="{ required: true, minLength: 3, maxLength: 20 }"
                [error]="isTextFieldInvalid('username')"
                [errorMessage]="getTextFieldError('username')"
                helperText="3-20 characters, letters and numbers only"
                [showCharacterCounter]="true"
                [maxLength]="20"
              />
            </div>

            <div class="form-group">
              <app-text-field
                label="Password"
                placeholder="Enter password"
                inputType="password"
                formControlName="password"
                [required]="true"
                [validation]="{ required: true, minLength: 8 }"
                [error]="isTextFieldInvalid('password')"
                [errorMessage]="getTextFieldError('password')"
                helperText="Minimum 8 characters"
              />
            </div>

            <div class="form-group">
              <app-text-field
                label="Website URL"
                placeholder="https://example.com"
                inputType="url"
                formControlName="website"
                [showOptionalLabel]="true"
                [validation]="{ pattern: urlPattern }"
                [error]="isTextFieldInvalid('website')"
                [errorMessage]="getTextFieldError('website')"
                helperText="Enter a valid URL"
              />
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                [disabled]="textFieldForm.invalid"
                class="submit-button"
                (click)="onTextFieldSubmit()"
              >
                Submit Text Form
              </button>
              <button type="button" class="reset-button" (click)="resetTextFieldForm()">
                Reset
              </button>
            </div>

            <div class="form-debug">
              <p>Form Value: {{ textFieldForm.value | json }}</p>
              <p>Form Valid: {{ textFieldForm.valid }}</p>
            </div>
          </form>
        </section>

        <!-- Checkbox Group Example -->
        <section class="demo-section">
          <h2>Checkbox Group</h2>
          <app-checkbox-group
            groupId="skills"
            label="Select your skills:"
            [options]="skillOptions"
            [showSelectAll]="true"
            selectAllLabel="Select all skills"
            [minSelection]="1"
            [maxSelection]="3"
            (selectionChange)="onSkillsChange($event)"
            (validationChange)="onSkillsValidation($event)"
          />
          
          <div class="selection-info">
            <p>Selected skills: {{ selectedSkills.length }}</p>
            <p>Valid selection: {{ isSkillsValid ? 'Yes' : 'No' }}</p>
          </div>
        </section>

        <!-- Radio Group Example -->
        <section class="demo-section">
          <h2>Radio Button Group</h2>
          <p class="section-description">
            Radio button groups with proper state synchronization and form integration.
          </p>
          <app-radio-group
            groupId="experience"
            label="What is your experience level?"
            [options]="experienceOptions"
            [required]="true"
            (selectionChange)="onExperienceChange($event)"
            (validationChange)="onExperienceValidation($event)"
          />
          
          <div class="selection-info">
            <p>Selected experience: {{ selectedExperience || 'None' }}</p>
            <p>Valid selection: {{ isExperienceValid ? 'Yes' : 'No' }}</p>
          </div>

          <app-radio-group
            groupId="layout-demo"
            label="Horizontal Layout Example:"
            [options]="layoutOptions"
            layout="horizontal"
            (selectionChange)="onLayoutChange($event)"
          />
          
          <div class="form-integration-demo">
            <h3>Form Integration Demo</h3>
            <form [formGroup]="radioTestForm" class="form-example">
              <app-radio-group
                groupId="testRadio"
                label="Test Radio Group with Form Control:"
                [options]="testRadioOptions"
                formControlName="testSelection"
                [required]="true"
                [errorMessage]="isRadioFieldInvalid('testSelection') ? 'Please make a selection' : ''"
              />
              
              <div class="form-actions">
                <button 
                  type="button" 
                  class="submit-button"
                  [disabled]="radioTestForm.invalid"
                  (click)="onRadioFormSubmit()"
                >
                  Submit Radio Form
                </button>
                <button type="button" class="reset-button" (click)="resetRadioForm()">
                  Reset
                </button>
              </div>
              
              <div class="form-debug">
                <p>Form Value: {{ radioTestForm.value | json }}</p>
                <p>Form Valid: {{ radioTestForm.valid }}</p>
              </div>
            </form>
          </div>
        </section>

        <!-- Tab Order Demo -->
        <section class="demo-section">
          <h2>Tab Order & Keyboard Navigation</h2>
          <div class="tab-demo">
            <p>Use Tab key to navigate through checkboxes and Space/Enter to toggle them:</p>
            <app-checkbox label="Question number 1 - Option 1" [tabIndex]="1" />
            <app-checkbox label="Question number 1 - Option 2" [tabIndex]="2" />
            <app-checkbox label="Question number 1 - Option 3" [tabIndex]="3" />
            <app-checkbox label="Question number 2 - Option 1" [tabIndex]="4" />
            <app-checkbox label="Question number 2 - Option 2" [tabIndex]="5" />
            
            <p>Radio button group with tab order:</p>
            <app-radio-group
              groupId="tab-demo"
              label="Tab Navigation Test:"
              [options]="tabDemoOptions"
              (selectionChange)="onTabDemoChange($event)"
            />
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'PT Sans', sans-serif;
    }

    .app-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .app-header h1 {
      color: #0A0A0A;
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    .app-header p {
      color: #918F8F;
      font-size: 1.1rem;
    }

    .demo-section {
      margin-bottom: 40px;
      padding: 20px;
      border: 1px solid #EEEEEE;
      border-radius: 8px;
    }

    .demo-section h2 {
      color: #0A0A0A;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .checkbox-examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .example-group h3 {
      color: #0A0A0A;
      margin-bottom: 12px;
      font-size: 1.1rem;
    }

    .example-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-example {
      max-width: 500px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #0A0A0A;
    }

    .radio-group-inline {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .error-message {
      color: #960000;
      font-size: 14px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .submit-button, .reset-button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .submit-button {
      background-color: #1A70B3;
      color: white;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #0f5a94;
    }

    .submit-button:disabled {
      background-color: #EEEEEE;
      color: #918F8F;
      cursor: not-allowed;
    }

    .reset-button {
      background-color: #EEEEEE;
      color: #0A0A0A;
    }

    .reset-button:hover {
      background-color: #ddd;
    }

    .selection-info {
      margin-top: 16px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .selection-info p {
      margin: 4px 0;
      color: #0A0A0A;
    }

    .section-description {
      color: #6C6C6C;
      font-size: 14px;
      margin-bottom: 16px;
      font-style: italic;
    }

    .state-demo-note {
      color: #1A70B3;
      font-size: 13px;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .tab-demo {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tab-demo p {
      margin-bottom: 16px;
      color: #0A0A0A;
    }

    .form-integration-demo {
      margin-top: 24px;
      padding: 16px;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      background-color: #f8f9fa;
    }

    .form-integration-demo h3 {
      margin-bottom: 16px;
      color: #0A0A0A;
    }

    .form-debug {
      margin-top: 16px;
      padding: 12px;
      background-color: #fff;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }

    .form-debug p {
      margin: 4px 0;
    }

    .text-field-examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .app-container {
        padding: 10px;
      }

      .checkbox-examples {
        grid-template-columns: 1fr;
      }

      .text-field-examples {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
      
      .text-field-examples {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class App {
  checkboxForm: FormGroup;
  radioTestForm: FormGroup;
  textFieldForm: FormGroup;
  
  skillOptions: CheckboxOption[] = [
    { id: 'javascript', label: 'JavaScript', value: 'javascript' },
    { id: 'typescript', label: 'TypeScript', value: 'typescript' },
    { id: 'angular', label: 'Angular', value: 'angular' },
    { id: 'react', label: 'React', value: 'react' },
    { id: 'vue', label: 'Vue.js', value: 'vue' }
  ];

  selectedSkills: CheckboxOption[] = [];
  isSkillsValid: boolean = false;

  contactMethodOptions: RadioOption[] = [
    { id: 'email', label: 'Email', value: 'email' },
    { id: 'phone', label: 'Phone', value: 'phone' },
    { id: 'sms', label: 'SMS', value: 'sms' }
  ];

  experienceOptions: RadioOption[] = [
    { id: 'beginner', label: 'Beginner (0-1 years)', value: 'beginner' },
    { id: 'intermediate', label: 'Intermediate (2-5 years)', value: 'intermediate' },
    { id: 'advanced', label: 'Advanced (5+ years)', value: 'advanced' },
    { id: 'expert', label: 'Expert (10+ years)', value: 'expert' }
  ];

  layoutOptions: RadioOption[] = [
    { id: 'option1', label: 'Option 1', value: 'option1' },
    { id: 'option2', label: 'Option 2', value: 'option2' },
    { id: 'option3', label: 'Option 3', value: 'option3' }
  ];

  testRadioOptions: RadioOption[] = [
    { id: 'test1', label: 'Test Option 1', value: 'test1' },
    { id: 'test2', label: 'Test Option 2', value: 'test2' },
    { id: 'test3', label: 'Test Option 3', value: 'test3' }
  ];

  tabDemoOptions: RadioOption[] = [
    { id: 'tab1', label: 'Tab Option 1', value: 'tab1' },
    { id: 'tab2', label: 'Tab Option 2', value: 'tab2' },
    { id: 'tab3', label: 'Tab Option 3', value: 'tab3' }
  ];

  selectedExperience: any = null;
  isExperienceValid: boolean = false;
  
  // URL pattern for validation
  urlPattern = /^https?:\/\/.+\..+/;
  
  constructor(private fb: FormBuilder) {
    this.checkboxForm = this.fb.group({
      termsAccepted: [false, Validators.requiredTrue],
      newsletter: [false],
      notifications: [true],
      contactMethod: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.radioTestForm = this.fb.group({
      testSelection: ['', Validators.required]
    });

    this.textFieldForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      website: ['', Validators.pattern(this.urlPattern)]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkboxForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isRadioFieldInvalid(fieldName: string): boolean {
    const field = this.radioTestForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isTextFieldInvalid(fieldName: string): boolean {
    const field = this.textFieldForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getTextFieldError(fieldName: string): string {
    const field = this.textFieldForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid phone number';
        if (fieldName === 'password') return 'Password must contain uppercase, lowercase, number, and special character';
        return 'Please enter a valid format';
      }
    }
    return '';
  }

  getFieldError(fieldName: string): string {
    const field = this.checkboxForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  onSubmit(): void {
    if (this.checkboxForm.valid) {
      console.log('Form submitted:', this.checkboxForm.value);
      alert('Form submitted successfully!');
    } else {
      console.log('Form is invalid');
      this.checkboxForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.checkboxForm.reset();
  }

  onRadioFormSubmit(): void {
    if (this.radioTestForm.valid) {
      console.log('Radio form submitted:', this.radioTestForm.value);
      alert('Radio form submitted successfully!');
    } else {
      console.log('Radio form is invalid');
      this.radioTestForm.markAllAsTouched();
    }
  }

  resetRadioForm(): void {
    this.radioTestForm.reset();
  }

  onTextFieldFormSubmit(): void {
    if (this.textFieldForm.valid) {
      console.log('Text field form submitted:', this.textFieldForm.value);
      alert('Text field form submitted successfully!');
    } else {
      console.log('Text field form is invalid');
      this.textFieldForm.markAllAsTouched();
    }
  }

  resetTextFieldForm(): void {
    this.textFieldForm.reset();
  }

  onTextFieldSubmit(): void {
    if (this.textFieldForm.valid) {
      console.log('Text field form submitted:', this.textFieldForm.value);
      alert('Text field form submitted successfully!');
    } else {
      console.log('Text field form is invalid');
      this.textFieldForm.markAllAsTouched();
    }
  }

  onSkillsChange(selectedOptions: CheckboxOption[]): void {
    this.selectedSkills = selectedOptions;
    console.log('Selected skills:', selectedOptions);
  }

  onSkillsValidation(isValid: boolean): void {
    this.isSkillsValid = isValid;
    console.log('Skills validation:', isValid);
  }

  onExperienceChange(selectedValue: any): void {
    this.selectedExperience = selectedValue;
    console.log('Selected experience:', selectedValue);
  }

  onExperienceValidation(isValid: boolean): void {
    this.isExperienceValid = isValid;
    console.log('Experience validation:', isValid);
  }

  onLayoutChange(selectedValue: any): void {
    console.log('Layout selection:', selectedValue);
  }

  onTabDemoChange(selectedValue: any): void {
    console.log('Tab demo selection:', selectedValue);
  }

  onSearchChange(searchValue: string): void {
    console.log('Search value:', searchValue);
  }

  onHelpClick(): void {
    alert('This is help information for the text field!');
  }

  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.textFieldForm.controls).forEach(key => {
      const control = this.textFieldForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}

bootstrapApplication(App);
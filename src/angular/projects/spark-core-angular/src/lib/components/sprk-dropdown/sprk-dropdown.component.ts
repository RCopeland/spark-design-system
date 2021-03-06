import {
  Component,
  Input,
  Output,
  ElementRef,
  HostListener,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'sprk-dropdown',
  template: `
    <div
      [ngClass]="{
        'sprk-c-MastheadMask': isOpen && dropdownType === 'mastheadSelector'
      }"
    >
      <div [ngClass]="{ 'sprk-o-Box': dropdownType === 'mastheadSelector' }">
        <a
          [ngClass]="getTriggerClasses()"
          aria-haspopup="true"
          href="#nogo"
          (click)="toggle($event)"
          [attr.data-id]="idString"
          [attr.data-analytics]="analyticsString"
          role="combobox"
        >
          <span [ngClass]="getTriggerTextClasses()">{{ triggerText }}</span>
          <span class="sprk-u-ScreenReaderText">{{ screenReaderText }}</span>
          <sprk-icon
            [iconType]="triggerIconType"
            additionalClasses="sprk-u-mls sprk-c-Icon--stroke-current-color {{ additionalIconClasses }}"
          ></sprk-icon>
        </a>
      </div>

      <div [ngClass]="getClasses()" *ngIf="isOpen">
        <div
          class="sprk-c-Dropdown__header"
          *ngIf="dropdownType === 'mastheadSelector' || title || selector"
        >
          <h2 class="sprk-c-Dropdown__title sprk-b-TypeBodyTwo" *ngIf="title">
            {{ title }}
          </h2>

          <a
            *ngIf="selector && !title"
            class="sprk-b-Link sprk-b-Link--plain sprk-o-Stack sprk-o-Stack--split@xxs sprk-o-Stack--center-column sprk-u-Width-100"
            href="#nogo"
            aria-haspopup="true"
            (click)="toggle($event)"
          >
            <span
              class="sprk-c-Dropdown__title sprk-b-TypeBodyTwo sprk-o-Stack__item sprk-o-Stack__item--flex@xxs"
              >{{ selector }}</span
            >
            <sprk-icon
              [iconType]="triggerIconType"
              additionalClasses="sprk-c-Icon--stroke-current-color sprk-u-mls sprk-c-Icon--toggle sprk-Stack__item {{ additionalIconClasses }}"
            ></sprk-icon>
          </a>
        </div>

        <ul class="sprk-c-Dropdown__links">
          <li
            class="sprk-c-Dropdown__item"
            *ngFor="let choice of choices; let i = index"
            [attr.data-sprk-dropdown-choice-index]="i"
            (click)="choiceClick($event)"
          >
            <div *ngIf="choice.content; then: content; else: link"></div>
            <ng-template #link>
              <a
                [routerLink]="choice.href"
                [attr.data-sprk-dropdown-value]="choice.value"
                [attr.href]="choice.href || '#nogo'"
                [ngClass]="{
                  'sprk-c-Dropdown__link': true,
                  'sprk-c-Dropdown__link--active': choice.active
                }"
                role="option"
                >{{ choice.text }}
              </a>
            </ng-template>
            <ng-template #content>
              <a
                [attr.data-sprk-dropdown-value]="choice.value"
                href="#nogo"
                [ngClass]="{
                  'sprk-c-Dropdown__link': true,
                  'sprk-c-Dropdown__link--active': choice.active
                }"
                role="option"
              >
                <p class="sprk-b-TypeBodyOne">{{ choice.content.title }}</p>
                <p>{{ choice.content.infoLine1 }}</p>
                <p>{{ choice.content.infoLine2 }}</p>
              </a>
            </ng-template>
          </li>
        </ul>
        <ng-content select="[sprkDropdownFooter]"></ng-content>
      </div>
    </div>
  `
})
export class SparkDropdownComponent {
  @Input()
  dropdownType = 'base';
  @Input()
  additionalClasses: string;
  @Input()
  additionalIconClasses: string;
  @Input()
  additionalTriggerClasses: string;
  @Input()
  additionalTriggerTextClasses: string;
  @Input()
  idString: string;
  @Input()
  analyticsString: string;
  @Input()
  isOpen = false;
  @Input()
  title: string;
  @Input()
  selector: string;
  @Input()
  choices: any[];
  @Input()
  triggerIconType: string;
  @Input()
  triggerText: string;
  @Input()
  screenReaderText: string;
  @Output()
  choiceMade: EventEmitter<string> = new EventEmitter();

  constructor(public ref: ElementRef) {}

  toggle(event): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event): void {
    if (
      !this.ref.nativeElement.contains(event.target) ||
      event.target.classList.contains('sprk-c-MastheadMask')
    ) {
      this.hideDropdown();
    }
  }

  @HostListener('document:focusin', ['$event'])
  onFocusin(event): void {
    /* istanbul ignore else: angular focus event isnt setting e.target */
    if (
      !this.ref.nativeElement.contains(event.target) ||
      event.target.classList.contains('sprk-c-MastheadMask')
    ) {
      this.hideDropdown();
    }
  }

  choiceClick(event) {
    event.preventDefault();
    this.clearActiveChoices();
    const choiceIndex = event.currentTarget.getAttribute(
      'data-sprk-dropdown-choice-index'
    );
    const clickedChoice = this.choices[choiceIndex];
    if (
      this.dropdownType === 'informational' ||
      this.dropdownType === 'mastheadSelector'
    ) {
      this.setActiveChoice(event);
      this.updateTriggerText(event);
    }
    this.hideDropdown();
    this.choiceMade.emit(clickedChoice['value']);
  }

  setActiveChoice(event): void {
    const choiceIndex = event.currentTarget.getAttribute(
      'data-sprk-dropdown-choice-index'
    );
    this.choices[choiceIndex]['active'] = true;
  }

  updateTriggerText(event): void {
    const choiceIndex = event.currentTarget.getAttribute(
      'data-sprk-dropdown-choice-index'
    );
    this.triggerText = this.choices[choiceIndex]['value'];
  }

  clearActiveChoices(): void {
    this.choices.forEach((choice: object) => {
      choice['active'] = false;
    });
  }

  hideDropdown(): void {
    this.isOpen = false;
  }

  getClasses(): string {
    const classArray: string[] = ['sprk-c-Dropdown'];

    if (this.additionalClasses) {
      this.additionalClasses.split(' ').forEach(className => {
        classArray.push(className);
      });
    }

    return classArray.join(' ');
  }

  getTriggerClasses(): string {
    const classArray: string[] = ['sprk-b-Link'];

    if (this.additionalTriggerClasses) {
      this.additionalTriggerClasses.split(' ').forEach(className => {
        classArray.push(className);
      });
    }

    return classArray.join(' ');
  }

  getTriggerTextClasses(): string {
    const classArray: string[] = [''];

    if (this.additionalTriggerTextClasses) {
      this.additionalTriggerTextClasses.split(' ').forEach(className => {
        classArray.push(className);
      });
    }

    return classArray.join(' ');
  }
}

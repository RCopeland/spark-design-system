import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SprkDictionaryComponent } from './sprk-dictionary.component';

describe('SprkAngularDictionaryComponent', () => {
  let component: SprkDictionaryComponent;
  let fixture: ComponentFixture<SprkDictionaryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SprkDictionaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprkDictionaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('div');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add data-id when idString has a value', () => {
    const testString = 'element-id';
    component.idString = testString;
    fixture.detectChanges();
    expect(element.getAttribute('data-id')).toEqual(testString);
  });

  it('should not add data-id when idString has no value', () => {
    component.idString = null;
    fixture.detectChanges();
    expect(element.getAttribute('data-id')).toBeNull();
  });

  it('should add additionalClasses', () => {
    component.additionalClasses = 'spark design';
    fixture.detectChanges();
    expect(element.classList.toString()).toContain('spark');
    expect(element.classList.toString()).toContain('design');
  });

  it('should add additionalKeysClasses', () => {
    component.additionalKeysClasses = 'keysClass';
    component.keyValuePairs = { key: 'value', key2: 'value2' };
    fixture.detectChanges();

    let keys = element.getElementsByClassName('sprk-c-Dictionary__key');

    Array.prototype.forEach.call(keys, (key) => {
      expect(key.classList.toString()).toContain('keysClass');
    });
  });

  it('should add additionalValuesClasses', () => {
    component.additionalValuesClasses = 'valuesClass';
    component.keyValuePairs = { key: 'value', key2: 'value2' };
    fixture.detectChanges();

    let values = element.getElementsByClassName('sprk-c-Dictionary__value');

    Array.prototype.forEach.call(values, (value) => {
      expect(value.classList.toString()).toContain('valuesClass');
    });
  });

  it('should correctly add striped class with deprecated Input', () => {
    component.dictionaryType = 'striped';
    fixture.detectChanges();

    expect(element.classList.toString()).toContain(
      'sprk-c-Dictionary--striped',
    );
  });
});

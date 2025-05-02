import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionTypeFormComponent } from './edition-type-form.component';

describe('EditionTypeFormComponent', () => {
  let component: EditionTypeFormComponent;
  let fixture: ComponentFixture<EditionTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

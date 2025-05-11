import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionTypeSearchComponent } from './edition-type-search.component';

describe('EditionTypeSearchComponent', () => {
  let component: EditionTypeSearchComponent;
  let fixture: ComponentFixture<EditionTypeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionTypeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionTypeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

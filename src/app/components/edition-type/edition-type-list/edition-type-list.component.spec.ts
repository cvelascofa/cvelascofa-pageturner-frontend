import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionTypeListComponent } from './edition-type-list.component';

describe('EditionTypeListComponent', () => {
  let component: EditionTypeListComponent;
  let fixture: ComponentFixture<EditionTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

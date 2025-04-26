import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageUpdateComponent } from './language-update.component';

describe('LanguageUpdateComponent', () => {
  let component: LanguageUpdateComponent;
  let fixture: ComponentFixture<LanguageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

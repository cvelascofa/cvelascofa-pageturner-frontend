import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSearchComponent } from './language-search.component';

describe('LanguageSearchComponent', () => {
  let component: LanguageSearchComponent;
  let fixture: ComponentFixture<LanguageSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

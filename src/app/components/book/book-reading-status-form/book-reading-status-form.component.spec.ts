import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReadingStatusFormComponent } from './book-reading-status-form.component';

describe('BookReadingStatusFormComponent', () => {
  let component: BookReadingStatusFormComponent;
  let fixture: ComponentFixture<BookReadingStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReadingStatusFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookReadingStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

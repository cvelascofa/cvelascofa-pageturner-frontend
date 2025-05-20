import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReviewFormComponent } from './book-review-form.component';

describe('BookReviewFormComponent', () => {
  let component: BookReviewFormComponent;
  let fixture: ComponentFixture<BookReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

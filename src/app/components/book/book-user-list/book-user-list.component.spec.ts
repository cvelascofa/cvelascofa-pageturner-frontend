import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookUserListComponent } from './book-user-list.component';

describe('BookUserListComponent', () => {
  let component: BookUserListComponent;
  let fixture: ComponentFixture<BookUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookUserListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

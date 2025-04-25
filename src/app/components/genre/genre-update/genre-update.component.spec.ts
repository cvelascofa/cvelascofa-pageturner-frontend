import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreUpdateComponent } from './genre-update.component';

describe('GenreUpdateComponent', () => {
  let component: GenreUpdateComponent;
  let fixture: ComponentFixture<GenreUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

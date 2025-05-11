import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserSearchComponent } from './admin-user-search.component';

describe('AdminUserSearchComponent', () => {
  let component: AdminUserSearchComponent;
  let fixture: ComponentFixture<AdminUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

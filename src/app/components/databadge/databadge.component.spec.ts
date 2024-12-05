import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabadgeComponent } from './databadge.component';

describe('DatabadgeComponent', () => {
  let component: DatabadgeComponent;
  let fixture: ComponentFixture<DatabadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatabadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

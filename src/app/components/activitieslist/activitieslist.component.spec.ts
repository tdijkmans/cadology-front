import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitieslistComponent } from './activitieslist.component';

describe('ActivitieslistComponent', () => {
  let component: ActivitieslistComponent;
  let fixture: ComponentFixture<ActivitieslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitieslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

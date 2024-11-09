import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedchartComponent } from './speedchart.component';

describe('SpeedchartComponent', () => {
  let component: SpeedchartComponent;
  let fixture: ComponentFixture<SpeedchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

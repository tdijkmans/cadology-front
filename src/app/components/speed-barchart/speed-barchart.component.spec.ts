import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedBarchartComponent } from './speed-barchart.component';

describe('SpeedBarchartComponent', () => {
  let component: SpeedBarchartComponent;
  let fixture: ComponentFixture<SpeedBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedBarchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

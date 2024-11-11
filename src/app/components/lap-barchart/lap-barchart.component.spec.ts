import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapBarchartComponent } from './lap-barchart.component';

describe('LapBarchartComponent', () => {
  let component: LapBarchartComponent;
  let fixture: ComponentFixture<LapBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LapBarchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LapBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

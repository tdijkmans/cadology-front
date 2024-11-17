import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistchartComponent } from './distchart.component';

describe('DistchartComponent', () => {
  let component: DistchartComponent;
  let fixture: ComponentFixture<DistchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngleGaugeComponent } from './angle-gauge.component';

describe('AngleGaugeComponent', () => {
  let component: AngleGaugeComponent;
  let fixture: ComponentFixture<AngleGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngleGaugeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngleGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

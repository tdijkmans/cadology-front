import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartnavigationComponent } from './chartnavigation.component';

describe('ChartnavigationComponent', () => {
  let component: ChartnavigationComponent;
  let fixture: ComponentFixture<ChartnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartnavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

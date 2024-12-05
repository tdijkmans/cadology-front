import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartcontainerComponent } from './chartcontainer.component';

describe('ChartcontainerComponent', () => {
  let component: ChartcontainerComponent;
  let fixture: ComponentFixture<ChartcontainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartcontainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

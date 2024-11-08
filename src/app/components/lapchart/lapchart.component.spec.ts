import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapchartsComponent } from './lapchart.component';

describe('LapchartsComponent', () => {
  let component: LapchartsComponent;
  let fixture: ComponentFixture<LapchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LapchartsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LapchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

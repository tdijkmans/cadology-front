import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistchartSeasonComponent } from './distchart-season.component';

describe('DistchartSeasonComponent', () => {
  let component: DistchartSeasonComponent;
  let fixture: ComponentFixture<DistchartSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistchartSeasonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DistchartSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

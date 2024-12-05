import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistochartComponent } from './histochart.component';

describe('HistochartComponent', () => {
  let component: HistochartComponent;
  let fixture: ComponentFixture<HistochartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistochartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistochartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

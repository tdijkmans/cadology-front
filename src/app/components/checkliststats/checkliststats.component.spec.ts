import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckliststatsComponent } from './checkliststats.component';

describe('CheckliststatsComponent', () => {
  let component: CheckliststatsComponent;
  let fixture: ComponentFixture<CheckliststatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckliststatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckliststatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

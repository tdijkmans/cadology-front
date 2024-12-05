import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartheaderComponent } from './chartheader.component';

describe('ChartheaderComponent', () => {
  let component: ChartheaderComponent;
  let fixture: ComponentFixture<ChartheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartheaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSelectionComponent } from './log-selection.component';

describe('LogSelectionComponent', () => {
  let component: LogSelectionComponent;
  let fixture: ComponentFixture<LogSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

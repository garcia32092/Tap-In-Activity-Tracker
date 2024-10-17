import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSmallwinsComponent } from './log-smallwins.component';

describe('LogSmallwinsComponent', () => {
  let component: LogSmallwinsComponent;
  let fixture: ComponentFixture<LogSmallwinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogSmallwinsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogSmallwinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

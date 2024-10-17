import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogJournalComponent } from './log-journal.component';

describe('LogJournalComponent', () => {
  let component: LogJournalComponent;
  let fixture: ComponentFixture<LogJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogJournalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

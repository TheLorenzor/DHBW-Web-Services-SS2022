import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDetailScreenComponent } from './match-detail-screen.component';

describe('MatchDetailScreenComponent', () => {
  let component: MatchDetailScreenComponent;
  let fixture: ComponentFixture<MatchDetailScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchDetailScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchDetailScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

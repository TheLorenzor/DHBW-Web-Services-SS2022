import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangePurseComponent } from './exchange-purse.component';

describe('ExchangePurseComponent', () => {
  let component: ExchangePurseComponent;
  let fixture: ComponentFixture<ExchangePurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangePurseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangePurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinMarketComponent } from './coin-market.component';

describe('CoinMarketComponent', () => {
  let component: CoinMarketComponent;
  let fixture: ComponentFixture<CoinMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinMarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

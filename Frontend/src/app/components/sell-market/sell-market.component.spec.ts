import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellMarketComponent } from './sell-market.component';

describe('SellMarketComponent', () => {
  let component: SellMarketComponent;
  let fixture: ComponentFixture<SellMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellMarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

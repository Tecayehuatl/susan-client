import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderQuoteComponent } from './create-order-quote.component';

describe('CreateOrderQuoteComponent', () => {
  let component: CreateOrderQuoteComponent;
  let fixture: ComponentFixture<CreateOrderQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrderQuoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrderQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

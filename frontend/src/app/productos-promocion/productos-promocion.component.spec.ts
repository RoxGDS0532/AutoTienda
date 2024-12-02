import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPromocionComponent } from './productos-promocion.component';

describe('ProductosPromocionComponent', () => {
  let component: ProductosPromocionComponent;
  let fixture: ComponentFixture<ProductosPromocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosPromocionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosPromocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

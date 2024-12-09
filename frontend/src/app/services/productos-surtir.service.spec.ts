import { TestBed } from '@angular/core/testing';

import { ProductosSurtirService } from './productos-surtir.service';

describe('ProductosSurtirService', () => {
  let service: ProductosSurtirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductosSurtirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

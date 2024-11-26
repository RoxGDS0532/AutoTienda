import { TestBed } from '@angular/core/testing';

import { ProductosRecomendadosService } from './productos-recomendados.service';

describe('ProductosRecomendadosService', () => {
  let service: ProductosRecomendadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductosRecomendadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

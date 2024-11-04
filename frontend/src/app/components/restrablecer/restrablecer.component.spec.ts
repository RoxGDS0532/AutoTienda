import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrablecerComponent } from './restrablecer.component';

describe('RestrablecerComponent', () => {
  let component: RestrablecerComponent;
  let fixture: ComponentFixture<RestrablecerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestrablecerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrablecerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

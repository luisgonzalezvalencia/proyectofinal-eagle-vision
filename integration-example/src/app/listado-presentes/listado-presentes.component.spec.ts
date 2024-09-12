import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPresentesComponent } from './listado-presentes.component';

describe('ListadoPresentesComponent', () => {
  let component: ListadoPresentesComponent;
  let fixture: ComponentFixture<ListadoPresentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPresentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPresentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarCliente } from './cadastrar-cliente';

describe('CadastrarCliente', () => {
  let component: CadastrarCliente;
  let fixture: ComponentFixture<CadastrarCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

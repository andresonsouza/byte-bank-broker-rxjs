import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { AcoesService } from './acoes.service';

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {

  acoesInput = new FormControl();

  todasAcoes$ = this.acoesService.getAcoes()
    .pipe(
      tap(() => console.log('fluxo inicial'))
    );

  filtroPeloInput$ = this.acoesInput.valueChanges
    .pipe(
      tap(() => console.log('fluxo do filtro')),
      tap(console.log),
      filter(
        (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
      ),
      switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)),
      tap(console.log)
    );

  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) { }

}


import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { AcoesService } from './acoes.service';

const ESPERA_DIGITACAO = 300;

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
      debounceTime(ESPERA_DIGITACAO),
      tap(() => console.log('fluxo do filtro')),
      tap(console.log),
      filter(
        (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
      ),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)),
      tap(console.log)
    );

  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) { }

}


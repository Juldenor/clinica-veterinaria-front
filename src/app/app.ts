import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // A importação do router-outlet vai aqui!
  templateUrl: './app.html', // Apontando pro arquivo certo
  styleUrl: './app.css' // (ou .scss se você escolheu sass na criação)
})
export class App { // <-- O segredo do erro estava aqui! O nome da classe é só App
  title = 'clinica-vet-front';
}
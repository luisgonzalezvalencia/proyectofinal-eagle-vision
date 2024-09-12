import { Component, OnInit } from '@angular/core';
import { CheckService } from '../services/check.service';

@Component({
  selector: 'app-listado-presentes',
  standalone: true,
  imports: [],
  templateUrl: './listado-presentes.component.html',
  styleUrl: './listado-presentes.component.scss',
  providers: [
    CheckService
  ]
})
export class ListadoPresentesComponent implements OnInit {
  public listadoAlumnos: string[] = ["test", "test2"]

  constructor(private checkService: CheckService) {

  }

  ngOnInit(): void {
    this.loadListadoAlumnos();
  }

  loadListadoAlumnos() {
    this.checkService.getListadoAlumnos().subscribe({
      next: (response: object) => {
        console.log('Response:', response);
        this.listadoAlumnos = response as string[];
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}

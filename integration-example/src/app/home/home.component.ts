import { Component } from '@angular/core';
import { CameraPhotoComponent } from "../camera-photo/camera-photo.component";
import { ListadoPresentesComponent } from "../listado-presentes/listado-presentes.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CameraPhotoComponent, ListadoPresentesComponent]
})
export class HomeComponent {

}

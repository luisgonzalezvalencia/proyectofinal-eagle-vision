import { Component } from '@angular/core';
import { CameraPhotoComponent } from "../camera-photo/camera-photo.component";
import { ListadoPresentesComponent } from "../listado-presentes/listado-presentes.component";
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CameraPhotoComponent, ListadoPresentesComponent],
    providers: [AuthenticationService]
})
export class HomeComponent {

    constructor(private authService: AuthenticationService, private router: Router) { }

    logout() {
        this.authService.logOut().then(() => {
            this.router.navigate(['/login']);
        }).catch((error) => {
            console.log(error);
        });
    }

}

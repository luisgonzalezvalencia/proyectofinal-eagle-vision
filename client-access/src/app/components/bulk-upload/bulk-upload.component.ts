import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { delay, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  templateUrl: './bulk-upload.component.html',
  imports: [NgIf],
  providers: [],
})
export class BulkUploadComponent {
  fileName: string = '';
  uploading: boolean = false;
  uploadMessage: string = '';

  constructor(private authService: AuthService) {}

  // Evento que se dispara al seleccionar un archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.name.endsWith('.zip')) {
        alert('Solo se permiten archivos .zip');
        return;
      }

      this.fileName = file.name;

      // Envía automáticamente el archivo
      this.uploadFile(file);
    }
  }

  // Envía el archivo al servidor
  uploadFile(file: File): void {
    this.authService.currentClient$
      .pipe(
        switchMap((client) => {
          // const formData = new FormData();
          // formData.append('file', file);
          // formData.append('clientId', client?.clientId  ?? '');

          return of({ status: 'ok', message: 'Archivo subido correctamente' });
        }),
        delay(2000)
      )
      .subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.uploadMessage = response.message;
          this.uploading = false;
          this.fileName = '';
        },
        error: (err) => {
          console.error('Error al subir el archivo:', err);
          alert('Error al subir el archivo. Inténtalo de nuevo.');
        },
      });
  }
}

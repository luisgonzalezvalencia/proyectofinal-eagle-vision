import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CheckService } from '../../services/check.service';
import { HttpRequestService } from '../../services/http-request.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss',
  imports: [NgIf, HttpClientModule],
  providers: [CheckService, HttpRequestService],
})
export class BulkUploadComponent {
  fileName: string = '';
  uploading: boolean = false;

  constructor(
    private authService: AuthService,
    private checkService: CheckService,
    private toastService: ToastService
  ) {}

  // Evento que se dispara al seleccionar un archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.name.endsWith('.zip')) {
        this.toastService.error('Solo se permiten archivos .zip');
        return;
      }

      this.fileName = file.name;

      // Envía automáticamente el archivo
      this.uploadFile(file);
    }
  }

  // Envía el archivo al servidor
  uploadFile(file: File): void {
    this.uploading = true;
    this.authService.currentClient$
      .pipe(
        take(1),
        switchMap((client) => {
          const formData = new FormData();
          formData.append('zip_file', file);
          formData.append('client_id', client?.clientId?.toString() ?? '');

          return this.checkService.uploadZip(formData);
        })
      )
      .subscribe({
        next: (response) => {
          if (!response.error) {
            this.toastService.success(
              response.message ?? 'Archivo subido correctamente'
            );
          } else {
            this.toastService.error(response.error);
          }

          this.fileName = '';
        },
        error: (err) => {
          this.toastService.error('Error al subir el archivo.');
        },
        complete: () => {
          this.uploading = false;
        },
      });
  }
}

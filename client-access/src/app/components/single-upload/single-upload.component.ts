import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { switchMap, take } from 'rxjs';
import { CheckService } from '../../services/check.service';
import { ClientService } from '../../services/client.service';
import { HttpRequestService } from '../../services/http-request.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-single-upload',
  standalone: true,
  templateUrl: './single-upload.component.html',
  imports: [NgIf, HttpClientModule, ReactiveFormsModule],
  providers: [CheckService, HttpRequestService],
})
export class SingleUploadComponent {
  uploadForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
  });
  file: File | null = null;
  fileName: string = '';
  uploading: boolean = false;

  constructor(
    private clientService: ClientService,
    private toastService: ToastService,
    private checkService: CheckService
  ) {}

  // Evento que se dispara al seleccionar un archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];

      // Validar el tipo de archivo
      if (!selectedFile.name.match(/\.(jpg|jpeg|png)$/)) {
        this.toastService.error(
          'Solo se permiten archivos en formato .jpg, .jpeg o .png'
        );
        return;
      }

      this.file = selectedFile;
      this.fileName = selectedFile.name;
    }
  }

  // Envía el archivo al servidor
  onSubmit(): void {
    if (this.uploadForm.invalid || !this.file) {
      return;
    }

    const userId = this.uploadForm.value.userId;
    this.uploading = true;

    this.clientService.currentClient$
      .pipe(
        take(1),
        switchMap((client) => {
          const formData = new FormData();
          formData.append('image', this.file as File);
          formData.append('user_id', userId);
          formData.append('client_id', String(client?.clientId));

          return this.checkService.uploadImage(formData);
        })
      )
      .subscribe({
        next: (response) => {
          this.toastService.success(
            response.message ?? response.error ?? 'Ocurrio un Error'
          );
          this.resetForm();
        },
        error: (error) => {
          this.toastService.error('Error al subir el archivo.');
          console.error('Error al subir el archivo:', error);
        },
        complete: () => {
          this.uploading = false;
        },
      });
  }

  private resetForm(): void {
    this.uploadForm.reset();
    this.file = null;
    this.fileName = '';
  }
}

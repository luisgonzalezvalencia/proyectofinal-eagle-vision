import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { delay, of, switchMap, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-single-upload',
  standalone: true,
  templateUrl: './single-upload.component.html',
  imports: [NgIf, ReactiveFormsModule],
  providers: [],
})
export class SingleUploadComponent {
  uploadForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
  });
  file: File | null = null;
  fileName: string = '';
  uploading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
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

    this.authService.currentClient$
      .pipe(
        delay(2000), // TODO: Eliminar despues de implementar la api
        take(1),
        switchMap((client) => {
          const formData = new FormData();
          formData.append('file', this.file as File);
          formData.append('userId', userId);
          formData.append('clientId', String(client?.clientId));

          return of({ status: 'ok', message: 'Archivo subido correctamente' });
        })
      )
      .subscribe({
        next: (response) => {
          this.toastService.success(
            response.message ?? 'Archivo subido correctamente'
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

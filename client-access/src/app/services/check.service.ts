
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from './error-messages.es';

export interface UploadZipResponse {
  message?: string
  error?: string
}

@Injectable({ providedIn: 'root' })
export class CheckService {

  constructor(private http: HttpClient) { }

  postData(formData: FormData): Observable<Blob> {
    return this.http.post('http://127.0.0.1:8000/check', formData, { responseType: 'blob' });
  }

  getListadoAlumnos(): Observable<object> {
    return this.http.get('http://127.0.0.1:8000/get_presentes_del_dia', { responseType: 'json' });
  }

  getErrorMessage(error: any): string {
    const errorKey = Object.keys(error)[0];
    const errorMessage = ERROR_MESSAGES[errorKey as keyof typeof ERROR_MESSAGES];
    return errorMessage.replace('{{requiredLength}}', error[errorKey].requiredLength);
  }

  uploadZip(formData: FormData): Observable<UploadZipResponse> {
    return this.http.post('http://127.0.0.1:8000/upload-zip', formData, { responseType: 'json' });
  }

}

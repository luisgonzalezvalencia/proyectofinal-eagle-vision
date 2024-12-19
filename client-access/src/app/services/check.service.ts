
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from './error-messages.es';
import { HttpRequestService } from './http-request.service';

export interface MessageOrErrorResponse {
  message?: string
  error?: string
}

@Injectable({ providedIn: 'root' })
export class CheckService {

  constructor(private httpRequestService: HttpRequestService) { }


  check(formData: FormData): Observable<Blob> {
    return this.httpRequestService.postData('check', formData, 'blob');
  }

  getListadoAlumnos(): Observable<object> {
    return this.httpRequestService.getData('get_presentes_del_dia', 'json');
  }

  getErrorMessage(error: any): string {
    const errorKey = Object.keys(error)[0];
    const errorMessage = ERROR_MESSAGES[errorKey as keyof typeof ERROR_MESSAGES];
    return errorMessage.replace('{{requiredLength}}', error[errorKey].requiredLength);
  }

  uploadZip(formData: FormData): Observable<MessageOrErrorResponse> {
    return this.httpRequestService.postData('upload-zip', formData, 'json');
  }

  uploadImage(formData: FormData): Observable<MessageOrErrorResponse> {
    return this.httpRequestService.postData('upload-image', formData, 'json');
  }

  startTraining(formData: FormData): Observable<MessageOrErrorResponse> {
    return this.httpRequestService.postData('train-data-client', formData, 'json');
  }


}

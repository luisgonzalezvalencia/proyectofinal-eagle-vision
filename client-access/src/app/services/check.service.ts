
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckService {

  constructor(private http: HttpClient) { }

  postData(formData: FormData): Observable<Blob> {
    return this.http.post('http://127.0.0.1:8000/check', formData, { responseType: 'blob' });
  }

  getListadoAlumnos(): Observable<object> {
    return this.http.get('http://127.0.0.1:8000/get_presentes_del_dia', { responseType: 'json' });
  }
}

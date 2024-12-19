import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class HttpRequestService {

    BASE_URL = 'https://api.eaglevision-ia.com';

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {

    }

    getAuthHeaders(): HttpHeaders {
        console.log('auth.currentUser', this.auth.currentUser);
        const token = this.auth.userAccessToken;
        if (token) {
            return new HttpHeaders({
                Authorization: `Bearer ${token}`, // Encabezado con el token
            });
        }

        return new HttpHeaders(); // Sin token si no hay usuario autenticado
    }

    /**
     * Send a POST request to the given url and return an Observable of the
     * response.
     *
     * @param url The URL to send the POST request to.
     * @param data The data to send with the POST request.
     * @param responseType The type of the response.
     * @returns An Observable of the response.
     */
    postData(url: string, data: any, responseType: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.BASE_URL}/${url}`,
            data,
            {
                headers: headers,
                responseType: responseType
            }
        );
    }

    /**
     * Send a GET request to the given url and return an Observable of the
     * response.
     *
     * @param url The URL to send the GET request to.
     * @param responseType The type of the response.
     * @returns An Observable of the response.
     */
    getData(url: string, responseType: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(url, {
            headers: headers,
            responseType: responseType
        });
    }

    /**
     * Send a PUT request to the specified URL with the given data and return an Observable of the response.
     *
     * @param url The URL to send the PUT request to.
     * @param data The data to be sent in the PUT request.
     * @param responseType The expected type of the response.
     * @returns An Observable of the response.
     */

    putData(url: string, data: any, responseType: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.put(url, data, {
            headers: headers,
            responseType: responseType
        });
    }

    /**
     * Send a DELETE request to the specified URL and return an Observable of the response.
     *
     * @param url The URL to send the DELETE request to.
     * @param responseType The expected type of the response.
     * @returns An Observable of the response.
     */
    deleteData(url: string, responseType: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.delete(url, {
            headers: headers,
            responseType: responseType
        });
    }

}
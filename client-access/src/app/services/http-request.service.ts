import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class HttpRequestService {

    BASE_URL = environment.production ? 'https://eaglevision-ia.com' : 'http://127.0.0.1:8000';

    constructor(
        private http: HttpClient
    ) {

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
        return this.http.post(`${this.BASE_URL}/${url}`, data, { responseType: responseType });
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
        return this.http.get(url, { responseType: responseType });
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
        return this.http.put(url, data, { responseType: responseType });
    }

    /**
     * Send a DELETE request to the specified URL and return an Observable of the response.
     *
     * @param url The URL to send the DELETE request to.
     * @param responseType The expected type of the response.
     * @returns An Observable of the response.
     */
    deleteData(url: string, responseType: any): Observable<any> {
        return this.http.delete(url, { responseType: responseType });
    }

}
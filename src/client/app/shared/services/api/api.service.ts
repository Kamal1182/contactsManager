import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';
/* import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/throttle'; */
import { Observable } from 'rxjs';
import { throwError, of, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ApiService {

  private baseUrl = environment.apiUrl;

  private refreshNeeded = new Subject();

  refreshCall$ = this.refreshNeeded.asObservable();

  makeRefresh() {
    this.refreshNeeded.next();
  }

  constructor(private http: HttpClient,
              private auth: AuthService
             ) { }

  private headers = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };           

  get(url: string) : Observable<any> {
    return this.http.get(`${this.baseUrl}/${url}`, this.headers)
      .pipe(
        retry(1),
        catchError((res: any) => {
          return this.onRequestError(res);})
      ) 
      ;
  }

  post(url: string, body: object) : Observable<any> {
    return this.http.post(`${this.baseUrl}/${url}`, body, this.headers)
    .pipe(
      retry(0),
      catchError((res: any) => {
        return this.onRequestError(res);})
    ) 
    ;
  }

  put(url: string, body: object) : Observable<any>{
    return this.http.put(`${this.baseUrl}/${url}`, body, this.headers)
      .pipe(
        retry(0),
        catchError((res: any) => {
          return this.onRequestError(res);})
      )
    // return this.request(url, 'PUT', body);
  }

  delete(url: string, ) {
    return this.http.delete(`${this.baseUrl}/${url}`)
      .pipe(
        retry(0),
        catchError((res:any) => {
          return this.onRequestError(res);
        })
      )
    // return this.request(url, 'DELETE');
  }

  


  create(payload: any) {

    const headers = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `Bearer ${this.auth.getToken()}`
      })
    };

    return this.http.post(`${this.baseUrl}/authenticate`, payload, headers)
    .pipe(
      retry(1),
      //catchError(this.httpError)
      catchError((res: any) => {
        return this.onRequestError(res);})
    )
  }
  
  httpError(error: any) {
    let msg = '';
    if(error.error instanceof ErrorEvent) {
      // client side error
      msg = error.error.message;
    } else {
      // server side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }

  /**
     * Send reqest to the api.
     *
     * @param url The url route.
     * @param method The method type.
     * @param body The request body.
     *
     * @returns An observable.
     */
  request(url: string, method: string, body?: object) {

    const headers = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `Bearer ${this.auth.getToken()}`
      })
    };
    /* const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.auth.getToken()}`); */
    /* headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.auth.getToken()}`); */

    /* const headerOptions = {
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers,
      body: body
    };

    if (body) {
      headerOptions.body = body;
    } */

    /* if (body) {
      headers.set( 'body', body );
    } */

    const request = new HttpRequest(method, `${this.baseUrl}/${url}`, body, headers);

    return this.http.request(request)
             .pipe(
               map((res: any) => {
                 console.log(res);
                 return res;}),
                catchError((res: any) => {
                  console.log(res);
                  console.log(res.status);
                  console.log(res.error);
                  return this.onRequestError(res);})
             )

    ;
  }

  onRequestError(res: any) {
    const statusCode = res.status;
    const body = res;

    const error = {
      statusCode : statusCode,
      error : body.error.error
    }

    // if(error.error == 'jwt expired') {
    if(error.error == 'jwt expired') {
      this.auth.logout(true);
    } else if(error.error == 'jwt malformed'){
      this.auth.logout(false);
    }

    console.log('from api.service.ts')
    console.log(error);

    throwError(error);

    return Observable.create((e: any) => {e.next(error)});
  }

}

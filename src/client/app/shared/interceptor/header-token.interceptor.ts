import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { ApiService } from '../services/api/api.service';
import { finalize } from 'rxjs/operators';


@Injectable()
export class HeaderTokenInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService, private api : ApiService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.api.isLoading.next(true);
    return next.handle(
                        request.clone({
                                        setHeaders: {
                                                      Authorization : `Bearer ${this.auth.getToken()}`
                                                    }
                        })
                      ).pipe( 
                          finalize( ()=>{this.api.isLoading.next(false);
                          } )
                      );
  }
}

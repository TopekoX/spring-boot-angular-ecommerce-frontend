import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';

/**
 * Interceptor berada di antara aplikasi kita dan backend. 
 * Saat aplikasi kita membuat suatu request ke backend maka interceptor 
 * menangkap request kita sebelum dilanjutkan ke back end. 
 * Dengan menangkap request tersebut kita dapat mengubah headers ataupun body 
 * sebelum request tersebut diteruskan ke back end. 
 * Misalkan menambahkan token, menentukan Content-Type dan lain lain.
 */

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // Only add an access token for secured endpoints
    const securedEndPoint = ['http://localhost:8080/api/orders'];

    if (securedEndPoint.some(url => request.urlWithParams.includes(url))) {
      // get access token
      const accessToken = await this.oktaAuth.getAccessToken();

      // clone the request and add header with access token
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    // deprecated
    // return <any> next.handle(request).toPromise();
    
    return lastValueFrom(<any> next.handle(request));
  }

}

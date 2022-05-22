import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import OktaSignIn from '@okta/okta-signin-widget';
import { OKTA_AUTH } from '@okta/okta-angular';

import appConfig from '../../config/app-config';
import { OktaAuth } from '@okta/okta-auth-js';

/**
 * for more information: https://github.com/okta/okta-angular
 * for change/migration version future read: https://github.com/okta/okta-angular/blob/master/MIGRATING.md
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  signIn: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    this.signIn = new OktaSignIn({
      baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appConfig.oidc.clientId,
      redirectUri: appConfig.oidc.redirectUri,
      logo: 'assets/images/angular-logo.svg',
      authParams: {
        pkce: true,
        issuer: appConfig.oidc.issuer,
        scopes: appConfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
    this.signIn.remove(); // remove all to clean

    this.signIn.renderEl({
      el: '#okta-sign-in-widget' // this name should same as div tag id in component.html
    },
    (response) => {
      if (response.status === 'SUCCESS') {
        this.oktaAuth.signInWithRedirect();
      }
    },
    (error) => {
      throw error;
    }
    );
  }

  ngOnDestroy(): void {
    this.signIn.remove();
  }

}

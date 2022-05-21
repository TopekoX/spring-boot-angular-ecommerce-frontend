import { Component, Inject, OnInit } from '@angular/core';
import OktaSignIn from '@okta/okta-signin-widget';
import { OKTA_AUTH } from '@okta/okta-angular';

import AppConfig from '../../config/app-config';
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
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    this.oktaSignin = new OktaSignIn({
      logo: "assets/images/logo.png",
      baseUrl: AppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: AppConfig.oidc.clientId,
      redirectUri: AppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: AppConfig.oidc.issuer,
        scopes: AppConfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
    this.oktaSignin.remove(); // remove all to clean

    this.oktaSignin.render({
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

}

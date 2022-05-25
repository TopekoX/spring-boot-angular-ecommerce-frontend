import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = "";

  storage: Storage = sessionStorage;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaAuth.authStateManager.subscribe(
      isAuth => this.isAuthenticated = isAuth
    );
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    
    if (this.isAuthenticated) {
      const userClaim = await this.oktaAuth.getUser();
      this.userFullName = userClaim.name || "";
      
      // retrieve the user email form authentication response
      const theEmail = userClaim.email;
      this.storage.setItem('userEmail', JSON.stringify(theEmail));
    }
    console.log("Autentication = " + this.isAuthenticated);
    console.log("Username = " + this.userFullName);
  }

  async logout() {
    // terminates the session
    await this.oktaAuth.signOut();
  }

}

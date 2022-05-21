import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated?: boolean;
  userFullName?: string;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private authStateService: OktaAuthStateService) { }

  ngOnInit(): void {
    // subscribe to authentication state change
    this.authStateService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = true;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // Fetch the logged in user details (users claim)
      //
      // user full name exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name;
        }
      );
    }
  }

  logout() {
    // terminates the session
    this.oktaAuth.signOut();
  }

}

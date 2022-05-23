import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-member-page',
  templateUrl: './member-page.component.html',
  styleUrls: ['./member-page.component.css']
})
export class MemberPageComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = "";

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  async ngOnInit(){

    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    
    if (this.isAuthenticated) {
      const userClaim = await this.oktaAuth.getUser();
      this.userFullName = userClaim.name || "";
    }
    console.log("Autentication = " + this.isAuthenticated);
    console.log("Username = " + this.userFullName);

  }

}

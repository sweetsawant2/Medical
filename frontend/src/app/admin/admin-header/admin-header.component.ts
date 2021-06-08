import { Router } from '@angular/router';
import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  constructor(private auth: AuthService, private router : Router) { }

  ngOnInit(): void {
  }
 logout(){
   this.auth.logout();
   this.router.navigate(['/admin']);
 }
}

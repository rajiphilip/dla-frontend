import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DlaService} from '../../../shared/dla.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private  dlaService: DlaService) {
  }

  ngOnInit() {
  }

  logout() {
    this.dlaService.loggedIn = false;
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

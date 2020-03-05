import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
  @Input()  mainPageTitle: string;
  constructor() {}

  ngOnInit() {}
}

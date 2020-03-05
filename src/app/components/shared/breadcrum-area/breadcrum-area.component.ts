import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-breadcrum-area',
  templateUrl: './breadcrum-area.component.html',
  styleUrls: ['./breadcrum-area.component.css']
})
export class BreadcrumAreaComponent implements OnInit {
  @Input() pageTitle: string;

  constructor() {
  }

  ngOnInit() {
  }
}

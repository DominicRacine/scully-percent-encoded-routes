import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const DATA = [
  {
    "name": "Page 1",
    "content": "The route has a space in it."
  },
  {
    "name": "Page2",
    "content": "The route has no space in it."
  }
]

@Component({
  selector: 'app-some',
  templateUrl: './some.component.html',
  styleUrls: ['./some.component.css']
})
export class SomeComponent implements OnInit {
  content?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.content = DATA.find( data => data.name == params.name )?.content;
      console.log(this.content);
    });
  }

}

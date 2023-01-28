import { Component, OnInit } from '@angular/core';
import { NuclinoService } from 'src/app/services/nuclino.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private nuclino: NuclinoService) {
    console.log('Construction')
  }

  async ngOnInit() {
    const spaces = await this.nuclino.getWorkspaces()
    console.log('SPACES', spaces)
  }
  
}

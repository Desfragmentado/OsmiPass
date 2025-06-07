import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desfragmentado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desfragmentado.component.html',
  styleUrls: ['./desfragmentado.component.css']
})
export class DesfragmentadoComponent implements OnInit {
  isPreloaderHidden = false;
  
  ngOnInit() {
    setTimeout(() => {
      this.isPreloaderHidden = true;
    }, 2000);
  }
}
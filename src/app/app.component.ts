import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'boletera';

  // Método para abrir WhatsApp
  openWhatsApp() {
    const phoneNumber = '3323679781';
    const message = 'Hola, estoy interesado en más información';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  // Método para abrir el sitio web
  openDsFamilia() {
    window.open('https://dsmfamilia.com', '_blank');
  }
}
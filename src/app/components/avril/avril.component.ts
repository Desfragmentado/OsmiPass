import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avril',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avril.component.html',
  styleUrls: ['./avril.component.css']
})
export class AvrilComponent {
  ticketFolio: string = this.generateRandomFolio();

  ticketOptions = [
    { type: 'General', label: 'General', price: 500 },
    { type: 'VIP + MeetAndGreet', label: 'Meet and Greet', price: 850 },
    { type: 'VIP', label: 'VIP', price: 500 },
    { type: 'VIP + MeetAndGreet + After', label: 'VIP + MeetAndGreet + After', price: 1250 },
  ];

  // Inicialización basada en el primer ticketOption para flexibilidad futura
  selectedTicketType: string = this.ticketOptions[0].type;
  ticketPrice: number = this.ticketOptions[0].price;

  eventDetails = {
    title: 'Berrinche',
    date: '16/11/2025 17:00',
    venue: 'Prol. Bernardo Quintana 165, 76060 Santiago de Querétaro, Querétaro',
    price: '$500 MXN',
    description: 'Mejor evento de artistas urbanos con invitados especiales de lujo'
  };

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['eventData']) {
      const eventData = navigation.extras.state['eventData'];
      this.eventDetails = {
        title: `${eventData.author} ${eventData.title}`,
        date: '16/11/2025 17:00',
        venue: 'Prol. Bernardo Quintana 165, 76060 Santiago de Querétaro, Querétaro',
        price: '$850 MXN',
        description: eventData.description
      };
    }

    this.updatePrice(); // Asegura que ticketPrice esté actualizado al iniciar
  }

  updatePrice(): void {
    const selectedOption = this.ticketOptions.find(opt => opt.type === this.selectedTicketType);
    if (selectedOption) {
      this.ticketPrice = selectedOption.price;
    }
  }

  generateTicket(): void {
    this.router.navigate(['/pago'], {
      state: {
        ticketData: {
          folio: this.ticketFolio,
          price: this.ticketPrice,
          type: this.selectedTicketType,
          event: this.eventDetails
        }
      }
    });
  }

  private generateRandomFolio(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      if (i === 3) result += '-';
    }
    return result;
  }

  getTotalPrice(): number {
    return this.ticketPrice;
  }

  // Getters para separar fecha y hora de forma segura
  get eventDate(): string {
    return this.eventDetails.date.split(' ')[0] || '';
  }

  get eventTime(): string {
    return this.eventDetails.date.split(' ')[1] || '';
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { io, Socket } from 'socket.io-client';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class PagoComponent implements OnInit, OnDestroy {
  ticketData: any;
  customerName: string = '';
  customerEmail: string = '';
  termsAccepted: boolean = false;
  loading: boolean = false;
  timeLeft: number = 300; // Cambiado a público para el template

  private socket!: Socket;
  private timerInterval!: ReturnType<typeof setInterval>;
  private stripePromise = loadStripe('pk_test_51RN8nbDnO1YLWFfdBorzwum7sGUax7qIz2UcswzY1ioFouTPJX8qnGt73W8YhUQpKqXfXY5PYruAWmTEgmpvLM6E00BQHH3JGd');

  constructor(
    private router: Router,
    private contactService: ContactService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.ticketData = navigation?.extras.state?.['ticketData'];

    if (!this.ticketData) {
      this.router.navigate(['/avril']);
    }

    this.socket = io('http://localhost:3000', {
      reconnectionAttempts: 3,
      timeout: 5000
    });
  }

  ngOnInit(): void {
    this.startTimer();
    this.setupSocketListeners();
    this.reserveFolio();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }

  // Nuevo método para formatear el tiempo
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  isFormValid(): boolean {
    return (
      this.customerName.trim().length > 0 &&
      this.customerEmail.trim().length > 0 &&
      this.termsAccepted
    );
  }

  getTotalAmount(): number {
    return this.ticketData ? this.ticketData.price + 50 : 0;
  }

  async handleStripePayment(): Promise<void> {
    if (!this.isFormValid()) {
      Swal.fire('Error', 'Completa todos los campos y acepta los términos', 'error');
      return;
    }

    this.loading = true;

    try {
      const stripe = await this.stripePromise;
      if (!stripe) throw new Error('Stripe no se inicializó correctamente');

      const amountInCents = Math.round(this.getTotalAmount() * 100);
      if (isNaN(amountInCents) || amountInCents <= 0) {
        throw new Error('El monto total no es válido');
      }

      const payload = {
        customerName: this.customerName,
        customerEmail: this.customerEmail,
        metadata: {
          monto: amountInCents.toString(),
          folio: this.ticketData.folio,
          event: this.ticketData.event.title,
          venue: this.ticketData.event.venue,
          date: this.ticketData.event.date
        }
      };

      console.log('Enviando payload al backend:', payload);

      const response = await fetch('https://osmipass-api.onrender.com/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del backend:', errorData);
        throw new Error(errorData.error || 'Error al crear sesión de pago');
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      if (!data.id) {
        throw new Error('No se recibió un ID de sesión de Stripe');
      }

      // Opción 1: Redirección directa si hay URL
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Opción 2: Redirección con Stripe.js
      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      
      if (result.error) {
        console.error('Error de redirección a Stripe:', result.error);
        throw new Error(result.error.message || 'Error al redirigir a Stripe');
      }

    } catch (error: any) {
      console.error('Error completo:', error);
      Swal.fire({
        title: 'Error',
        text: `No se pudo procesar el pago: ${error.message || 'Error desconocido'}`,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      this.loading = false;
    }
  }

  private reserveFolio(): void {
    if (this.ticketData?.folio) {
      this.socket.emit('reserveFolio', this.ticketData.folio);
    }
  }

  private setupSocketListeners(): void {
    this.socket.on('folioReserved', () => {
      console.log('Folio reservado con éxito');
    });

    this.socket.on('folioExists', () => {
      Swal.fire({
        title: 'Folio duplicado',
        text: 'Este folio ya está en uso. Generando uno nuevo...',
        icon: 'warning'
      }).then(() => {
        if (this.ticketData) {
          this.ticketData.folio = this.generateRandomFolio();
          this.reserveFolio();
        }
      });
    });

    this.socket.on('folioExpired', () => {
      this.handleTimeExpired();
    });
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        this.handleTimeExpired();
      }
    }, 1000);
  }

  private updateTimerDisplay(): void {
    const display = document.getElementById('countdown');
    if (display) {
      display.textContent = this.formatTime(this.timeLeft);
      if (this.timeLeft <= 60) {
        display.classList.add('time-warning');
      }
    }
  }

  private handleTimeExpired(): void {
    clearInterval(this.timerInterval);
    Swal.fire({
      title: '¡Tiempo agotado!',
      text: 'La sesión ha expirado. Serás redirigido al inicio',
      icon: 'error',
      confirmButtonText: 'Entendido'
    }).then(() => {
      this.router.navigate(['/']);
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
}
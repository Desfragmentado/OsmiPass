// src/app/services/socket.service.ts
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private socket: Socket;
  private listeners = new Map<string, (...args: any[]) => void>();

  constructor(private ngZone: NgZone) {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'], // Fuerza WebSocket para mejor rendimiento
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Manejar eventos de conexión/desconexión
    this.socket.on('connect', () => {
      this.ngZone.run(() => {
        console.log('Conectado al servidor Socket.IO');
      });
    });

    this.socket.on('disconnect', () => {
      this.ngZone.run(() => {
        console.log('Desconectado del servidor Socket.IO');
      });
    });
  }

  // Método para reservar folio
  reserveFolio(folio: string): void {
    this.socket.emit('reserveFolio', folio);
  }

  // Método para confirmar pago
  confirmPayment(folio: string): void {
    this.socket.emit('confirmPayment', folio);
  }

  // Métodos para escuchar eventos
  onFolioReserved(callback: (data: { folio: string }) => void): void {
    this.registerListener('folioReserved', callback);
  }

  onFolioExists(callback: (data: { folio: string }) => void): void {
    this.registerListener('folioExists', callback);
  }

  onFolioExpired(callback: (data: { folio: string }) => void): void {
    this.registerListener('folioExpired', callback);
  }

  onPaymentConfirmed(callback: (data: { folio: string }) => void): void {
    this.registerListener('paymentConfirmed', callback);
  }

  // Método privado para registrar listeners
  private registerListener(event: string, callback: (...args: any[]) => void): void {
    // Remover listener anterior si existe
    const existingListener = this.listeners.get(event);
    if (existingListener) {
      this.socket.off(event, existingListener);
    }

    // Crear nuevo listener que ejecuta en la zona de Angular
    const ngZoneCallback = (...args: any[]) => {
      this.ngZone.run(() => callback(...args));
    };

    this.socket.on(event, ngZoneCallback);
    this.listeners.set(event, ngZoneCallback);
  }

  // Limpieza al destruir el servicio
  ngOnDestroy(): void {
    this.socket.disconnect();
    this.listeners.forEach((listener, event) => {
      this.socket.off(event, listener);
    });
    this.listeners.clear();
  }
}
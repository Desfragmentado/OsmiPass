import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseUrl = 'http://localhost:3333'

  constructor(private http: HttpClient) {}

  createStripeSession(data: { email: string; monto: number; productName: string }): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.baseUrl}/checkout`, data)
  }

  enviarConfirmacion(data: {
    nombre: string
    email: string
    evento: string
    folio: string
    precio: number
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/correos/enviar-confirmacion`, data)
  }
}
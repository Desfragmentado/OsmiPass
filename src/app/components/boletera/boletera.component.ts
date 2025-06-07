import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface CarouselItem {
  id: number;
  img: string;
  author: string;
  title: string;
  topic: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-boletera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boletera.component.html',
  styleUrls: ['./boletera.component.css']
})
export class BoleteraComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('thumbnailBorder') thumbnailBorder!: ElementRef;

  items: CarouselItem[] = [
    {
      id: 1,
      img: 'assets/image/img1.png',
      author: 'Darihus',
      title: 'Evento urbano',
      topic: 'Rap',
      description: 'El mejor evento de artistas urbanos en vivo con inicio y cierre del artista estelar Darihus',
      route: '/avril'
    },
    {
      id: 2,
      img: 'assets/image/img2.jpg',
      author: 'evento pasado',
      title: 'Street Festival IV',
      topic: 'Eventos pasados',
      description: '¿Quieres un autógrafo de ellos? Nadie como DSM familia para acercarte a tus artistas favoritos.',
      route: '/ckan'
    },
    {
      id: 3,
      img: 'assets/image/img3.png',
      author: 'Defra',
      title: 'Próximamente',
      topic: 'Artista',
      description: 'Defra, el MC que viene con fuerza desde el subterráneo.',
      route: '/defra'
    },
    {
      id: 4,
      img: 'assets/image/img4.jpg',
      author: 'Osmarha',
      title: 'Próximamente',
      topic: 'Idol',
      description: 'Osmarha es la nueva sensación con una voz que despierta multitudes.',
      route: '/osmarha'
    }
  ];

  currentIndex = 0;
  direction: 'next' | 'prev' | '' = '';
  private timeRunning = 3000;
  private timeAutoNext = 7000;
  private runTimeOut: any;
  private runNextAuto: any;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setActiveSlide();
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.clearTimers();
    }
  }

  private setActiveSlide(): void {
    if (!this.isBrowser) return;

    try {
      const sliderItems = this.slider?.nativeElement?.querySelectorAll('.item');
      const thumbnailItems = this.thumbnailBorder?.nativeElement?.querySelectorAll('.item');

      if (sliderItems && thumbnailItems) {
        sliderItems.forEach((el: HTMLElement, index: number) => {
          el.classList.toggle('active', index === this.currentIndex);
        });

        thumbnailItems.forEach((el: HTMLElement, index: number) => {
          el.classList.toggle('active', index === this.currentIndex);
        });
      }
    } catch (error) {
      console.error('Error setting active slide:', error);
    }
  }

  private startAutoSlide(): void {
    if (!this.isBrowser) return;

    this.clearTimers();
    this.runNextAuto = setTimeout(() => {
      this.nextSlide();
    }, this.timeAutoNext);
  }

  private clearTimers(): void {
    if (this.runTimeOut) clearTimeout(this.runTimeOut);
    if (this.runNextAuto) clearTimeout(this.runNextAuto);
  }

  goToSlide(index: number): void {
    if (!this.isBrowser || index === this.currentIndex) return;
    
    this.direction = index > this.currentIndex ? 'next' : 'prev';
    this.currentIndex = index;
    this.resetAutoSlide();
    this.setActiveSlide();
  }

  nextSlide(): void {
    if (!this.isBrowser) return;

    this.direction = 'next';
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.resetAutoSlide();
    this.setActiveSlide();
  }

  prevSlide(): void {
    if (!this.isBrowser) return;

    this.direction = 'prev';
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.resetAutoSlide();
    this.setActiveSlide();
  }

  private resetAutoSlide(): void {
    if (!this.isBrowser) return;

    this.clearTimers();
    this.runTimeOut = setTimeout(() => {
      this.direction = '';
    }, this.timeRunning);
    this.startAutoSlide();
  }

  verMas(item: CarouselItem): void {
    if (!this.isBrowser) return;

    this.clearTimers();

    Swal.fire({
      title: item.title,
      html: `
        <strong>Autor:</strong> ${item.author}<br>
        <strong>Género:</strong> ${item.topic}<br>
        <strong>Descripción:</strong><br>${item.description}
      `,
      imageUrl: item.img,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: item.title,
      confirmButtonText: 'Cerrar',
      background: '#1c1c1c',
      color: '#fff',
      didClose: () => {
        if (this.isBrowser) {
          this.startAutoSlide();
        }
      }
    }).catch(error => {
      console.error('Error showing details:', error);
    });
  }

  reserveTicket(item: CarouselItem): void {
    this.router.navigate([item.route], {
      state: { eventData: item }
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}
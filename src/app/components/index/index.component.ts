import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  menuActive: boolean = false;
  isSubmitting: boolean = false;
  isSubscribing: boolean = false;

  events = [
    {
      day: '15',
      month: 'JUN',
      title: 'DSM Urban Fest 2024',
      location: 'Guadalajara, Jalisco',
      time: '8:00 PM',
      description: 'El festival urbano más grande del año con todos los artistas de DSM Familia y invitados especiales.'
    },
    {
      day: '28',
      month: 'JUL',
      title: 'Desfragmentado - Tour Fragmentos',
      location: 'CDMX',
      time: '9:00 PM',
      description: 'Presentación exclusiva del nuevo álbum del MC legendario con material inédito.'
    },
    {
      day: '10',
      month: 'AGO',
      title: 'Kitty Soul & 7R - Dualidad',
      location: 'Monterrey, NL',
      time: '7:30 PM',
      description: 'Dos estilos, un mismo escenario. Experiencia única de fusión entre rock alternativo y trap.'
    }
  ];

  benefits = [
    'Acceso a eventos exclusivos',
    'Meet & greet con artistas',
    'Merchandising limitado',
    'Descuentos en próximos eventos'
  ];

  contactInfo = [
    { icon: 'map-marker-alt', title: 'Ubicación', value: 'Guadalajara, Jalisco, México' },
    { icon: 'envelope', title: 'Email', value: 'contacto@dsmfamilia.com' },
    { icon: 'phone-alt', title: 'Teléfono', value: '+52 33 1234 5678' }
  ];

  socialLinks = [
    { icon: 'facebook-f', url: 'https://facebook.com/dsmfamilia' },
    { icon: 'instagram', url: 'https://instagram.com/dsmfamilia' },
    { icon: 'youtube', url: 'https://youtube.com/dsmfamilia' },
    { icon: 'tiktok', url: 'https://tiktok.com/@dsmfamilia' },
    { icon: 'spotify', url: 'https://open.spotify.com/artist/dsmfamilia' }
  ];

  footerLinks = {
    explore: [
      { text: 'Inicio', url: '#inicio' },
      { text: 'Eventos', url: '#eventos' },
      { text: 'Nosotros', url: '#nosotros' },
      { text: 'Contacto', url: '#contacto' }
    ],
    legal: [
      { text: 'Términos y condiciones', url: '/terminos' },
      { text: 'Política de privacidad', url: '/privacidad' },
      { text: 'Cookies', url: '/cookies' }
    ]
  };

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  newsletterEmail: string = '';
  
  countdown = {
    days: '05',
    hours: '12',
    minutes: '45'
  };

  private countdownInterval: any;
  private scrollListener: () => void;
  private backToTopListener: () => void;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.scrollListener = () => {};
    this.backToTopListener = () => {};
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initLoader();
      this.initCountdown();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMobileMenu();
      this.initNavbarScroll();
      this.initSmoothScroll();
      this.initBackToTop();
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('scroll', this.backToTopListener);
    }
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  navigateToBoletera(): void {
    this.router.navigate(['/boletera']);
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  submitContactForm(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;
    
    setTimeout(() => {
      alert('Mensaje enviado con éxito. ¡Gracias!');
      this.contactForm = { name: '', email: '', subject: '', message: '' };
      this.isSubmitting = false;
    }, 1500);
  }

  submitNewsletter(event: Event): void {
    event.preventDefault();
    this.isSubscribing = true;
    
    setTimeout(() => {
      alert('¡Gracias por suscribirte!');
      this.newsletterEmail = '';
      this.isSubscribing = false;
    }, 1500);
  }

  private initLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.querySelector('.loader');
      if (loader) {
        setTimeout(() => {
          loader.classList.add('loader-hidden');
          loader.addEventListener('transitionend', () => {
            if (loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
          }, { once: true });
        }, 1500);
      }
    }
  }

  private initMobileMenu(): void {
    if (isPlatformBrowser(this.platformId)) {
      const menuBtn = document.querySelector('.menu-btn');
      const navMenu = document.querySelector('.nav-menu');

      if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
          navMenu.classList.toggle('active');
          menuBtn.classList.toggle('open');
        });

        const navLinks = document.querySelectorAll('.nav-menu a');
        if (navLinks) {
          Array.from(navLinks).forEach(link => {
            link.addEventListener('click', () => {
              navMenu.classList.remove('active');
              menuBtn.classList.remove('open');
            });
          });
        }
      }
    }
  }

  private initNavbarScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
          navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
      };
      window.addEventListener('scroll', this.scrollListener);
    }
  }

  private initSmoothScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const anchors = document.querySelectorAll('a[href^="#"]');
      if (anchors) {
        Array.from(anchors).forEach(anchor => {
          anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
              e.preventDefault();
              const target = document.querySelector(targetId);
              if (target) {
                window.scrollTo({
                  top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                  behavior: 'smooth'
                });
              }
            }
          });
        });
      }
    }
  }

  private initBackToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      const backToTopBtn = document.querySelector('.back-to-top');
      if (backToTopBtn) {
        this.backToTopListener = () => {
          backToTopBtn.classList.toggle('show', window.scrollY > 300);
        };
        window.addEventListener('scroll', this.backToTopListener);

        backToTopBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }
  }

  private initCountdown(): void {
    if (isPlatformBrowser(this.platformId)) {
      const targetDate = new Date('2025-06-25T20:00:00');

      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
          clearInterval(this.countdownInterval);
          this.countdown = { days: '00', hours: '00', minutes: '00' };
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        this.countdown.days = days.toString().padStart(2, '0');
        this.countdown.hours = hours.toString().padStart(2, '0');
        this.countdown.minutes = minutes.toString().padStart(2, '0');
      };

      updateCountdown();
      this.countdownInterval = setInterval(updateCountdown, 60000);
    }
  }
}
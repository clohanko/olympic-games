import { Component, OnInit, HostListener } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicChartData } from 'src/app/core/models/OlympicChartData';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [NgxChartsModule, NgIf]
})
export class HomeComponent implements OnInit {

  // Données des JO (liste complète des pays avec participations)
  olympics$: Observable<Olympic[]> = this.olympicService.getOlympics();

  // Nombre de pays participants
  numberOfCountries$: Observable<number> = this.olympics$.pipe(
    map((olympics) => (olympics ? olympics.length : 0))
  );

  // Nombre d'années olympiques uniques (chaque année où un pays a participé)
  numberOfJO$: Observable<number> = this.olympics$.pipe(
    map((olympics) => {
      if (!olympics) return 0;
      const allYears = olympics.flatMap(o =>
        o.participations.map(p => p.year)
      );
      const uniqueYears = [...new Set(allYears)];
      return uniqueYears.length;
    })
  );

  // Données du graphique à afficher (nom du pays + total de médailles)
  data$: Observable<OlympicChartData[]> = this.olympicService.getChartData();

  // Propriétés liées à l'affichage du graphique
  view: [number, number] = [700, 400];
  showLegend = true;
  showLabels = true;
  arcWidth = 1;

  // Palette de couleurs du graphique (initialisée dynamiquement)
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.data$.pipe(take(1)).subscribe(data => {
      this.colorScheme = { domain: this.generateHSLColors(data.length) };
    });
    this.setResponsiveView();
  }
  

  // Détecte le redimensionnement de la fenêtre pour ajuster la vue du graphique
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setResponsiveView();
  }

  // Adapte les dimensions du graphique en fonction de la largeur de l'écran
  setResponsiveView(): void {
    const screenWidth = window.innerWidth;
  
    if (screenWidth < 576) {
      this.view = [320, 300];
      this.showLegend = false; 
    } else if (screenWidth < 768) {
      this.view = [500, 350];
      this.showLegend = true;
    } else {
      this.view = [700, 400];
      this.showLegend = true;
    }
  }
  

  // Génère un tableau de couleurs HSL réparties uniformément
  generateHSLColors(n: number): string[] {
    const colors: string[] = [];
    const saturation = 70;
    const lightness = 50;
    const limit = Math.max(1, n); // évite n = 0
    for (let i = 0; i < limit; i++) {
      const hue = Math.round((360 / limit) * i);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }
  
  // Lorsque l'utilisateur clique sur un pays du graphique,
  // on redirige vers la page de détails correspondante
  onSelect(event: any): void {
    const countryName: string = event.name;
    this.olympicService.getOlympics().subscribe((olympics: Olympic[] | undefined) => {
      const country = olympics?.find((o) => o.country === countryName);
      if (country) {
        this.router.navigate(['/country', country.id]);
      }
    });
  }
}

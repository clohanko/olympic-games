import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { catchError, filter, map, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: true,
  imports: [NgxChartsModule, RouterModule]
})
export class CountryDetailComponent implements OnInit, OnDestroy {

  // ID récupéré depuis l'URL (ex: /country/2)
  countryId!: number;

  // Données complètes du pays sélectionné
  countryData: Olympic | undefined;

  // Résumé calculé (total participations, médailles, athlètes)
  summary = { participations: 0, totalMedals: 0, totalAthletes: 0 };

  // Données formatées pour ngx-charts
  chartData: { name: string; series: { name: string; value: number }[] }[] = [];

  // Configuration du graphique
  view: [number, number] = [700, 400];
  gradient = false;
  showLegend = false;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Année';
  yAxisLabel = 'Médailles';
  

  // Subscription pour gérer manuellement l'observable
  private subscription!: Subscription
  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    // Récupération de l'ID du pays depuis l'URL
    this.countryId = Number(this.route.snapshot.paramMap.get('id'));

    // Responsive dès le départ
    this.setResponsiveView();

    // Chargement des données du pays
    this.loadCountryData();
  }

  // Responsive dynamique en cas de redimensionnement
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setResponsiveView();
  }

  // Ajuste la taille du graphique en fonction de la largeur de l'écran
  setResponsiveView(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) {
      this.view = [320, 300]; // mobile
    } else if (screenWidth < 768) {
      this.view = [500, 350]; // tablette
    } else {
      this.view = [700, 400]; // desktop
    }
  }

  // Récupère les données olympiques et extrait celles du pays ciblé
  private loadCountryData(): void {
    this.subscription = this.olympicService.getOlympics().pipe(
      filter(olympics => !!olympics),
      map((olympics: Olympic[]) => olympics.find(o => o.id === this.countryId)),
      catchError(err => {
        console.error('Erreur lors du chargement des données :', err);
        return of(undefined);
      })
    ).subscribe((olympic: Olympic | undefined) => {
      if (!olympic) return;

      this.countryData = olympic;

      const participations = this.countryData.participations;

      this.summary = this.computeSummary(participations);
      this.chartData = this.buildChartData(participations);
    });
  }

  // Calcule les totaux pour l'affichage résumé
  private computeSummary(participations: Participation[]) {
    return {
      participations: participations.length,
      totalMedals: participations.reduce((sum, p) => sum + p.medalsCount, 0),
      totalAthletes: participations.reduce((sum, p) => sum + p.athleteCount, 0)
    };
  }

  // Transforme les participations en séries annuelles pour ngx-charts
  private buildChartData(participations: Participation[]): { name: string; series: { name: string; value: number }[] }[] {
    return [
      {
        name: 'Médailles 🏅',
        series: participations.map(p => ({
          name: p.year.toString(),
          value: p.medalsCount
        }))
      }
    ];
  }

  // Nettoyage de la souscription à la destruction du composant
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

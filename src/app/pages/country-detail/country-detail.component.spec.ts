import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryDetailComponent } from './country-detail.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('CountryDetailComponent', () => {
  let component: CountryDetailComponent;
  let fixture: ComponentFixture<CountryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CountryDetailComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideRouter([]),
        provideAnimations() // ✅ Active les animations pour éviter NG05105
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('computeSummary', () => {
    it('devrait retourner le bon résumé pour les participations', () => {
      const participations = [
        { id: 1, year: 2000, city: 'Sydney', medalsCount: 5, athleteCount: 20 },
        { id: 2, year: 2004, city: 'Athènes', medalsCount: 3, athleteCount: 18 },
        { id: 3, year: 2008, city: 'Pékin', medalsCount: 4, athleteCount: 22 }
      ];

      const result = component['computeSummary'](participations);

      expect(result.participations).toBe(3);
      expect(result.totalMedals).toBe(12);
      expect(result.totalAthletes).toBe(60);
    });
  });
});

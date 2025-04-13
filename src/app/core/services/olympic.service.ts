import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { OlympicChartData } from '../models/OlympicChartData';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | undefined>(undefined);


  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
      }),
      catchError((error, caught) => {
        console.error("Erreur lors du chargement des données :", error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }
  

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.pipe(
      filter((data): data is Olympic[] => !!data)
    );
  }
  
  getChartData(): Observable<OlympicChartData[]> {
    return this.getOlympics().pipe(
      map((olympics: Olympic[]) => {
        return olympics.map(olympic => {
          const participations = olympic.participations ?? [];
          const totalMedals = participations.reduce((sum, participation) => {
            return sum + participation.medalsCount;
          }, 0);
          return {
            name: olympic.country,
            value: totalMedals
          };
        });
      })
    );
  }
  
  
}

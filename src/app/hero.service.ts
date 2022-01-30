import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { MessageService } from './message.service';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = "api/heroes"

  constructor(
    private messageService: MessageService,
    private httpClient: HttpClient
    ) { }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl).
      pipe( 
        tap(_ => this.log('fetched heroes')),
        catchError(
        this.handleError<Hero[]>('getHeroes',[])
        )
      );
  }

  getHero(id: Number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url).
      pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T)
    }
  }
}

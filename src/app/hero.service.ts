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
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private messageService: MessageService,
    private httpClient: HttpClient
    ) { }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      return of([]);
    }
    return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).
      pipe(
        tap({next: 
          x => x.length ?
            this.log(`found heroes matching "${term}"`) :
            this.log(`no heroes matching "${term}"`)
        }));
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.httpClient.delete<Hero>(url,this.httpOptions).
      pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions).
      pipe(
        tap((newHero: Hero) => this.log(`added hero with id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return  this.httpClient.put(this.heroesUrl, hero, this.httpOptions).
      pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
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

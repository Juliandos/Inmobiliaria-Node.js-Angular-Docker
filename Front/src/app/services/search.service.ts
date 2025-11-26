import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Propiedad } from './propiedades.service';

export interface SearchParams {
  buscando?: string;
  ubicacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchResultsSubject = new BehaviorSubject<Propiedad[]>([]);
  private searchParamsSubject = new BehaviorSubject<SearchParams>({});
  private isSearchingSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  searchResults$ = this.searchResultsSubject.asObservable();
  searchParams$ = this.searchParamsSubject.asObservable();
  isSearching$ = this.isSearchingSubject.asObservable();

  // Getters para valores actuales
  get currentResults(): Propiedad[] {
    return this.searchResultsSubject.value;
  }

  get currentParams(): SearchParams {
    return this.searchParamsSubject.value;
  }

  get isSearching(): boolean {
    return this.isSearchingSubject.value;
  }

  // Métodos para actualizar el estado
  setSearchResults(results: Propiedad[]): void {
    this.searchResultsSubject.next(results);
  }

  setSearchParams(params: SearchParams): void {
    this.searchParamsSubject.next(params);
  }

  setIsSearching(isSearching: boolean): void {
    this.isSearchingSubject.next(isSearching);
  }

  clearSearch(): void {
    this.searchResultsSubject.next([]);
    this.searchParamsSubject.next({});
    this.isSearchingSubject.next(false);
  }
}


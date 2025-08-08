import {Component, computed, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { Item} from './shared/data';
import {debounceTime, distinctUntilChanged, Observable, of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import { NgIf} from '@angular/common';
import {WarframeMarketService} from './item-orders/warframe-market.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Warframe Market Search';
  searchQuery = '';
  searchResults: Item[] = [];
  showResults = false;
  isLoading = false;
  warframeService = inject(WarframeMarketService)
  allItems = computed<Item[]>(this.warframeService.allItems);

  constructor(private router: Router) {
  }



  searchItems(query: string): Observable<Item[]> {
    if (!query.trim()) {
      return of([]);
    }


    const filteredItems = this.allItems().filter(item =>
      item.info.name.toLowerCase().startsWith(query.toLowerCase())
    );
    return of(filteredItems);

  }

  onSearchInput() {
    this.isLoading = true;
    this.searchItems(this.searchQuery)
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.showResults = results.length > 0;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Search error:', err);
          this.isLoading = false;
        }
      });
  }

  selectItem(item: Item) {
    this.searchQuery = item.info.name;
    this.showResults = false;
    this.router.navigate(['/items', item.slug, 'orders']);
    // You can add navigation or other actions here
  }


  hideResults() {
    this.showResults = false;
  }
}

import {Injectable,  signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {GetItemsRes, GetOrdersReq, Order, Item, ItemDetails, ItemDetailsRes} from '../shared/data';


@Injectable({
  providedIn: 'root'
})
export class WarframeMarketService {
  private apiUrl = 'https://warframe-market-proxy-server.vercel.app/api';
  allItems = signal<Item[]>([]);
  itemsLoaded = signal(false);
  allOrders = signal<{
    slug: string;
    orders: Order[];
    loadedAll: boolean;
  }[]>([]);

  getNameById(itemId: string) {
    return this.allItems().find(item => item.id === itemId)?.info.name || 'Unknown Item';
  }

  constructor(private http: HttpClient) {
    http.get<GetItemsRes>(`${this.apiUrl}/items`).subscribe(
      response => {
        this.allItems.set(response.data.map(item => new Item(item)));
      },
      error => {
        console.error('Error fetching items:', error);
      }
    )
    this.itemsLoaded.set(true)
    // i need to make a request to get recent orders for all items every 1 m
    setInterval(() => {
      http.get<GetOrdersReq>(`${this.apiUrl}/orders/recent`).subscribe(
        response => {
          const recentOrders = response.data.map(order => new Order(order));
          console.log('Fetched recent orders:', recentOrders.length);
          this.allOrders.update(orders => {
            // Update existing orders or add new ones
            recentOrders.forEach(order => {
              const index = orders.findIndex(o => o.slug === order.itemId);
              if (index > -1) {
                // Update existing entry
                const existing = orders[index];
                existing.orders.push(order);
                existing.loadedAll = true; // Mark as loaded
                console.log(`Updated orders for item ${this.getNameById(order.itemId)}:`, existing.orders.length, 'orders');
              } else {
                // Add new entry
                orders.push({slug: order.itemId, orders: [order], loadedAll: false});
              }
            });
            return [...orders];
          });
        },
        error => {
          console.error('Error fetching recent orders:', error);
        }
      );
    }, 20 * 1000); // every 1 minute
  }

  public getItemDetails(itemId: string): Observable<ItemDetails> {
    return this.http.get<ItemDetailsRes>(`${this.apiUrl}/items/${itemId}`).pipe(
      map(response => new ItemDetails(response.data))
    );
  }

  private getItemOrders(itemId: string): Observable<Order[]> {

    return this.http.get<GetOrdersReq>(`${this.apiUrl}/orders/item/${itemId}`).pipe(
      map(response => {
        const data = response.data.map(order => new Order(order));
        this.allOrders.update(orders => {
          console.log(`Updating orders for item ${itemId}:`, data.length, 'orders');

          const index = orders.findIndex(o => o.slug === itemId);
          const isLoaded = orders.find(o => o.slug === itemId)?.loadedAll ?? false;
          if (index > -1 && isLoaded) {
            // Create a new array and replace the existing item
            const newOrders = [...orders];
            newOrders[index] = {
              ...newOrders[index],
              orders: data,
              loadedAll: isLoaded
            };
            return newOrders;
          } else {
            // Return a new array with the new entry
            return [
              ...orders,
              {slug: itemId, orders: data, loadedAll: true}
            ];
          }
        });
        return data
      })
    )
  }


  loadOrders(itemId: string) {
    this.getItemOrders(itemId).subscribe(
      orders => {
        console.log(`Loaded ${orders.length} orders for item ${itemId}`);
      },
      error => {
        console.error(`Error loading orders for item ${itemId}:`, error);
      }
    );
  }
}

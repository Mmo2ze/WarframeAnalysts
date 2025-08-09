import {Component, computed, OnInit, signal} from '@angular/core';
import {NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {WarframeMarketService} from './warframe-market.service';
import {TimeAgoPipe} from '../shared/time-ago-pipe';
import {getStatusPriority} from '../shared/helper';
import {ItemDetails} from '../shared/data';

@Component({
    selector: 'app-item-orders',
    imports: [
        TitleCasePipe,
        TimeAgoPipe,
        NgIf,
        NgClass
    ],
    templateUrl: './item-orders.html',
    styleUrl: './item-orders.css'
})
export class ItemOrders implements OnInit {
    type = signal<'sell' | 'buy'>('sell');
    id = signal('')

    orders = computed(() => this.marketService.allOrders().find(x => x.slug === this.id())?.orders
        .sort((a, b) => {
                // 1. First sort by order type (group sells together, buys together)
                if (a.type !== b.type) {
                    return a.type === 'sell' ? -1 : 1;
                }
                // 2. Then sort by status priority (online first)
                const statusDiff = getStatusPriority(a.user.status) - getStatusPriority(b.user.status);
                if (statusDiff !== 0) return statusDiff;

                // 3. Finally sort by price (within same status groups)
                if (a.type === 'sell') {
                    // For sell orders: lowest price first
                    if (a.platinum != b.platinum)
                        return (a.platinum || 0) - (b.platinum || 0);
                    else
                        return  b.quantity - a.quantity;
                } else {
                    // For buy orders: highest price first
                    if (a.platinum != b.platinum)
                        return (b.platinum || 0) - (a.platinum || 0);
                    else
                        return  b.quantity - a.quantity;
                }


            }
        ).filter(order => order.type == this.type()));
    readonly item = signal<ItemDetails | undefined>(undefined)
    isLoading = true;
    error: string | null = null;
    thumbnailHovered: boolean = false;

    constructor(private route: ActivatedRoute, private marketService: WarframeMarketService) {
    }


    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const itemId = params.get('id');
            if (itemId) {
                this.marketService.getItemDetails(itemId).subscribe(
                    (itemDetails: ItemDetails) => {
                        this.item.set(itemDetails);
                        this.isLoading = false;
                    },
                    (error) => {
                        console.error('Error fetching item details:', error);
                        this.error = 'Failed to load item details';
                        this.isLoading = false;
                    }
                )
                this.marketService.loadOrders(itemId);
                this.id.set(itemId);
            } else {
                this.error = 'No item ID provided in route';
                this.isLoading = false;
            }

        });

    }


    getOrdersByType(type: 'sell' | 'buy') {
        this.type.set(type);
    }

    getStatusClass(status: string): string {
        return status.toLowerCase();
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    getRarityClass(vaulted?: boolean): string {
        return vaulted ? 'vaulted' : 'not-vaulted';
    }

    getPlatformIcon(platform: string): string {
        if (!platform) {
            return 'help-circle';
        }
        switch (platform.toLowerCase()) {
            case 'pc':
                return 'computer';
            case 'xbox':
                return 'xbox';
            case 'playstation':
                return 'playstation';
            case 'switch':
                return 'nintendo-switch';
            default:
                return 'help-circle';
        }
    }


    selectOrderType(type: 'sell' | 'buy') {

        this.type.set(type);


    }
}

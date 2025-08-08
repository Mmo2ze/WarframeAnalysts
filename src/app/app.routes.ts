import { Routes } from '@angular/router';
import {ItemOrders} from './item-orders/item-orders';

export const routes: Routes = [
  {
    path:"items/:id/orders",
    component: ItemOrders
  }

];

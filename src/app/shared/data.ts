export interface GetItemsRes {
  apiVersion: string
  data: itemRes[]
  error: any
}

interface itemRes {
  id: string
  slug: string
  gameRef: string
  tags: string[]
  i18n: I18n
  maxRank?: number
  bulkTradable?: boolean
  ducats?: number
  subtypes?: string[]
  maxAmberStars?: number
  maxCyanStars?: number
  baseEndo?: number
  endoMultiplier?: number
  vaulted?: boolean
}

interface I18n {
  en: En
}

interface En {
  name: string
  icon: string
  thumb: string
  subIcon?: string
}

class Info {
  constructor(En: En) {
    this.name= En.name;
    this.icon= En.icon;
    this.thumb= En.thumb;
  }
  name: string
  icon: string
  thumb: string
  subIcon?: string
}

export class Item{
  constructor(ItemRes: itemRes) {
    this.id = ItemRes.id;
    this.slug = ItemRes.slug;
    this.gameRef = ItemRes.gameRef;
    this.tags = ItemRes.tags;
    this.info = new Info(ItemRes.i18n.en);
    this.maxRank = ItemRes.maxRank;
    this.bulkTradable = ItemRes.bulkTradable;
    this.ducats = ItemRes.ducats;
    this.subtypes = ItemRes.subtypes;
    this.maxAmberStars = ItemRes.maxAmberStars;
    this.maxCyanStars = ItemRes.maxCyanStars;
    this.baseEndo = ItemRes.baseEndo;
    this.endoMultiplier = ItemRes.endoMultiplier;
    this.vaulted = ItemRes.vaulted;
  }
  id: string
  slug: string
  gameRef: string
  tags: string[]
  info: Info
  maxRank?: number
  bulkTradable?: boolean
  ducats?: number
  subtypes?: string[]
  maxAmberStars?: number
  maxCyanStars?: number
  baseEndo?: number
  endoMultiplier?: number
  vaulted?: boolean
}


export interface GetOrdersReq {
  apiVersion: string
  data: OrderRes[]
  error: any
}

interface OrderRes {
  id: string
  type: string
  platinum: number
  quantity: number
  rank?: number
  visible: boolean
  createdAt: string
  updatedAt: string
  itemId: string
  user: User
  subtype?: string

  amberStars?: number
  cyanStars?: number
}
export class Order   {
  id: string
  type: string
  platinum: number
  quantity: number
  rank?: number
  visible: boolean
  createdAt: Date
  updatedAt: Date
  itemId: string
  user: User
  subtype?: string
  amberStars?: number
  cyanStars?: number
  constructor(order: OrderRes) {
    this.id = order.id;
    this.type = order.type;
    this.platinum = order.platinum;
    this.quantity = order.quantity;
    this.rank = order.rank;
    this.visible = order.visible;
    this.createdAt = new Date(order.createdAt);
    this.updatedAt = new Date(order.updatedAt);
    this.itemId = order.itemId;
    this.user = order.user;
    if(!this.user.avatar) {
      this.user.avatar = `https://warframe.market/static/assets/user/default-avatar.png`;
    }
    else {
      this.user.avatar = `https://warframe.market/static/assets/${this.user.avatar}`;
    }
    this.subtype = order.subtype;
    this.cyanStars = order.cyanStars;
    this.amberStars = order.amberStars;
  }
}

export type Status = 'offline' | 'online' | 'ingame' ;

export interface User {
  id: string
  ingameName: string
  slug: string
  avatar?: string
  reputation: number
  platform: string
  crossplay: boolean
  locale: string
  status: Status
  activity: Activity
  lastSeen: string
}

export interface Activity {
  type: string
  details: string
  startedAt: string
}





interface ItemEn {
  name: string;
  description: string;
  wikiLink: string;
  icon: string;
  thumb: string;
}

interface ItemInfo {
  en: ItemEn;
}

interface ItemDetailsData {
  id: string;
  slug: string;
  gameRef: string;
  tags: string[];
  setRoot: boolean;
  setParts: string[];
  ducats: number;
  reqMasteryRank: number;
  tradingTax: number;
  tradable: boolean;
  i18n: ItemInfo;
  maxRank?: number
  bulkTradable?: boolean
  subtypes?: string[]
  maxAmberStars?: number
  maxCyanStars?: number
  baseEndo?: number
  endoMultiplier?: number
  vaulted?: boolean
}

export interface ItemDetailsRes {
  apiVersion: string;
  data: ItemDetailsData;
  error?: any;
}
class InfoDetails {
  name: string;
  description: string;
  wikiLink: string;
  icon: string;
  thumb: string;
  constructor(ItemEn: ItemEn) {
    this.name = ItemEn.name;
    this.description = ItemEn.description;
    this.wikiLink = ItemEn.wikiLink;
    this.icon = ItemEn.icon;
    this.thumb = ItemEn.thumb;
  }
}
export class ItemDetails {
  id: string;
  slug: string;
  gameRef: string;
  tags: string[];
  setRoot: boolean;
  setParts: string[];

  maxRank?: number
  bulkTradable?: boolean
  ducats?: number
  subtypes?: string[]
  maxAmberStars?: number
  maxCyanStars?: number
  baseEndo?: number
  endoMultiplier?: number
  vaulted?: boolean
  reqMasteryRank: number;
  tradingTax: number;
  tradable: boolean;
  info: InfoDetails;
  marketLink:string
  constructor(data: ItemDetailsData) {
    this.id = data.id;
    this.slug = data.slug;
    this.gameRef = data.gameRef;
    this.tags = data.tags;
    this.setRoot = data.setRoot;
    this.setParts = data.setParts;
    this.ducats = data.ducats;
    this.reqMasteryRank = data.reqMasteryRank;
    this.tradingTax = data.tradingTax;
    this.tradable = data.tradable;
    this.marketLink= `https://warframe.market/items/${this.slug}`;
    this.maxRank = data.maxRank;
    this.bulkTradable = data.bulkTradable;
    this.subtypes = data.subtypes;
    this.maxAmberStars = data.maxAmberStars;

    this.maxCyanStars = data.maxCyanStars;
    this.baseEndo = data.baseEndo;
    this.endoMultiplier = data.endoMultiplier;
    this.vaulted = data.vaulted;


    this.info = new InfoDetails(data.i18n.en);
  }
}

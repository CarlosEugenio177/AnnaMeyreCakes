export type StoreStatus = 'OPEN' | 'CLOSED';

export type OrderStatus =
  | 'NEW'
  | 'WAITING_DEPOSIT'
  | 'DEPOSIT_PAID'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELED';

export type PaymentMethod = 'PIX' | 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'OTHER';

export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELED';

export type CatalogItem = {
  id: string;
  name: string;
  colorHex?: string;
  color_hex?: string;
  isActive?: boolean;
};

export type Dough = CatalogItem & {
  colorHex: string;
};

export type Filling = CatalogItem & {
  extraPrice: string | number;
  colorHex: string;
};

export type Topping = CatalogItem & {
  colorHex: string;
};

export type CakeSize = {
  id: string;
  slices: number;
  price: string | number;
  isActive?: boolean;
};

export type SweetFlavor = {
  id: string;
  name: string;
  sweetTypeId: string;
  isActive?: boolean;
};

export type SweetType = {
  id: string;
  name: string;
  pricePer100: string | number;
  flavors: SweetFlavor[];
  isActive?: boolean;
};

export type Catalog = {
  doughs: Dough[];
  fillings: Filling[];
  toppings: Topping[];
  cakeSizes: CakeSize[];
  sweetTypes: SweetType[];
};

export type Settings = {
  id?: string;
  whatsappNumber: string;
  storeStatus: StoreStatus;
};

export type SweetSelection = {
  sweetTypeId: string;
  quantity: 30 | 50 | 100;
  sweetFlavorIds: string[];
};

export type CustomerData = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  desiredDate: string;
  notes?: string;
};

export type CreateOrderPayload = CustomerData & {
  cake: {
    doughId: string;
    cakeSizeId: string;
    filling1Id: string;
    filling2Id: string;
    toppingId: string;
  };
  sweets?: SweetSelection[];
};

export type OrderItem = {
  id: string;
  productType: 'CAKE' | 'SWEET';
  quantity: number;
  unitPrice: string | number;
  totalPrice: string | number;
  cakeDetail?: {
    dough: Dough;
    cakeSize: CakeSize;
    filling1: Filling;
    filling2: Filling;
    topping: Topping;
  } | null;
  sweetDetail?: {
    sweetType: SweetType;
    quantity: number;
    flavors: { sweetFlavor: SweetFlavor }[];
  } | null;
};

export type AdminOrder = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  totalPrice: string | number;
  depositPrice: string | number;
  remainingPrice: string | number;
  desiredDate: string;
  notes?: string | null;
  contactSnapshot?: {
    name?: string;
    phone?: string;
    email?: string | null;
    address?: string | null;
  };
  whatsappMessage?: string | null;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  items: OrderItem[];
  payments: PaymentRecord[];
  createdAt: string;
};

export type CustomerProfile = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  lastSeenAt: string;
};

export type CustomerOrder = AdminOrder & {
  contactSnapshot?: {
    name?: string;
    phone?: string;
    email?: string | null;
    address?: string | null;
  };
};

export type PaymentRecord = {
  id: string;
  orderId: string;
  amount: string | number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
};

export type CreatePaymentPayload = {
  amount: number;
  paymentMethod: PaymentMethod;
  status?: PaymentStatus;
  paidAt?: string;
};

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'OWNER' | 'ADMIN';
  };
};

generator client {  
  provider \= "prisma-client-js"  
}

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

enum UserRole {  
  OWNER  
  ADMIN  
}

enum OrderStatus {  
  NEW  
  WAITING\_DEPOSIT  
  DEPOSIT\_PAID  
  CONFIRMED  
  IN\_PRODUCTION  
  READY  
  DELIVERED  
  CANCELED  
}

enum ProductType {  
  CAKE  
  SWEET  
}

enum PaymentMethod {  
  PIX  
  CASH  
  CARD  
  BANK\_TRANSFER  
  OTHER  
}

enum PaymentStatus {  
  PENDING  
  PAID  
  CANCELED  
}

enum StoreStatus {  
  OPEN  
  CLOSED  
}

model User {  
  id           String   @id @default(uuid())  
  name         String  
  email        String   @unique  
  passwordHash String   @map("password\_hash")  
  role         UserRole @default(ADMIN)

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("users")  
}

model Customer {  
  id    String @id @default(uuid())  
  name  String  
  phone String @unique

  orders Order\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("customers")  
}

model Order {  
  id              String      @id @default(uuid())  
  orderCode       String      @unique @map("order\_code")  
  customerId      String      @map("customer\_id")  
  status          OrderStatus @default(NEW)  
  totalPrice      Decimal     @map("total\_price") @db.Decimal(10, 2\)  
  depositPrice    Decimal     @map("deposit\_price") @db.Decimal(10, 2\)  
  remainingPrice  Decimal     @map("remaining\_price") @db.Decimal(10, 2\)  
  desiredDate     DateTime    @map("desired\_date")  
  notes           String?  
  whatsappMessage String?     @map("whatsapp\_message")

  customer Customer        @relation(fields: \[customerId\], references: \[id\])  
  items    OrderItem\[\]  
  payments PaymentRecord\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@index(\[customerId\])  
  @@index(\[status\])  
  @@index(\[desiredDate\])  
  @@map("orders")  
}

model OrderItem {  
  id          String      @id @default(uuid())  
  orderId     String      @map("order\_id")  
  productType ProductType @map("product\_type")  
  quantity    Int  
  unitPrice   Decimal     @map("unit\_price") @db.Decimal(10, 2\)  
  totalPrice  Decimal     @map("total\_price") @db.Decimal(10, 2\)

  order       Order             @relation(fields: \[orderId\], references: \[id\], onDelete: Cascade)  
  cakeDetail  CakeOrderDetail?  
  sweetDetail SweetOrderDetail?

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@index(\[orderId\])  
  @@map("order\_items")  
}

model CakeOrderDetail {  
  id                String  @id @default(uuid())  
  orderItemId       String  @unique @map("order\_item\_id")  
  doughId           String  @map("dough\_id")  
  cakeSizeId        String  @map("cake\_size\_id")  
  filling1Id        String  @map("filling\_1\_id")  
  filling2Id        String  @map("filling\_2\_id")  
  toppingId         String  @map("topping\_id")  
  fillingExtraPrice Decimal @default(0) @map("filling\_extra\_price") @db.Decimal(10, 2\)

  orderItem OrderItem @relation(fields: \[orderItemId\], references: \[id\], onDelete: Cascade)  
  dough     Dough     @relation(fields: \[doughId\], references: \[id\])  
  cakeSize  CakeSize  @relation(fields: \[cakeSizeId\], references: \[id\])  
  filling1  Filling   @relation("CakeFilling1", fields: \[filling1Id\], references: \[id\])  
  filling2  Filling   @relation("CakeFilling2", fields: \[filling2Id\], references: \[id\])  
  topping   Topping   @relation(fields: \[toppingId\], references: \[id\])

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("cake\_order\_details")  
}

model SweetOrderDetail {  
  id          String @id @default(uuid())  
  orderItemId String @unique @map("order\_item\_id")  
  sweetTypeId String @map("sweet\_type\_id")  
  quantity    Int  
  maxFlavors  Int    @map("max\_flavors")

  orderItem OrderItem          @relation(fields: \[orderItemId\], references: \[id\], onDelete: Cascade)  
  sweetType SweetType          @relation(fields: \[sweetTypeId\], references: \[id\])  
  flavors   SweetOrderFlavor\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("sweet\_order\_details")  
}

model SweetOrderFlavor {  
  id                 String @id @default(uuid())  
  sweetOrderDetailId String @map("sweet\_order\_detail\_id")  
  sweetFlavorId      String @map("sweet\_flavor\_id")

  sweetOrderDetail SweetOrderDetail @relation(fields: \[sweetOrderDetailId\], references: \[id\], onDelete: Cascade)  
  sweetFlavor      SweetFlavor      @relation(fields: \[sweetFlavorId\], references: \[id\])

  createdAt DateTime @default(now()) @map("created\_at")

  @@unique(\[sweetOrderDetailId, sweetFlavorId\])  
  @@index(\[sweetFlavorId\])  
  @@map("sweet\_order\_flavors")  
}

model Dough {  
  id       String  @id @default(uuid())  
  name     String  
  colorHex String  @map("color\_hex")  
  isActive Boolean @default(true) @map("is\_active")

  cakeDetails CakeOrderDetail\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("doughs")  
}

model Filling {  
  id         String  @id @default(uuid())  
  name       String  
  extraPrice Decimal @default(0) @map("extra\_price") @db.Decimal(10, 2\)  
  colorHex   String  @map("color\_hex")  
  isActive   Boolean @default(true) @map("is\_active")

  cakeDetailsAsFilling1 CakeOrderDetail\[\] @relation("CakeFilling1")  
  cakeDetailsAsFilling2 CakeOrderDetail\[\] @relation("CakeFilling2")

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("fillings")  
}

model Topping {  
  id       String  @id @default(uuid())  
  name     String  
  colorHex String  @map("color\_hex")  
  isActive Boolean @default(true) @map("is\_active")

  cakeDetails CakeOrderDetail\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("toppings")  
}

model CakeSize {  
  id       String  @id @default(uuid())  
  slices   Int  
  price    Decimal @db.Decimal(10, 2\)  
  isActive Boolean @default(true) @map("is\_active")

  cakeDetails CakeOrderDetail\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("cake\_sizes")  
}

model SweetType {  
  id          String  @id @default(uuid())  
  name        String  
  pricePer100 Decimal @map("price\_per\_100") @db.Decimal(10, 2\)  
  isActive    Boolean @default(true) @map("is\_active")

  flavors      SweetFlavor\[\]  
  sweetDetails SweetOrderDetail\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("sweet\_types")  
}

model SweetFlavor {  
  id          String  @id @default(uuid())  
  name        String  
  sweetTypeId String  @map("sweet\_type\_id")  
  isActive    Boolean @default(true) @map("is\_active")

  sweetType    SweetType          @relation(fields: \[sweetTypeId\], references: \[id\])  
  orderFlavors SweetOrderFlavor\[\]

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@index(\[sweetTypeId\])  
  @@map("sweet\_flavors")  
}

model PaymentRecord {  
  id            String        @id @default(uuid())  
  orderId       String        @map("order\_id")  
  amount        Decimal       @db.Decimal(10, 2\)  
  paymentMethod PaymentMethod @map("payment\_method")  
  status        PaymentStatus @default(PENDING)  
  paidAt        DateTime?     @map("paid\_at")

  order Order @relation(fields: \[orderId\], references: \[id\], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@index(\[orderId\])  
  @@map("payment\_records")  
}

model Settings {  
  id             String      @id @default(uuid())  
  whatsappNumber String      @map("whatsapp\_number")  
  storeStatus    StoreStatus @default(OPEN) @map("store\_status")

  createdAt DateTime @default(now()) @map("created\_at")  
  updatedAt DateTime @updatedAt @map("updated\_at")

  @@map("settings")  
}


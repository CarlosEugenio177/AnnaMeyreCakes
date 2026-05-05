-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'WAITING_DEPOSIT', 'DEPOSIT_PAID', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CAKE', 'SWEET');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CASH', 'CARD', 'BANK_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED');

-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_code" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "total_price" DECIMAL(10,2) NOT NULL,
    "deposit_price" DECIMAL(10,2) NOT NULL,
    "remaining_price" DECIMAL(10,2) NOT NULL,
    "desired_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "whatsapp_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_type" "ProductType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cake_order_details" (
    "id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "dough_id" TEXT NOT NULL,
    "cake_size_id" TEXT NOT NULL,
    "filling_1_id" TEXT NOT NULL,
    "filling_2_id" TEXT NOT NULL,
    "topping_id" TEXT NOT NULL,
    "filling_extra_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cake_order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sweet_order_details" (
    "id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "sweet_type_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "max_flavors" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sweet_order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sweet_order_flavors" (
    "id" TEXT NOT NULL,
    "sweet_order_detail_id" TEXT NOT NULL,
    "sweet_flavor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sweet_order_flavors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doughs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color_hex" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "doughs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fillings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extra_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "color_hex" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "fillings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toppings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color_hex" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "toppings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cake_sizes" (
    "id" TEXT NOT NULL,
    "slices" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cake_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sweet_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_per_100" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sweet_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sweet_flavors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sweet_type_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sweet_flavors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_records" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payment_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "store_status" "StoreStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_code_key" ON "orders"("order_code");

-- CreateIndex
CREATE INDEX "orders_customer_id_idx" ON "orders"("customer_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_desired_date_idx" ON "orders"("desired_date");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "cake_order_details_order_item_id_key" ON "cake_order_details"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "sweet_order_details_order_item_id_key" ON "sweet_order_details"("order_item_id");

-- CreateIndex
CREATE INDEX "sweet_order_flavors_sweet_flavor_id_idx" ON "sweet_order_flavors"("sweet_flavor_id");

-- CreateIndex
CREATE UNIQUE INDEX "sweet_order_flavors_sweet_order_detail_id_sweet_flavor_id_key" ON "sweet_order_flavors"("sweet_order_detail_id", "sweet_flavor_id");

-- CreateIndex
CREATE INDEX "sweet_flavors_sweet_type_id_idx" ON "sweet_flavors"("sweet_type_id");

-- CreateIndex
CREATE INDEX "payment_records_order_id_idx" ON "payment_records"("order_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cake_order_details" ADD CONSTRAINT "cake_order_details_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cake_order_details" ADD CONSTRAINT "cake_order_details_dough_id_fkey" FOREIGN KEY ("dough_id") REFERENCES "doughs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cake_order_details" ADD CONSTRAINT "cake_order_details_cake_size_id_fkey" FOREIGN KEY ("cake_size_id") REFERENCES "cake_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cake_order_details" ADD CONSTRAINT "cake_order_details_filling_1_id_fkey" FOREIGN KEY ("filling_1_id") REFERENCES "fillings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cake_order_details" ADD CONSTRAINT "cake_order_details_filling_2_id_fkey" FOREIGN KEY ("filling_2_id") REFERENCES "fillings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cake_order_details" ADD CONSTRAINT "cake_order_details_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "toppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sweet_order_details" ADD CONSTRAINT "sweet_order_details_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sweet_order_details" ADD CONSTRAINT "sweet_order_details_sweet_type_id_fkey" FOREIGN KEY ("sweet_type_id") REFERENCES "sweet_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sweet_order_flavors" ADD CONSTRAINT "sweet_order_flavors_sweet_order_detail_id_fkey" FOREIGN KEY ("sweet_order_detail_id") REFERENCES "sweet_order_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sweet_order_flavors" ADD CONSTRAINT "sweet_order_flavors_sweet_flavor_id_fkey" FOREIGN KEY ("sweet_flavor_id") REFERENCES "sweet_flavors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sweet_flavors" ADD CONSTRAINT "sweet_flavors_sweet_type_id_fkey" FOREIGN KEY ("sweet_type_id") REFERENCES "sweet_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

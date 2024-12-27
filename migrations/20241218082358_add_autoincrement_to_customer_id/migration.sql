-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "user_id" TEXT NOT NULL,
    "customer_id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20),
    "address" VARCHAR(200),
    "city" VARCHAR(100),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "destination_id" INTEGER NOT NULL,
    "country_name" VARCHAR(100) NOT NULL,
    "city_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "average_temperature" DECIMAL(5,2),
    "currency" VARCHAR(50),

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("destination_id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "hotel_id" INTEGER NOT NULL,
    "hotel_name" VARCHAR(150) NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "star_rating" "Rating",
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "description" TEXT,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("hotel_id")
);

-- CreateTable
CREATE TABLE "flights" (
    "flight_id" INTEGER NOT NULL,
    "departure_airport" VARCHAR(100) NOT NULL,
    "arrival_airport" VARCHAR(100) NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "arrival_date" TIMESTAMP(3) NOT NULL,
    "flight_duration" INTEGER NOT NULL,
    "flight_number" VARCHAR(20) NOT NULL,
    "airline_code" VARCHAR(10) NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("flight_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "activities" (
    "activity_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "activity_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "cost" DECIMAL(8,2) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "rating" "Rating" NOT NULL,
    "comment" TEXT,
    "review_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("destination_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("destination_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

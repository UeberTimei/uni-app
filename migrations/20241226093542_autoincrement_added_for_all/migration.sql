-- AlterTable
CREATE SEQUENCE activities_activity_id_seq;
ALTER TABLE "activities" ALTER COLUMN "activity_id" SET DEFAULT nextval('activities_activity_id_seq');
ALTER SEQUENCE activities_activity_id_seq OWNED BY "activities"."activity_id";

-- AlterTable
CREATE SEQUENCE bookings_booking_id_seq;
ALTER TABLE "bookings" ALTER COLUMN "booking_id" SET DEFAULT nextval('bookings_booking_id_seq');
ALTER SEQUENCE bookings_booking_id_seq OWNED BY "bookings"."booking_id";

-- AlterTable
CREATE SEQUENCE destinations_destination_id_seq;
ALTER TABLE "destinations" ALTER COLUMN "destination_id" SET DEFAULT nextval('destinations_destination_id_seq');
ALTER SEQUENCE destinations_destination_id_seq OWNED BY "destinations"."destination_id";

-- AlterTable
CREATE SEQUENCE flights_flight_id_seq;
ALTER TABLE "flights" ALTER COLUMN "flight_id" SET DEFAULT nextval('flights_flight_id_seq');
ALTER SEQUENCE flights_flight_id_seq OWNED BY "flights"."flight_id";

-- AlterTable
CREATE SEQUENCE hotels_hotel_id_seq;
ALTER TABLE "hotels" ALTER COLUMN "hotel_id" SET DEFAULT nextval('hotels_hotel_id_seq');
ALTER SEQUENCE hotels_hotel_id_seq OWNED BY "hotels"."hotel_id";

-- AlterTable
CREATE SEQUENCE reviews_review_id_seq;
ALTER TABLE "reviews" ALTER COLUMN "review_id" SET DEFAULT nextval('reviews_review_id_seq');
ALTER SEQUENCE reviews_review_id_seq OWNED BY "reviews"."review_id";

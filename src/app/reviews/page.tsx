import prisma from "@/lib/prisma";
import ReviewCard from "../components/ReviewCard";

async function getReviews() {
  const reviews = await prisma.review.findMany({
    where: {
      Comment: { not: null },
    },
    include: {
      Customer: {
        select: { FirstName: true, LastName: true },
      },
      Booking: {
        include: {
          Hotel: {
            include: {
              Destination: {
                select: { CountryName: true, CityName: true },
              },
            },
          },
        },
      },
    },
  });

  return reviews;
}

export default async function Reviews() {
  const reviews = await getReviews();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold">Отзывы</h1>
      <div className="flex flex-wrap justify-center max-w-full">
        {reviews.map((review) => {
          const date = new Date(review.ReviewDate).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          return (
            <ReviewCard
              key={review.ReviewID}
              FirstName={review?.Customer?.FirstName}
              LastName={review?.Customer?.LastName}
              CountryName={review?.Booking?.Hotel.Destination.CountryName}
              CityName={review?.Booking?.Hotel.Destination.CityName}
              Rating={review.Rating}
              Comment={review.Comment ?? ""}
              ReviewDate={date}
            />
          );
        })}
      </div>
    </div>
  );
}

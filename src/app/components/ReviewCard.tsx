type ReviewProps = {
  FirstName: string;
  LastName: string;
  CountryName: string;
  CityName: string;
  Rating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  Comment: string;
  ReviewDate: string;
};

export default function Review({
  FirstName,
  LastName,
  CountryName,
  CityName,
  Rating,
  Comment,
  ReviewDate,
}: ReviewProps) {
  const convertRatingToNumber = (textRating: string) => {
    const ratingMap = {
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
    };

    return ratingMap[textRating as keyof typeof ratingMap] || 0;
  };

  const numericRating = convertRatingToNumber(Rating);

  return (
    <div className="max-w-md mx-auto my-6 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            {FirstName} {LastName}
          </h4>
          <p className="text-sm text-gray-500">
            {CityName}, {CountryName}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{Comment}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-1 flex-row">
          <span className="text-yellow-400 flex">
            {Array.from({ length: numericRating }).map((_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.435L24 9.351l-6 5.849 1.416 8.258L12 18.902l-7.416 4.556L6 15.2 0 9.351l8.332-1.329L12 .587z" />
              </svg>
            ))}
          </span>
          <span className="text-sm text-gray-600">({numericRating} / 5)</span>
        </div>
        <p className="text-xs text-gray-400 ml-5">{ReviewDate}</p>
      </div>
    </div>
  );
}

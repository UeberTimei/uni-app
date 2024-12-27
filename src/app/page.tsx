"use client";

import Link from "next/link";
import React from "react";

const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">
          Добро пожаловать на сайт туристического оператора
        </h1>
      </header>
      <section className="text-center max-w-lg mx-auto">
        <p className="text-lg text-gray-700 mb-6">
          Мы рады приветствовать вас на платформе, где вы можете найти и
          забронировать лучшие туры для отдыха и путешествий. Ознакомьтесь с
          нашими предложениями, доступными для путешествий по всему миру.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          <Link href="/destinations" className="text-white hover:text-gray-400">
            Посмотреть направления
          </Link>
        </button>
      </section>
    </div>
  );
};

export default WelcomePage;

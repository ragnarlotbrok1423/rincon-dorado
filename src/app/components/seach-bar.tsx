"use client";

import { Search } from "@deemlol/next-icons";
import { useState } from "react";
import BookCardSimple from "./book-card";

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  image_url: string;
  age: string;
};

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const endpoint =
        searchTerm.trim() === ""
          ? "http://localhost:3001/books" // o el endpoint real que trae todos los libros
          : `http://localhost:3001/getbooksbytitle/${searchTerm}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Error al buscar el libro");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error:", error);
      setBooks([]);
    }
  };

  return (
    <div>
      <form
        className="flex items-center max-w-sm mx-auto bg-white"
        onSubmit={handleSubmit}
      >
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search size={24} color="#D0D0D0" />
          </div>
          <input
            type="text"
            id="simple-search"
            value={searchTerm}
            onChange={handleInputChange}
            className="bg-gray-50 border drop-shadow-xl border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
            placeholder="Busca Un Libro ..."
          />
        </div>
        <button
          type="submit"
          className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Buscar un Libro</span>
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCardSimple
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            image_url={book.image_url}
            age={book.age}
          />
        ))}
      </div>
    </div>
  );
}

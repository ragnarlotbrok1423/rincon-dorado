"use client";

import BookCardSimple from "@/app/components/book-card";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image_url: string;
  age: string;
}

export default function Card() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/getallbooks")
      .then((response) => response.json())
      .then((books) => {
        setBooks(books);
      });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books?.map((book) => (
            <BookCardSimple key={book.id} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
}

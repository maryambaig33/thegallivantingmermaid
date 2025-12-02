import React from 'react';
import { Bookstore } from '../types';

interface BookstoreCardProps {
  store: Bookstore;
}

export const BookstoreCard: React.FC<BookstoreCardProps> = ({ store }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-stone-200">
        <img 
          src={store.image} 
          alt={store.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-serif text-2xl font-medium tracking-wide">{store.name}</h3>
          <p className="text-xs font-light text-stone-200">{store.address}</p>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-4 text-sm leading-relaxed text-stone-600 font-sans">
          {store.description}
        </p>
        
        <div className="mt-auto flex flex-wrap gap-2">
          {store.tags.map((tag) => (
            <span 
              key={tag} 
              className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-stone-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

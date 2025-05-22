'use client';

import React, { ReactNode } from 'react';
import { Freckle_Face } from 'next/font/google';

const freckleFace = Freckle_Face({ subsets: ['latin'], weight: ['400'] });

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 bg-black flex flex-col items-center justify-center p-8">
        <h1
          className={`text-white text-[10rem] leading-none ${freckleFace.className}`}
        >
          M.
        </h1>
        <p className="mt-4 text-white text-sm">Inovação ao Seu Alcance.</p>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
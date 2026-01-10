// app/layout.tsx

import type { Metadata } from 'next';
import { Tiro_Bangla } from 'next/font/google';

const tiroBangla = Tiro_Bangla({
  weight: ['400'],       // Tiro Bangla only supports 400
  style: ['normal', 'italic'],
  subsets: ['bengali'],
  display: 'swap',
});




export const metadata: Metadata = {
  title: 'Castle Tent House',
  description: 'Baby toys bd',
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={tiroBangla.className}>
      {children}
    </div>
  );
}

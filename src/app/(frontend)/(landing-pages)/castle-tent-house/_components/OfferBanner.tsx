'use client';

import { useEffect, useState } from 'react';

const OFFER_MAP = [10, 8, 6, 5, 4, 3];
const OFFER_DURATION_MS = 3 * 60 * 1000;

function getRemainingTime(end: number) {
  const diff = end - Date.now();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { minutes, seconds, valid: diff > 0 };
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/`;
}

export default function OfferBanner() {
  const [offer, setOffer] = useState(0);
  const [offerExpired, setOfferExpired] = useState(false);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0, valid: true });

  useEffect(() => {
    const visitCount = parseInt(localStorage.getItem('visit_count') || '0', 10);
    const newCount = visitCount + 1;

    const offerPercent = OFFER_MAP[Math.min(visitCount, OFFER_MAP.length - 1)];
    setOffer(offerPercent);
    localStorage.setItem('visit_count', newCount.toString());

    const offerExpiry = Date.now() + OFFER_DURATION_MS;

    setCookie('offer', offerPercent.toString(), OFFER_DURATION_MS / 1000);
    setCookie('offer_expiry', offerExpiry.toString(), OFFER_DURATION_MS / 1000);

    const interval = setInterval(() => {
      const { minutes, seconds, valid } = getRemainingTime(offerExpiry);
      setTimer({ minutes, seconds, valid });

      if (!valid) {
        setOffer(0); // Reset the offer
        setOfferExpired(true);
        setCookie('offer', '0', 0); // Clear offer cookie
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white text-center py-6 px-6 rounded-md shadow-lg text-2xl md:text-3xl font-semibold">
      {offerExpired ? (
        <div>
          ⚠️ Oops! Your exclusive offer just expired. <br />
          <span className="text-white/90 text-lg font-normal mt-2 block">
            Don’t worry — our best toys are still waiting for you! Order now before they sell out! 🎁
          </span>
        </div>
      ) : (
        <div>
          🎉 You have a special Extra <span className="font-bold">{offer}%</span> discount!
          <br />
          <span className="text-white/90 text-lg font-normal mt-2 block">
            Offer expires in{' '}
            <span className="font-bold">
              {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
            </span>
            — grab your favorite toy now!
          </span>
        </div>
      )}
    </div>
  );
}

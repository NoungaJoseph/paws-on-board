"use client";
import { useEffect, useState } from "react";
import snapshot from "./rates.json";
export const markets = {
  AU: { name: "Australia", currency: "AUD" },
  US: { name: "USA", currency: "USD" },
  CA: { name: "Canada", currency: "CAD" },
} as const;
export type Market = keyof typeof markets;
export function useCurrency() {
  const [market, setMarket] = useState<Market>("AU");
  const [rates, setRates] = useState(snapshot);
  const [live, setLive] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pob-market");
      if (saved && saved in markets) setMarket(saved as Market);
    } catch {}
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch("https://api.frankfurter.dev/v1/latest?base=AUD&symbols=USD,CAD", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Rates unavailable");
        return r.json();
      })
      .then((r) => {
        if (
          r.base === "AUD" &&
          /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
          Number.isFinite(r.rates?.USD) &&
          Number.isFinite(r.rates?.CAD) &&
          r.rates.USD > 0 &&
          r.rates.CAD > 0
        ) {
          setRates(r);
          setLive(true);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);
  const currency = markets[market].currency;
  const rate = currency === "AUD" ? 1 : rates.rates[currency];
  const minor = (aud: number) => Math.round(aud * rate * 100);
  const formatMinor = (cents: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: currency === "AUD" ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  function selectMarket(value: Market) {
    setMarket(value);
    try {
      localStorage.setItem("pob-market", value);
    } catch {}
  }
  return {
    market,
    currency,
    selectMarket,
    minor,
    formatMinor,
    money: (aud: number) => formatMinor(minor(aud)),
    rateDate: rates.date,
    live,
  };
}

"use client";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function AnimalAnim({ src, size = 120 }: { src: string; size?: number }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(src).then((r) => r.json()).then(setData); }, [src]);
  if (!data) return <div style={{ width: size, height: size }} />;
  return <Lottie animationData={data} loop style={{ width: size, height: size }} />;
}

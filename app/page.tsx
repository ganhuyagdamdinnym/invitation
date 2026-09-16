"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const HEART_EMOJIS = ["♡", "✿", "♥", "❀"];

export default function Home() {
  const [answered, setAnswered] = useState(false);
  const [noPos, setNoPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [petals, setPetals] = useState<
    {
      id: number;
      left: number;
      delay: number;
      duration: number;
      emoji: string;
      color: string;
    }[]
  >([]);

  const stageRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  function moveNoButton() {
    const stage = stageRef.current;
    const yesBtn = yesRef.current;
    const noBtn = noRef.current;
    if (!stage || !yesBtn || !noBtn) return;

    const stageRect = stage.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;

    const maxLeft = stageRect.width - btnW;
    const maxTop = stageRect.height - btnH;

    // minimum gap (px) the "no" button must keep from the "yes" button's center
    const minDistance = yesRect.width;

    let left = 0;
    let top = 0;
    let tries = 0;

    do {
      left = Math.random() * Math.max(maxLeft, 0);
      top = Math.random() * Math.max(maxTop, 0);
      const centerX = left + btnW / 2;
      const centerY = top + btnH / 2;
      const yesCenterX = yesRect.left - stageRect.left + yesRect.width / 2;
      const yesCenterY = yesRect.top - stageRect.top + yesRect.height / 2;
      const dist = Math.hypot(centerX - yesCenterX, centerY - yesCenterY);
      tries++;
      if (dist >= minDistance || tries > 20) break;
    } while (true);

    setNoPos({ top, left });
  }

  function handleYes() {
    setAnswered(true);

    emailjs
      .send(
        "service_9t2lq3h",
        "template_XXXXXXX", // ← Email Templates хэсгээс жинхэнэ Template ID-гаараа солино уу
        {
          message:
            "Тэр «Тийм, явъя» товчийг дарлаа! 🎉 Маргаа 19:00 цагт Zaisan Hill Complex дээр «Hope» кино үзэхээр тохирлоо.",
          user_name: "Урилга",
        },
        "ic9beXu_eVYEglZqF",
      )
      .catch(() => {
        // silent — the reveal still shows even if the email fails
      });

    const newPetals = Array.from({ length: 26 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: i * 0.09,
      duration: 3 + Math.random() * 2.5,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      color: Math.random() > 0.5 ? "text-orange-300" : "text-pink-300",
    }));
    setPetals(newPetals);
    setTimeout(() => setPetals([]), 6500);
  }

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-fuchsia-700 via-purple-700 to-orange-500">
      {/* ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-500/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-orange-400/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-64 w-64 rounded-full bg-fuchsia-400/30 blur-3xl" />

      {/* falling petals */}
      {petals.map((p) => (
        <span
          key={p.id}
          className={`pointer-events-none absolute top-[-40px] ${p.color} animate-fall`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${14 + Math.random() * 16}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <main
        ref={stageRef}
        className="relative z-10 h-[420px] w-[min(600px,92vw)] overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-10 py-12 text-center shadow-2xl backdrop-blur-md"
      >
        {!answered ? (
          <>
            <p className="mb-4 text-sm font-medium tracking-wide text-orange-200">
              Төрсөн өдрийн мэнд хүргэе, хөөрхөн минь 🎂 💋
            </p>
            <h1 className="mb-4 font-serif text-2xl font-semibold leading-tight text-white sm:text-5xl">
              Хайрыгаа маргааш {""}
              <span className="bg-gradient-to-r from-orange-300 via-pink-300 to-fuchsia-300 bg-clip-text italic text-transparent">
                кинонд
              </span>{" "}
              урьж байна
            </h1>
            <p className="mx-auto mb-12 max-w-md text-base leading-7 text-purple-100">
              {/* Zaisan Hill Complex-д орой 19:00 цагт «Hope» кино үзье гэж бодлоо. */}
              Хариулаад үз — гэхдээ нэг товчлуур арай ичимхий шүү.
            </p>

            <div className="flex h-16 items-center justify-center">
              <button
                ref={yesRef}
                onClick={handleYes}
                className="rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-9 py-4 text-base font-semibold text-white shadow-lg shadow-pink-900/40 transition-transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                Тийм, явъя
              </button>

              <button
                ref={noRef}
                onMouseEnter={moveNoButton}
                onClick={(e) => {
                  e.preventDefault();
                  moveNoButton();
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  moveNoButton();
                }}
                style={
                  noPos
                    ? {
                        position: "absolute",
                        top: `${noPos.top}px`,
                        left: `${noPos.left}px`,
                      }
                    : undefined
                }
                className={`${
                  noPos ? "" : "relative ml-4"
                } rounded-full border border-white/40 px-9 py-4 text-base font-semibold text-purple-100 transition-colors hover:text-white`}
              >
                Бодмоор байна
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center animate-riseIn">
            <span className="mb-5 text-5xl">♡</span>
            <h2 className="mb-3 font-serif text-3xl italic text-orange-200 sm:text-4xl">
              За, тохирлоо.
            </h2>
            <p className="max-w-sm text-base leading-7 text-purple-100">
              Тэгвэл маргааш орой 19:00 цагт Zaisan Hill Complex дээр уулзъя —
              «Hope» кино чамд таалагдана гэдэгт итгэлтэй байна.
            </p>
            <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Нарнаас том хайртай шүү, үнжий 😘 🫶
            </h1>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fall {
          0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg);
          }
          10% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translateY(110vh) rotate(300deg);
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-riseIn {
          animation: riseIn 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}

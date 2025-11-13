import React, { useState, useEffect, useRef } from "react";

interface Session {
  date: string;
}

export default function Pomodoro() {
  const [time, setTime] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem("pomodoroSessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [totalFocus, setTotalFocus] = useState<number>(() => {
    const saved = localStorage.getItem("pomodoroTotal");
    return saved ? JSON.parse(saved) : 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSound = new Audio("/sounds/start.mp3");
  const stopSound = new Audio("/sounds/stop.mp3");
  const endSound = new Audio("/sounds/end.mp3");

  const totalTime = mode === "focus" ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - time) / totalTime) * 100;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            endSound.play();
            setIsRunning(false);

            if (mode === "focus") {
              addSession();
              setMode("break");
              setTime(5 * 60);
            } else {
              setMode("focus");
              setTime(25 * 60);
            }
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const toggleTimer = () => {
    if (isRunning) {
      stopSound.play();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      startSound.play();
    }
    setIsRunning(!isRunning);
  };

  const addSession = () => {
    const today = new Date().toISOString().split("T")[0];
    const updated = [...sessions, { date: today }];
    setSessions(updated);
    localStorage.setItem("pomodoroSessions", JSON.stringify(updated));

    const newTotal = totalFocus + 25;
    setTotalFocus(newTotal);
    localStorage.setItem("pomodoroTotal", JSON.stringify(newTotal));
  };

  const getTodayCount = (): number => {
    const today = new Date().toISOString().split("T")[0];
    return sessions.filter((s) => s.date === today).length;
  };

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-yellow-400">
      <h1 className="text-3xl font-semibold mb-4">
        {mode === "focus" ? "Focus Session" : "Break Time"}
      </h1>

      <p className="mb-4 text-gray-300">
        🕒 Total Focus Today:{" "}
        <span className="text-yellow-400 font-bold">
          {Math.floor(totalFocus / 60)}h {totalFocus % 60}m
        </span>
      </p>

      <div className="text-6xl font-bold mb-6 text-white tracking-wider">
        {minutes}:{seconds}
      </div>

      <div className="w-72 h-3 bg-gray-800 rounded-full mb-6 overflow-hidden border border-yellow-600">
        <div
          className="h-full bg-yellow-500 transition-all duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="px-6 py-3 rounded-2xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setTime(25 * 60);
            setMode("focus");
            stopSound.play();
          }}
          className="px-6 py-3 rounded-2xl border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all"
        >
          Reset
        </button>
      </div>

      <div className="mt-10 text-sm text-gray-400">
        {mode === "focus"
          ? "Stay focused and avoid distractions."
          : "Take a short break to recharge."}
      </div>

      <div className="mt-12 bg-neutral-900 p-6 rounded-2xl border border-yellow-500 shadow-md w-[300px]">
        <h2 className="text-xl font-semibold mb-2 text-yellow-400">
          Today's Focus Sessions
        </h2>
        <p className="text-gray-300">
          ✅ You completed{" "}
          <span className="text-yellow-400 font-bold">{getTodayCount()}</span>{" "}
          sessions today.
        </p>
      </div>
    </div>
  );
}

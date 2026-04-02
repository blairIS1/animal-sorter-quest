"use client";
import { createContext, useContext } from "react";

export type Mode = "kid" | "toddler";

type GameContext = { mode: Mode; robotName: string };

export const ModeContext = createContext<GameContext>({ mode: "kid", robotName: "Robi" });
export const useMode = () => useContext(ModeContext).mode;
export const useRobotName = () => useContext(ModeContext).robotName;

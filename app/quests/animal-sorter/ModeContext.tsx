"use client";
import { createContext, useContext } from "react";

export type Mode = "kid" | "toddler";

export const ModeContext = createContext<Mode>("kid");
export const useMode = () => useContext(ModeContext);

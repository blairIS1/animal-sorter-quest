"use client";
import { createContext, useContext } from "react";

export type Mode = "baker" | "eva";

export const ModeContext = createContext<Mode>("baker");
export const useMode = () => useContext(ModeContext);

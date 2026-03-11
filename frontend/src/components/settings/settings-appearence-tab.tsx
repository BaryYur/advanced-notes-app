import { useTheme } from "@/context";

import { ThemeIcon } from "../settings";

import { motion, AnimatePresence } from "framer-motion";

import { Check } from "lucide-react";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "black", label: "Black" },
  { value: "system", label: "System" },
] as const;

export const SettingsAppearenceTab = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p className="text-lg font-medium">Appearance</p>
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-sm">Themes</p>

        <div className="flex flex-wrap justify-between gap-2">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="flex flex-col items-start gap-2"
            >
              <div
                className={`${themeOption.value === theme ? "border-blue-500" : "border-transparent"} rounded-lg border-2`}
              >
                <ThemeIcon theme={themeOption.value} />
              </div>
              <span
                className={`${themeOption.value === theme ? "text-blue-500" : ""} flex items-center gap-2 text-xs`}
              >
                <AnimatePresence>
                  {themeOption.value === theme && (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {themeOption.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

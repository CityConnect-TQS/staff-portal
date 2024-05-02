// app/components/ThemeSwitcher.tsx
"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import {MoonIcon} from "./moonIcon";
import {SunIcon} from "./sunIcon";
import {Button} from "@nextui-org/react";
import { MaterialSymbol } from "react-material-symbols";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  if (!mounted) return null;

  return (
    <div>
      <Button isIconOnly variant="ghost" className="border-none" onClick={switchTheme}>
        {theme === 'light'? (
          <SunIcon />
        ) : theme === 'dark'? (
          <MoonIcon />
        ) : (
          <MaterialSymbol  icon="computer" size={16} /> 
        )}
      </Button>
    </div>
  );
}
// app/components/ThemeSwitcher.tsx
"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import {MoonIcon} from "./moonIcon";
import {SunIcon} from "./sunIcon";
import {Button} from "@nextui-org/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
        <Button isIconOnly variant="ghost" className="border-none" onClick={() => theme === 'light' ? setTheme('dark') : setTheme('light')}>
          {theme === 'light' ? (
            <SunIcon />
            ) : (
            <MoonIcon/>
            )}
        </Button>

    </div>
  )
}
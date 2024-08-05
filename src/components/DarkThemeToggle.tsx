import { useTheme } from '@root/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import env from '@root/environment';
import { Switch } from './ui/switch';

const DarkThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const onThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  if (env.darkModeToggle === 'false') {
    return null;
  }

  return (
    <div className="p-2 flex items-center justify-center gap-2">
      <Sun className="w-5 h-5" />
      <Switch
        id="dark-mode"
        className="h-6 w-11"
        disabled={theme === 'system'}
        slotProps={{
          thumb: {
            className: 'w-3 h-3 data-[state=checked]:translate-x-5',
          },
        }}
        onCheckedChange={onThemeChange}
        checked={theme === 'dark'}
      />
      <Moon className="w-5 h-5" />
    </div>
  );
};

export default DarkThemeToggle;

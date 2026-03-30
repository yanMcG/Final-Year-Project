import React, { createContext, useState, useContext } from 'react';

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Define theme colors based on dark mode state
  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: isDarkMode
      ? {
          background: '#1a1a1a',
          card: '#2c2c2c',
          text: '#f0f0f0',
          subText: '#aaa',
          border: '#444',
          header: '#111',
          tabBar: '#1a1a1a',
          tabBarActive: '#fff',
          tabBarInactive: '#888',
          inputBg: '#333',
          inputBorder: '#555',
        }
      : {
          background: '#f8f9fa',
          card: '#fff',
          text: '#232526',
          subText: '#888',
          border: '#e0e0e0',
          header: '#232526',
          tabBar: '#fff',
          tabBarActive: '#111',
          tabBarInactive: 'gray',
          inputBg: '#fafafa',
          inputBorder: '#ccc',
        },
  };

  return (
    <DarkModeContext.Provider value={theme}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}

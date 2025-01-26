import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme } from '../theme/theme';
import * as SecureStore from 'expo-secure-store';

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'user_theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await SecureStore.getItemAsync(THEME_KEY);
                if (savedTheme) {
                    setIsDark(savedTheme === 'dark');
                } else {
                    setIsDark(systemColorScheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        };

        loadTheme();
    }, [systemColorScheme]);

    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        try {
            await SecureStore.setItemAsync(THEME_KEY, newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
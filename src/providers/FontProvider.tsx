import { useFonts } from 'expo-font';
import { createContext, useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Create a context to manage font loading status
const FontContext = createContext<boolean>(false);

// Custom hook to use the font loading status
export const useFontContext = () => {
    return useContext(FontContext);
};

const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fontsLoaded] = useFonts({
        'CustomFont': require('../../assets/fonts/Roboto-Bold.ttf'),
    });

  // If fonts are not loaded, show a loading indicator
    if (!fontsLoaded) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        );
    }

  // Provide font loading status to the rest of the app
    return <FontContext.Provider value={fontsLoaded}>{children}</FontContext.Provider>;
};

export default FontProvider;

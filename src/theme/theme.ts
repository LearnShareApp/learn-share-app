export type Theme = {
colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    buttonText: string;
};
};

export const lightTheme: Theme = {
colors: {
    primary: '#C9A977',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    notification: '#ccc',
    error: '#ff0000',
    success: '#8c8',
    buttonText: '#ffffff'
}
};

export const darkTheme: Theme = {
colors: {
    primary: '#A98957',
    background: '#1a1a1a',
    card: '#2a2a2a',
    text: '#ffffff',
    border: '#404040',
    notification: '#404040',
    error: '#ff4444',
    success: '#44bb44',
    buttonText: '#ffffff'
}
};
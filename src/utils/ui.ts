export const languages = {
    en: "English",
    fr: "Français",
};

export const defaultLanguage = "en";

export const getSupportedLanguages: () => string[] = () => [...Object.keys(languages)];

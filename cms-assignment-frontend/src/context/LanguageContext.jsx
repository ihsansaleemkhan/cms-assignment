import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const STORAGE_KEY = "public_language";

const LanguageContext = createContext(null);

export const LanguageProvider = ({
    children,
}) => {

    const [language, setLanguage] = useState(() => {

        const savedLanguage =
            localStorage.getItem(STORAGE_KEY);

        return savedLanguage === "ar"
            ? "ar"
            : "en";

    });

    const isArabic = language === "ar";

    useEffect(() => {

        localStorage.setItem(
            STORAGE_KEY,
            language
        );

        document.documentElement.lang =
            language;

        document.documentElement.dir =
            isArabic
                ? "rtl"
                : "ltr";

        document.body.dir =
            isArabic
                ? "rtl"
                : "ltr";

    }, [
        language,
        isArabic,
    ]);

    const changeLanguage = (
        nextLanguage
    ) => {

        if (
            nextLanguage !== "en" &&
            nextLanguage !== "ar"
        ) {
            return;
        }

        setLanguage(nextLanguage);

    };

    const toggleLanguage = () => {

        setLanguage(
            (currentLanguage) =>
                currentLanguage === "en"
                    ? "ar"
                    : "en"
        );

    };

    const value = useMemo(
        () => ({
            language,
            isArabic,
            direction:
                isArabic
                    ? "rtl"
                    : "ltr",
            changeLanguage,
            toggleLanguage,
        }),
        [
            language,
            isArabic,
        ]
    );

    return (

        <LanguageContext.Provider
            value={value}
        >
            {children}
        </LanguageContext.Provider>

    );

};

export const useLanguage = () => {

    const context =
        useContext(LanguageContext);

    if (!context) {

        throw new Error(
            "useLanguage must be used inside LanguageProvider."
        );

    }

    return context;

};

export default LanguageContext;
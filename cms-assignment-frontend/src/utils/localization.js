export const getLocalizedValue = (
    item,
    field,
    language
) => {

    if (!item) {
        return "";
    }

    if (language === "ar") {

        const arabicValue =
            item[`${field}_ar`];

        if (
            typeof arabicValue === "string" &&
            arabicValue.trim()
        ) {
            return arabicValue;
        }

    }

    return item[field] ?? "";

};

export const getLocalizedTitle = (
    item,
    language
) => {

    return getLocalizedValue(
        item,
        "title",
        language
    );

};

export const getLocalizedBody = (
    item,
    language
) => {

    return getLocalizedValue(
        item,
        "body",
        language
    );

};
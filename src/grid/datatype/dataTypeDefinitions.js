export const dataTypeDefinitions = {
    text: {
        baseDataType: "text",
        extendsDataType: "text",
    },
    dateString: {
        baseDataType: "dateString",
        extendsDataType: "dateString",
        valueParser: (params) => params.newValue != null && params.newValue.match("\\d{2}/\\d{2}/\\d{4}") ? params.newValue : null,
        valueFormatter: (params) => params.value == null ? "" : params.value,
        dataTypeMatcher: (value) => typeof value === "string" && !!value.match("\\d{2}/\\d{2}/\\d{4}"),
        dateParser: (value) => {
            if (!value) return undefined;
            const [day, month, year] = value.split("/");
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        },
        dateFormatter: (value) => {
            if (!value) return undefined;
            const day = String(value.getDate()).padStart(2, '0');
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const year = value.getFullYear();
            return `${day}/${month}/${year}`;
        },
    },
    number: {
        baseDataType: "number",
        extendsDataType: "number",
    },
};
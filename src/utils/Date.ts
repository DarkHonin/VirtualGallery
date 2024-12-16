export const formatISODate = (isoDate: string) => {
    const date = new Date(Date.parse(isoDate));

    return [date.getDate(), date.getMonth(), date.getFullYear()].join("-") +
        " " +
        ([date.getHours(), date.getMinutes().toString().padStart(2, "0")].join(
            ":",
        ));
};

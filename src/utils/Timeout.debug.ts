import { useEnvironmentFlag } from "./env.flags";

export const debugTimeout = (flagName: string, time: number) => {
    if (useEnvironmentFlag(flagName)) {
        return new Promise((y) =>
            setTimeout(() => {
                y(true);
            }, time)
        );
    }
    return new Promise((y) => y(true));
};

import { useEnvironmentFlag } from "./env.flags";

export const useDebugLogger = (flagName: string) => {
    const flag = useEnvironmentFlag(flagName);
    const time = new Date(Date.now()).toLocaleString();
    return (...args: any[]) => {
        flag
            ? console.log(
                `${time}||${flagName.replace("VITE_", "")}::`,
                ...args,
            )
            : undefined;
    };
};

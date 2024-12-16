import {
    DEBUG_AUTH_FLAG,
    ENABLE_MOCK_DATA,
    ENABLE_POST_RENAME,
} from "./Flags.list";

export const useEnvironmentFlag = (envName: string) => {
    if (!import.meta.env[envName]) return false;
    return ["1", "true", "yes"].some((e) =>
        import.meta.env[envName].toLowerCase() == e
    );
};

export const ENABLE_REGISTER = useEnvironmentFlag("VITE_ENABLE_REGISTER");
export const ENABLE_LOGIN = useEnvironmentFlag("VITE_ENABLE_LOGIN");
export const DEBUG_AUTH = useEnvironmentFlag(DEBUG_AUTH_FLAG);
export const POST_RENAME = useEnvironmentFlag(ENABLE_POST_RENAME);
export const MACK_DATA = useEnvironmentFlag(ENABLE_MOCK_DATA);

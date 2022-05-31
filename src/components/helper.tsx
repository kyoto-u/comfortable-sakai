import { useMemo } from "react";
import { i18nMessage } from "../features/chrome";

export function useTranslation(tag: string): string {
    return useMemo(() => {
        return i18nMessage(tag);
    }, []);
}

export function useTranslationDeps(tag: string, deps: React.DependencyList) {
    return useMemo(() => {
        return i18nMessage(tag);
    }, deps);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTranslationArgsDeps(tag: string, args: any[], deps: React.DependencyList) {
    return useMemo(() => {
        return i18nMessage(tag, args);
    }, deps);
}

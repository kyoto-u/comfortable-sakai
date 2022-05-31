import { MODE } from "../../constant";

import messages from "../../../_locales/en/messages.json";

export function i18nMessage(messageName: string, substitutions?: string | string[]): string {
    if (MODE === "development") {
        // @ts-ignore
        const p = messages[messageName].message;
        const regex = /\$.+?\$/gm;
        let i = 0;
        console.log(p, messageName);
        return p.replace(regex, () => {
            i += 1;
            // @ts-ignore
            return substitutions[i - 1];
        });
    } else {
        return chrome.i18n.getMessage(messageName, substitutions);
    }
}

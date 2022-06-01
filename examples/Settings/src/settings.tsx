import React from "react";
import { createRoot } from 'react-dom/client';


// import { Settings } from "@das08/comfortable-sakai-component/src/features/setting/types";

import "./comfortable-sakai.css";
import { SettingsTab } from "../../../src/components/settings";
import { Settings } from "../../../src/features/setting/types";

export default function App() {
    const settings = new Settings();
    return (
        <SettingsTab
            settings={settings}
            onSettingsChange={() => {
                return null;
            }}
        />
    );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);
root.render(<App />);

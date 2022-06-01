import React from "react";
import { createRoot } from 'react-dom/client';

import { Settings } from "@das08/comfortable-sakai-component/src/features/setting/types";
import { SettingsTab } from "@das08/comfortable-sakai-component/src/components/settings";

import "./comfortable-sakai.css";

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

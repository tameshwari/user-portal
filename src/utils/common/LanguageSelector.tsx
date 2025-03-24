import  { useState } from "react";
import {  ToggleButton, ToggleButtonGroup } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import i18n from "../i18n";

const LanguageSelector = () => {
  const [language, setLanguage] = useState("en");


  const handleLanguageChange = (event: any, language: string) => {
    debugger
    if (language !== null) {
        i18n.changeLanguage(language); 
        setLanguage(language);
    }
  };

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      onChange={handleLanguageChange}
      aria-label="language selection"
    >
      <ToggleButton value="en" aria-label="English">
        <LanguageIcon /> EN
      </ToggleButton>
      <ToggleButton value="da" aria-label="Danish">
        <LanguageIcon /> DA
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageSelector;

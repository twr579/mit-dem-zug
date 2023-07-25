import { ExpandMore } from "@mui/icons-material";
import { Autocomplete, SvgIcon, TextField } from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { tokens } from "../../locales/tokens";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../features/language/languageSlice";

function LanguagePicker() {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.language);
    const { i18n, t } = useTranslation();

    const languageOptions = [
        {
            value: "en",
            label: t(tokens.languageOptions.en),
        },
        {
            value: "de",
            label: t(tokens.languageOptions.de),
        },
    ];

    const handleLanguageChange = useCallback(
        async (language) => {
            dispatch(changeLanguage(language));
            await i18n.changeLanguage(language);
        }, [i18n, t]);

    return (
        <Autocomplete
            sx={{ width: 135 }}
            disableClearable
            selectOnFocus={false}
            options={languageOptions}
            value={languageOptions.find(
                (option) => option.value === language
            )}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={(_, value) => handleLanguageChange(value.value)}
            popupIcon={
                <SvgIcon>
                    <ExpandMore />
                </SvgIcon>
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputProps={{ ...params.inputProps, readOnly: true }}
                    variant="outlined"
                />
            )}
        />
    );
}

export default LanguagePicker;
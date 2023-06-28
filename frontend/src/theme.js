// color design tokens export
export const colorTokens = {
    white: {
        0: "#FFFFFF",
        0: "#FFFFFF",   // change to black (for dark mode)
    },
    grey: {
      0: "#FFFFFF",
      10: "#F6F6F6",
      50: "#F0F0F0",
      100: "#E0E0E0",
      200: "#C2C2C2",
      300: "#A3A3A3",
      400: "#858585",
      500: "#666666",
      600: "#4D4D4D",
      700: "#333333",
      800: "#1A1A1A",
      900: "#0A0A0A",
      1000: "#000000",
    },
    primary: {
      50: "#8F00FF",
      100: "#8F00FF",
      200: "#8F00FF",
      300: "#8F00FF",
      400: "#8F00FF",
      500: "#8F00FF",
      600: "#8F00FF",
      700: "#8F00FF",
      800: "#8F00FF",
      900: "#8F00FF",
    },
  };

//   mui theme settings
// setting up the material ui theme
export const themeSettings = (mode) => {
    return {
        palette: {
            mode: mode,
            ...(mode === "dark" 
            ? {
                // if it is dark, then palette values:
                primary: {
                    dark: colorTokens.primary[200],
                    main: colorTokens.primary[500],
                    light: colorTokens.primary[800]
                },
                neutral: {
                    dark: colorTokens.grey[100],
                    main: colorTokens.grey[200],
                    mediumMain: colorTokens.grey[300],
                    medium: colorTokens.grey[400],
                    light: colorTokens.grey[700]
                },
                text: {
                    primary: colorTokens.white[0],
                },
                background: {
                    default: colorTokens.grey[900],
                    alt: colorTokens.grey[800]
                }
            } : {
                // if it is light-mode, then palette values:
                primary: {
                    dark: colorTokens.primary[700],
                    main: colorTokens.primary[500],
                    light: colorTokens.primary[50]
                },
                neutral: {
                    dark: colorTokens.grey[700],
                    main: colorTokens.grey[500],
                    mediumMain: colorTokens.grey[400],
                    medium: colorTokens.grey[300],
                    light: colorTokens.grey[50]
                },
                text: {
                    primary: colorTokens.white[10],
                },
                background: {
                    default: colorTokens.grey[10],
                    alt: colorTokens.grey[0]
                },
            }),
        },
        typography: {
            fontFamily: ["Rubic", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Rubic", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Rubic", "sans-serif"].join(","),
                fontSize: 31,
            },
            h3: {
                fontFamily: ["Rubic", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Rubic", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Rubic", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Rubic", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};
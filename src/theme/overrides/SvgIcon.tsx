// ----------------------------------------------------------------------

export default function SvgIcon(theme: any) {
    return {
        MuiSvgIcon: {
            styleOverrides: {
                fontSizeLarge: {
                    width: 32,
                    height: 32,
                    fontSize: 'inherit',
                },
            },
        },
    }
}

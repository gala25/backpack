import type { PublicKey } from "@solana/web3.js";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Checkbox as _Checkbox,
} from "@mui/material";
import { styles, useCustomTheme } from "@coral-xyz/themes";

export * from "./List";
export { TextField } from "@coral-xyz/react-xnft-renderer";

const useStyles = styles((theme) => ({
  leftLabel: {
    color: theme.custom.colors.fontColor,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 500,
  },
  rightLabel: {
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "16px",
    color: theme.custom.colors.interactiveIconsActive,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
  },
  loadingIndicator: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    color: theme.custom.colors.activeNavButton,
  },
  button: {
    width: "100%",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: theme.custom.colors.primaryButton,
    "&.Mui-disabled": {
      opacity: 0.5,
      backgroundColor: theme.custom.colors.disabledButton,
    },
    "&:hover": {
      backgroundColor: theme.custom.colors.primaryButton,
    },
  },
  buttonLabel: {
    color: theme.custom.colors.buttonFontColor,
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    textTransform: "none",
  },
  header: {
    color: theme.custom.colors.fontColor,
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "32px",
  },
  checkBox: {
    color: theme.custom.colors.primaryButton,
    width: "18px",
    height: "18px",
    "&.Mui-disabled": {
      opacity: 0.5,
    },
  },
  checkboxContainer: {
    display: "flex",
    marginTop: "8px",
  },
  checkBoxRoot: {
    padding: 0,
  },
  checkBoxChecked: {
    color: `${theme.custom.colors.primaryButton} !important`,
    background: "white",
  },
  subtext: {
    color: theme.custom.colors.subtext,
  },
}));

export function WalletAddress({ publicKey, name, style }: any) {
  const theme = useCustomTheme();
  return (
    <Typography style={style}>
      <span style={{ marginRight: "8px" }}>{name}</span>
      <span style={{ color: theme.custom.colors.secondary }}>
        ({walletAddressDisplay(publicKey)})
      </span>
    </Typography>
  );
}

export function walletAddressDisplay(publicKey: PublicKey) {
  const pubkeyStr = publicKey.toString();
  return `${pubkeyStr.slice(0, 4)}...${pubkeyStr.slice(pubkeyStr.length - 4)}`;
}

export function TextFieldLabel({
  leftLabel,
  rightLabel,
  rightLabelComponent,
  style,
}: {
  leftLabel: string;
  rightLabel?: string;
  rightLabelComponent?: React.ReactNode;
  style?: any;
}) {
  const classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
        ...style,
      }}
    >
      <Typography className={classes.leftLabel}>{leftLabel}</Typography>
      {rightLabelComponent ? (
        rightLabelComponent
      ) : (
        <Typography className={classes.rightLabel}>{rightLabel}</Typography>
      )}
    </div>
  );
}

export function Loading(props: any) {
  const classes = useStyles();
  return (
    <div className={classes.loadingContainer}>
      <CircularProgress
        className={classes.loadingIndicator}
        style={props.iconStyle}
      />
    </div>
  );
}

export function PrimaryButton({
  buttonLabelStyle,
  label,
  ...buttonProps
}: {
  buttonLabelStyle?: React.CSSProperties;
  label?: string;
} & React.ComponentProps<typeof Button>) {
  const classes = useStyles();
  return (
    <Button
      disableRipple
      disableElevation
      className={classes.button}
      variant="contained"
      {...buttonProps}
      style={buttonProps.style}
    >
      <Typography style={buttonLabelStyle} className={classes.buttonLabel}>
        {label}
      </Typography>
    </Button>
  );
}

export function SecondaryButton({
  buttonLabelStyle,
  label,
  ...buttonProps
}: {
  buttonLabelStyle?: React.CSSProperties;
  label?: string;
} & React.ComponentProps<typeof Button>) {
  const theme = useCustomTheme();
  const buttonStyle = {
    backgroundColor: theme.custom.colors.secondaryButton,
    ...buttonProps.style,
  };
  return (
    <PrimaryButton
      buttonLabelStyle={buttonLabelStyle}
      label={label}
      {...buttonProps}
      style={buttonStyle}
    />
  );
}

export function DangerButton({
  buttonLabelStyle,
  label,
  ...buttonProps
}: {
  buttonLabelStyle?: React.CSSProperties;
  label?: string;
} & React.ComponentProps<typeof Button>) {
  const theme = useCustomTheme();
  const buttonStyle = Object.assign(
    {
      backgroundColor: theme.custom.colors.dangerButton,
    },
    buttonProps.style
  );
  return (
    <PrimaryButton
      style={buttonStyle}
      buttonLabelStyle={buttonLabelStyle}
      label={label}
      {...buttonProps}
    />
  );
}

export function SubtextParagraph({
  children,
  style,
}: {
  children: any;
  style?: React.CSSProperties;
}) {
  const classes = useStyles();
  return (
    <p
      className={classes.subtext}
      style={{ fontWeight: 500, marginTop: "8px", ...style }}
    >
      {children}
    </p>
  );
}

export function Header({
  text,
  style = {},
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  const classes = useStyles();
  return (
    <Typography className={classes.header} style={style}>
      {text}
    </Typography>
  );
}

export function HeaderIcon({
  icon,
  style,
}: {
  icon: any;
  style?: React.CSSProperties;
}) {
  return (
    <Box
      style={{
        display: "block",
        height: "56px",
        width: "56px",
        margin: "8px auto 16px auto",
        ...style,
      }}
    >
      {icon}
    </Box>
  );
}

export function Checkbox({
  checked,
  setChecked = () => {},
  ...checkboxProps
}: {
  checked: boolean;
  setChecked?: (value: boolean) => void;
} & React.ComponentProps<typeof _Checkbox>) {
  const classes = useStyles();
  return (
    <_Checkbox
      disableRipple
      className={classes.checkBox}
      checked={checked}
      onChange={() => setChecked(!checked)}
      classes={{
        checked: classes.checkBoxChecked,
        root: classes.checkBoxRoot,
      }}
      {...checkboxProps}
    />
  );
}

export function CheckboxForm({
  checked,
  setChecked,
  label,
}: {
  checked: boolean;
  setChecked: (value: boolean) => void;
  label: string;
}) {
  const classes = useStyles();
  return (
    <div className={classes.checkboxContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Checkbox
          checked={checked}
          setChecked={setChecked}
          sx={{ padding: 0 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          marginLeft: "10px",
        }}
      >
        <Typography className={classes.subtext}>{label}</Typography>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { ethers, BigNumber } from "ethers";
import { TextField, Typography, Chip } from "@mui/material";
import { useEthereumFeeData } from "@coral-xyz/recoil";
import { useCustomTheme, styles } from "@coral-xyz/themes";
import { SettingsList } from "./Settings/List";
import { WithMiniDrawer } from "./Layout/Drawer";
import { CloseButton } from "../Unlocked/Swap";
import { PrimaryButton, SecondaryButton } from "./";

const useStyles = styles((theme: any) => ({
  primaryChip: {
    borderColor: theme.custom.colors.nav,
    backgroundColor: theme.custom.colors.nav,
    color: theme.custom.colors.brandColor,
    "& .MuiChip-filled": {
      backgroundColor: theme.custom.colors.brandColor,
      color: theme.custom.colors.fontColor,
    },
  },
  typographyRoot: {
    fontSize: "14px",
  },
  inputRoot: {
    border: `${theme.custom.colors.borderFull}`,
    background: theme.custom.colors.background,
    color: theme.custom.colors.secondary,
    borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        border: "none",
      },
    },
    "& .MuiInputBase-input": {
      color: theme.custom.colors.fontColor,
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 700,
      paddingRight: "8px",
    },
    "& .MuiInputAdornment-root": {
      color: theme.custom.colors.secondary,
      fontWeight: 500,
      minWidth: "12px",
      fontSize: "14px",
    },
    "&:hover": {
      backgroundColor: theme.custom.colors.primary,
    },
  },
}));

export function TransactionData({
  transactionData,
  menuItems,
}: {
  transactionData: any;
  menuItems: any;
}) {
  const theme = useCustomTheme();
  const {
    network,
    networkFee,
    networkFeeUsd,
    transactionOverrides,
    setTransactionOverrides,
    simulationError,
  } = transactionData;
  const [ethSettingsDrawerOpen, setEthSettingsDrawerOpen] = useState(false);

  // The default transaction data that appears on all transactions
  const defaultMenuItems = {
    Network: {
      onClick: () => {},
      detail: <Typography>{network}</Typography>,
      button: false,
    },
    "Network Fee": {
      onClick: () => {},
      detail: (
        <Typography>
          {networkFee} {network === "Ethereum" ? "ETH" : "SOL"}
        </Typography>
      ),
      button: false,
    },
    ...(network === "Ethereum"
      ? {
          Speed: {
            onClick: () => setEthSettingsDrawerOpen(true),
            detail: <Typography>Normal</Typography>,
            button: false,
          },
        }
      : {}),
  };

  return (
    <>
      <SettingsList
        menuItems={{ ...menuItems, ...defaultMenuItems }}
        style={{ margin: 0 }}
        textStyle={{
          color: theme.custom.colors.secondary,
        }}
      />
      {simulationError && (
        <Typography
          style={{
            color: theme.custom.colors.negative,
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          This transaction is unlikely to succeed.
        </Typography>
      )}
      {network === "Ethereum" && (
        <EthereumSettingsDrawer
          transactionOverrides={transactionOverrides}
          setTransactionOverrides={setTransactionOverrides}
          networkFeeUsd={networkFeeUsd}
          openDrawer={ethSettingsDrawerOpen}
          setOpenDrawer={setEthSettingsDrawerOpen}
        />
      )}
    </>
  );
}

export function ValueWithUnit({
  value,
  unit,
}: {
  value: string;
  unit: string;
}) {
  const classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "50%",
      }}
    >
      <Typography className={classes.typographyRoot}>{value}</Typography>
      <Typography className={classes.typographyRoot}>{unit}</Typography>
    </div>
  );
}

export function EthereumSettingsDrawer({
  transactionOverrides,
  setTransactionOverrides,
  networkFeeUsd,
  openDrawer,
  setOpenDrawer,
}: any) {
  const theme = useCustomTheme();
  const classes = useStyles();
  const [mode, setMode] = useState<"normal" | "fast" | "degen" | "custom">(
    "normal"
  );
  const feeData = useEthereumFeeData();
  // Separate state for nonce so it is editable independently of gas settings
  // and mode button
  const [nonce, setNonce] = useState(transactionOverrides.nonce);
  const [editing, setEditing] = useState(false);
  // Dont update transaction overrides on first render as they are already set
  // from the compient props
  const isInitialMount = useRef(true);

  useEffect(() => {
    setEditing(mode === "custom");
  }, [mode]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (mode === "normal") {
      setTransactionOverrides({
        ...transactionOverrides,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        nonce,
      });
    } else if (mode === "fast") {
      setTransactionOverrides({
        ...transactionOverrides,
        // Add 10% for fast mode
        maxFeePerGas: feeData.maxFeePerGas.add(
          feeData.maxFeePerGas.mul(10).div(100)
        ),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.add(
          feeData.maxPriorityFeePerGas.mul(10).div(100)
        ),
        nonce,
      });
    } else if (mode === "degen") {
      setTransactionOverrides({
        ...transactionOverrides,
        // Add 50% for degen mode
        maxFeePerGas: feeData.maxFeePerGas.add(
          feeData.maxFeePerGas.mul(50).div(100)
        ),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.add(
          feeData.maxPriorityFeePerGas.mul(50).div(100)
        ),
        nonce,
      });
    }
  }, [mode]);

  const menuItemBase = {
    onClick: () => {},
    button: false,
  };

  const menuItems = {
    "Max base fee": {
      detail: editing ? (
        <TextField
          className={classes.inputRoot}
          variant="outlined"
          margin="dense"
          size="small"
          InputLabelProps={{
            shrink: false,
            style: {
              backgroundColor: theme.custom.colors.nav,
            },
          }}
          value={ethers.utils.formatUnits(transactionOverrides.maxFeePerGas, 9)}
          onChange={(e) => {
            setTransactionOverrides({
              ...transactionOverrides,
              maxFeePerGas: BigNumber.from(
                parseFloat(e.target.value) * 10 ** 9
              ),
            });
          }}
        ></TextField>
      ) : (
        <ValueWithUnit
          value={ethers.utils.formatUnits(transactionOverrides.maxFeePerGas, 9)}
          unit="GWEI"
        />
      ),
      ...menuItemBase,
    },
    "Priority fee": {
      detail: editing ? (
        <TextField
          className={classes.inputRoot}
          variant="outlined"
          margin="dense"
          size="small"
          InputLabelProps={{
            shrink: false,
            style: {
              backgroundColor: theme.custom.colors.nav,
            },
          }}
          value={ethers.utils.formatUnits(
            transactionOverrides.maxPriorityFeePerGas,
            9
          )}
          onChange={(e) => {
            setTransactionOverrides({
              ...transactionOverrides,
              maxPriorityFeePerGas: BigNumber.from(
                parseFloat(e.target.value) * 10 ** 9
              ),
            });
          }}
        ></TextField>
      ) : (
        <ValueWithUnit
          value={ethers.utils.formatUnits(
            transactionOverrides.maxPriorityFeePerGas,
            9
          )}
          unit="GWEI"
        />
      ),
      ...menuItemBase,
    },
    "Gas limit": {
      detail: editing ? (
        <TextField
          className={classes.inputRoot}
          variant="outlined"
          margin="dense"
          size="small"
          InputLabelProps={{
            shrink: false,
            style: {
              backgroundColor: theme.custom.colors.nav,
            },
          }}
          value={transactionOverrides.gasLimit.toString()}
          onChange={(e) => {
            setTransactionOverrides({
              ...transactionOverrides,
              gasLimit: BigNumber.from(e.target.value),
            });
          }}
        ></TextField>
      ) : (
        <Typography className={classes.typographyRoot}>
          {transactionOverrides.gasLimit.toString()}
        </Typography>
      ),
      ...menuItemBase,
    },
    Nonce: {
      detail: (
        <Typography className={classes.typographyRoot}>
          {transactionOverrides.nonce}
        </Typography>
      ),
      ...menuItemBase,
    },
    "Max transaction fee": {
      detail: (
        <Typography className={classes.typographyRoot}>
          ${networkFeeUsd}
        </Typography>
      ),
      ...menuItemBase,
    },
  };
  return (
    <WithMiniDrawer
      openDrawer={openDrawer}
      setOpenDrawer={setOpenDrawer}
      paperProps={{
        style: {
          height: "100%",
        },
      }}
    >
      <div
        onClick={() => setOpenDrawer(false)}
        style={{
          height: "50px",
          zIndex: 1,
          backgroundColor: "transparent",
        }}
      >
        <CloseButton
          onClick={() => setOpenDrawer(false)}
          style={{
            marginTop: "28px",
            marginLeft: "24px",
            zIndex: 1,
          }}
        />
      </div>
      <div
        style={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          borderTop: "1pt solid " + theme.custom.colors.borderColor,
          height: "100%",
          background: theme.custom.colors.background,
        }}
      >
        <div
          style={{
            height: "100%",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              paddingBottom: "24px",
              height: "100%",
            }}
          >
            <div>
              <Typography
                style={{
                  color: theme.custom.colors.fontColor,
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "24px",
                  textAlign: "center",
                  paddingTop: "24px",
                }}
              >
                Advanced Settings
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "24px",
                }}
              >
                <Chip
                  onClick={() => setMode("normal")}
                  className={classes.primaryChip}
                  variant={mode === "normal" ? "filled" : "outlined"}
                  label="Normal"
                />
                <Chip
                  onClick={() => setMode("fast")}
                  className={classes.primaryChip}
                  variant={mode === "fast" ? "filled" : "outlined"}
                  label="Fast"
                />
                <Chip
                  onClick={() => setMode("degen")}
                  className={classes.primaryChip}
                  variant={mode === "degen" ? "filled" : "outlined"}
                  label="Degen"
                />
                <Chip
                  onClick={() => setMode("custom")}
                  className={classes.primaryChip}
                  variant={mode === "custom" ? "filled" : "outlined"}
                  label="Custom"
                />
              </div>
              <SettingsList
                menuItems={menuItems}
                textStyle={{ fontSize: "14px" }}
              />
            </div>
            <div style={{ margin: "0 16px" }}>
              {mode === "custom" && editing && (
                <PrimaryButton
                  style={{ marginBottom: "12px" }}
                  label="Save"
                  onClick={() => setEditing(false)}
                />
              )}
              <SecondaryButton
                label="Close"
                onClick={() => setOpenDrawer(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </WithMiniDrawer>
  );
}

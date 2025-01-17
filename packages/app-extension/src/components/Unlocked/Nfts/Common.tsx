import { Button, Typography } from "@mui/material";
import { styles, useCustomTheme, HOVER_OPACITY } from "@coral-xyz/themes";
import { ProxyImage } from "../../common/ProxyImage";

const useStyles = styles((theme) => ({
  button: {
    "&:hover": {
      opacity: HOVER_OPACITY,
    },
  },
}));

export function GridCard({ onClick, nft, subtitle }: any) {
  const classes = useStyles();
  const theme = useCustomTheme();
  return (
    <Button
      className={classes.button}
      onClick={onClick}
      disableRipple
      style={{
        textTransform: "none",
        padding: 0,
        borderRadius: "8px",
        position: "relative",
        overflow: "hidden",
        minWidth: "150px",
        minHeight: "150px",
        aspectRatio: "1",
      }}
    >
      <ProxyImage
        style={{
          width: "100%",
        }}
        src={nft.imageUrl}
        onError={(event: any) => (event.currentTarget.style.display = "none")}
      />
      {subtitle && (
        <div
          style={{
            backgroundColor: theme.custom.colors.nav,
            position: "absolute",
            left: 8,
            bottom: 8,
            zIndex: 2,
            height: "24px",
            borderRadius: "12px",
            paddingLeft: "8px",
            paddingRight: "8px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            style={{
              fontSize: "12px",
              color: theme.custom.colors.fontColor,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "130px",
            }}
          >
            {subtitle.name}{" "}
            <span
              style={{
                color: theme.custom.colors.secondary,
              }}
            >
              {subtitle.length}
            </span>
          </Typography>
        </div>
      )}
    </Button>
  );
}

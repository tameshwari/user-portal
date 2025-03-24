import { Box, Drawer} from "@mui/material";


interface Props {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }

export function SidePanelBar({show, onClose, children}: Props) {


return ( <Drawer
    anchor="right"
     open={show}
    onClose={onClose}
  >
    <Box sx={{ width: 400, m:"20px", pt:"50px", justifyContent: "center", alignItems:"flex-start" }}>
    {children}
    </Box>
  </Drawer>)
}
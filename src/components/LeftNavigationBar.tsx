import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const drawerWidth = 200;
export const LeftNavigationBar = () => {
  const [openUsers, setOpenUsers] = useState(true);

  const [selectedMenu, setSelectedMenu] = useState(0);
  const { t } = useTranslation();

  const userMenuItems = [
    { id: 1, name: t('userOverView'), path: '/user-overview' },
    { id: 2, name: t('departments'), path: '/departments' },
    { id: 3, name: t('keyTemplates'), path: '/key-templates' },
  ];

  return (
    <>
      <Drawer
        variant="permanent"
        open={true}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItemText
            sx={{ p: 2, fontWeight: 'medium' }}
            primary={t('myCompanyLabel')}
          />

          <ListItemButton onClick={() => setOpenUsers(!openUsers)}>
            <ListItemText primary={t('users')} />
            {openUsers ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openUsers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {userMenuItems.map((menu) => (
                <ListItemButton
                  onClick={() => setSelectedMenu(menu.id)}
                  sx={{
                    pl: 4,
                    bgcolor:
                      selectedMenu === menu.id
                        ? '#000075'
                        : 'background.default',
                    color:
                      selectedMenu === menu.id
                        ? '#fff'
                        : 'color.default',
                    '&:hover': { backgroundColor: '#1976d2' },
                  }}
                  component={Link}
                  to={menu.path}
                >
                  <ListItemText primary={menu.name} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

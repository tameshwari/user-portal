import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { User } from '../Model/user';
import DOMPurify from 'dompurify';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Language';
import HomeIcon from '@mui/icons-material/Home';
import RadarIcon from '@mui/icons-material/Radar';
import NoteIcon from '@mui/icons-material/Note';
import { ReactNode, useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import { Flag } from '@mui/icons-material';

interface Props {
  user: User | undefined;
  canCreateOrEditUser?: boolean;
  onClose?: () => void;
  onCreate?: () => void;
}

export enum ListItems {
  NAME = 'name',
  DEPARTMENT = 'department',
  EMAIL = 'email',
  POSITION = 'position',
  NOTE = 'note',
  ADDRESS = 'address',
  LANGUAGE = 'language',
}

export function UserDetails({
  user,
  canCreateOrEditUser,
  onClose,
  onCreate,
}: Props) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    email: '',
    position: '',
    note: '',
    address: '',
    language: 'english',
  });

  const [editUser, setEditUser] = useState(
    canCreateOrEditUser ? canCreateOrEditUser : false,
  );

  const createNewUser = async () => {
    const newUserData = {
      ...formData,
      id: Date.now().toString(),
    };
    try {
      const response = await axiosInstance.post('/users', newUserData);
      if (response.status === 200) {
        resetModel();
        onCreate && onCreate();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateExistingUser = async () => {
    try {
      const response = await axiosInstance.patch('/users', formData, {
        params: {
          id: formData.id,
        },
      });
      if (response.status === 200) {
        resetModel();
        onCreate && onCreate();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetModel = () => {
    setFormData({
      id: '',
      name: '',
      department: '',
      email: '',
      position: '',
      note: '',
      address: '',
      language: 'english',
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    user ? updateExistingUser() : createNewUser();
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        department: user.department,
        email: user.email,
        position: user.position,
        note: user.note,
        address: user.address,
        language: user.language || 'english',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleBlur = (event: any, fieldName: string) => {
    const newText = event.target.innerText;
    const sanitizedText = DOMPurify.sanitize(newText);
    setFormData((prev) => ({
      ...prev,
      [fieldName.toLowerCase()]: sanitizedText,
    }));
  };

  const handleInput = (event: any, fieldName: string) => {
    const newText = event.target.value;
    const sanitizedText = DOMPurify.sanitize(newText);
    setFormData((prev) => ({
      ...prev,
      [fieldName.toLowerCase()]: sanitizedText,
    }));
  };

  const getListSecondaryValue = (
    fieldName: string,
    fieldValue: string,
  ): ReactNode => {
    if (fieldName === ListItems.ADDRESS) {
      return (
        <TextField
          multiline
          minRows={2}
          variant="outlined"
          fullWidth
          value={fieldValue}
          onChange={(e) => handleInput(e, ListItems.ADDRESS)}
        />
      );
    }

    if (fieldName === ListItems.LANGUAGE) {
      return (
        <Select
          defaultValue="english"
          sx={{ height: 50 }}
          value={fieldValue}
          fullWidth
          onChange={(e) => handleInput(e, ListItems.LANGUAGE)}
        >
          <MenuItem value="english">English</MenuItem>
          <MenuItem value="danish">Danish</MenuItem>
        </Select>
      );
    }
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleBlur(e, fieldName)}
        style={{
          border: '1px solid gray',
          padding: '4px',
          minWidth: '250px',
          display: 'flex',
          cursor: 'text',
        }}
      >
        {fieldValue}
      </div>
    );
  };

  return (
    <Container
      sx={{
        px: 8,
        border: '0.5px solid grey',
        mt: 4,
        p: 2,
        overflowY: 'auto',
        maxHeight: '720px',
      }}
    >
      <>
        <h3>{user?.name ?? 'Create User'}</h3>
        <List>
          <Box>
            <Box>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  secondary={
                    editUser
                      ? getListSecondaryValue(ListItems.NAME, formData.name)
                      : formData.name
                  }
                  primary={ListItems.NAME}
                />
              </ListItem>
            </Box>

            <Box>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={ListItems.DEPARTMENT}
                  secondary={
                    editUser
                      ? getListSecondaryValue(
                          ListItems.DEPARTMENT,
                          formData.department,
                        )
                      : formData.department
                  }
                />
              </ListItem>
            </Box>
            <Box>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary={ListItems.EMAIL}
                  secondary={
                    editUser
                      ? getListSecondaryValue(ListItems.EMAIL, formData.email)
                      : formData.email
                  }
                />
              </ListItem>
            </Box>
            <Box>
              <ListItem>
                <ListItemIcon>
                  <RadarIcon />
                </ListItemIcon>
                <ListItemText
                  primary={ListItems.POSITION}
                  secondary={
                    editUser
                      ? getListSecondaryValue(
                          ListItems.POSITION,
                          formData.position,
                        )
                      : formData.position
                  }
                />
              </ListItem>
            </Box>
            <Box>
              <ListItem>
                <ListItemIcon>
                  <NoteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={ListItems.NOTE}
                  secondary={
                    editUser
                      ? getListSecondaryValue(ListItems.NOTE, formData.note)
                      : formData.note
                  }
                />
              </ListItem>
            </Box>
            <Box>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={ListItems.ADDRESS}
                  secondary={
                    editUser
                      ? getListSecondaryValue(
                          ListItems.ADDRESS,
                          formData.address,
                        )
                      : formData.address
                  }
                />
              </ListItem>
            </Box>
            <Box>
              <ListItem>
                <ListItemIcon>
                  <Flag />
                </ListItemIcon>
                <ListItemText
                  primary={ListItems.LANGUAGE}
                  secondary={
                    editUser
                      ? getListSecondaryValue(
                          ListItems.LANGUAGE,
                          formData.language,
                        )
                      : formData.language
                  }
                />
              </ListItem>
            </Box>
          </Box>
        </List>
        {editUser && (
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{
                border: '2px solid #000075',
                '&:hover': { backgroundColor: '#1976d2' },
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 20px',
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              fullWidth
              sx={{
                backgroundColor: '#000075',
                color: '#fff',
                border: '2px solid #000075',
                '&:hover': { backgroundColor: '#1976d2' },
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 20px',
              }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        )}
      </>
    </Container>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Paper,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import axiosInstance from '../service/axiosInstance';
import { User } from '../Model/user';
import { SidePanelBar, UserDetails } from '../components';
import { userListColumns } from '../utils/constant';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Overview = () => {
  const [user, setUser] = useState<'asc' | 'desc'>('asc');

  const [orderBy, setOrderBy] = useState<keyof User>('name');
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState<User[]>([]);
  const [originalRows, setOriginalRows] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [createUser, setCreateUser] = useState(false);
  const [editUser, setEditUser] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = () => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setOriginalRows(response.data);
        setFilteredRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  };

  const handleRowClick = (user: any) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setCreateUser(false);
    setEditUser(true);
    setIsDrawerOpen(true);
  };
  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?',
    );
    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete(`/users/`, {
        params: {
          id: userId,
        },
      });
      if (response.status === 200) {
        setOriginalRows((prevRows) =>
          prevRows.filter((user) => user.id !== userId),
        );
        setFilteredRows((prevRows) =>
          prevRows.filter((user) => user.id !== userId),
        );
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setCreateUser(false);
  };

  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && user === 'asc';
    setUser(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortRows = (rows: User[], comparator: (a: User, b: User) => number) => {
    const stabilizedRows = rows.map(
      (row, index) => [row, index] as [User, number],
    );
    stabilizedRows.sort((a, b) => {
      const orderResult = comparator(a[0], b[0]);
      if (orderResult !== 0) return orderResult;
      return a[1] - b[1];
    });
    return stabilizedRows.map((row) => row[0]);
  };

  const comparator = (a: User, b: User): number => {
    if (a[orderBy] < b[orderBy]) {
      return user === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return user === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const sortedRows = filteredRows && sortRows(filteredRows, comparator);
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = DOMPurify.sanitize(event.target.value).toLowerCase();
    setFilterText(newFilter);

    if (!newFilter) {
      setFilteredRows(originalRows);
    } else {
      const newFilteredRows = originalRows.filter(
        (row) =>
          row.name.toLowerCase().includes(newFilter) ||
          row.email.toLowerCase().includes(newFilter) ||
          row.department.toLowerCase().includes(newFilter) ||
          row.position.toLowerCase().includes(newFilter) ||
          row.address.toLowerCase().includes(newFilter) ||
          row.language.toLowerCase().includes(newFilter),
      );
      setFilteredRows(newFilteredRows);
    }
  };

  const handleCreateUser = () => {
    setIsDrawerOpen(true);
    setCreateUser(true);
  };

  const onSuccessfulUserCreation = () => {
    
    setIsDrawerOpen(false);
    getUserDetails();
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        height: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ m: '32px', gap: 10, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleFilterChange}
          value={filterText}
          sx={{ width: '40%' }}
        />
        <Button
          onClick={handleCreateUser}
          sx={{
            backgroundColor: '#000075',
            color: '#fff',
            border: '2px solid #000075',
            '&:hover': { backgroundColor: '#1976d2' },
          }}
        >
          Create User
        </Button>
      </Box>
      <TableContainer>
        <Table aria-label="sortable and filterable table">
          <TableHead>
            <TableRow>
              {userListColumns.map((column) => (
                <TableCell key={column.key}>
                  <TableSortLabel
                    key={column.key}
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? user : 'asc'}
                    onClick={() => handleRequestSort(column.key as keyof User)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow hover key={row.id} onClick={() => handleRowClick(row)}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.language}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(row.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     
      <SidePanelBar show={isDrawerOpen} onClose={handleDrawerClose}>
        <UserDetails
          user={createUser ? undefined : selectedUser}
          canCreateOrEditUser={createUser || editUser}
          onClose={handleDrawerClose}
          onCreate={onSuccessfulUserCreation}
        />
      </SidePanelBar>
    </Paper>
  );
};
export default Overview;

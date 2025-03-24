const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
const LOGIN_JSON_FILE_PATH = path.join(__dirname, 'api/login.json');
function getFilePath(urlParts, queryParams) {
  let filePath = path.join(...urlParts) + '.json';
  return filePath;
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(LOGIN_JSON_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Error reading login data file.',
        LOGIN_JSON_FILE_PATH,
      });
    }
    let users;
    try {
      users = JSON.parse(data).users;
      const user = users.find(
        (u) => u.username === username && u.password === password,
      );
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Respond with the token
      res.json({ message: 'Login successful' });
    } catch (parseError) {
      return res
        .status(500)
        .json({ message: 'Error parsing login data file.' });
    }
  });
});

app.post('/*', (req, res) => {
  const newData = req.body;
  const url = `/api/${req.params['0']}`;
  const filePath = getFilePath(url.split('/'), req.query);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error reading mock data file.', filePath });
    }
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ message: 'Error parsing mock data file.' });
    }
    parsedData.push(newData);
    fs.writeFile(
      filePath,
      JSON.stringify(parsedData, null, 2),
      'utf8',
      (writeError) => {
        if (writeError) {
          return res
            .status(500)
            .json({ message: 'Error writing to mock data file.' });
        }

        return res
          .status(200)
          .json({ message: 'Mock data added successfully!', newData });
      },
    );
  });
});

app.get('/*', (req, res, next) => {
  res.set('Content-Type', 'application/json');

  const url = `/api/${req.params['0']}`;
  if (!url) {
    return res.status(404).json({ error: 'Not found' });
  }

  const filePath = getFilePath(url.split('/'), req.query);
  if (!filePath) {
    return res.status(404).json({ error: 'File path not found' });
  }
  fs.readFile(path.join(__dirname, filePath), 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }

    try {
      const parsedData = JSON.parse(data);
      return res.json(parsedData);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse JSON' });
    }
  });
});

app.delete('/*', (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID is required to delete user' });
  }

  const url = `/api/${req.params['0']}`;
  const filePath = getFilePath(url.split('/'), req.query);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error reading mock data file.', filePath });
    }
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ message: 'Error parsing mock data file.' });
    }
    const updatedData = parsedData.filter((user) => user.id !== id);
    if (updatedData.length === parsedData.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    fs.writeFile(
      filePath,
      JSON.stringify(updatedData, null, 2),
      'utf8',
      (writeError) => {
        if (writeError) {
          return res
            .status(500)
            .json({ message: 'Error writing to mock data file.' });
        }

        return res.status(200).json({ message: 'User deleted successfully.' });
      },
    );
  });
});

app.patch('/*', (req, res) => {
  const updatedData = req.body;
  const { id } = req.query;
  const url = `/api/${req.params['0'].split('/')[0]}`;
  const filePath = getFilePath(url.split('/'), req.query);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error reading mock data file.', filePath });
    }
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ message: 'Error parsing mock data file.' });
    }
    const itemIndex = parsedData.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Item with the given ID not found.', id });
    }
    parsedData[itemIndex] = { ...parsedData[itemIndex], ...updatedData };

    fs.writeFile(
      filePath,
      JSON.stringify(parsedData, null, 2),
      'utf8',
      (writeError) => {
        if (writeError) {
          return res
            .status(500)
            .json({ message: 'Error writing to mock data file.' });
        }

        return res
          .status(200)
          .json({ message: 'Data updated successfully!', updatedData });
      },
    );
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const AddTodo = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      addTodo(text, deadline);
      setText('');
      setDeadline('');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <TextField
        label="Нове завдання"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <TextField
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Додати
      </Button>
    </div>
  );
};

export default AddTodo;
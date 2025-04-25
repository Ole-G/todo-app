import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddTodo = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, deadline);
      setText('');
      setDeadline(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TextField
        label="Нове завдання"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
      />
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Термін виконання"
            value={deadline}
            onChange={setDeadline}
            renderInput={(params) => <TextField {...params} size="small" />}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        
        <Button 
          type="submit"
          variant="contained" 
          color="primary"
        >
          Додати
        </Button>
      </div>
    </form>
  );
};

export default AddTodo;
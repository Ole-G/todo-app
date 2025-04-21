import React, { useState } from 'react';
import { Checkbox, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TodoItem = ({ todo, deleteTodo, toggleComplete, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    editTodo(todo.id, newText);
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />
      {isEditing ? (
        <TextField
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            cursor: 'pointer',
          }}
        >
          {todo.text}
        </span>
      )}
      <span style={{ marginLeft: '10px' }}>
        {todo.deadline ? `Дедлайн: ${todo.deadline}` : ''}
      </span>
      <IconButton onClick={() => deleteTodo(todo.id)}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default TodoItem;
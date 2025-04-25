import React, { useState } from 'react';
import { Checkbox, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import './TodoItem.css';

const TodoItem = ({ todo, deleteTodo, toggleComplete, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (todo.completed) return; // Don't allow editing completed todos
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="todo-item-content">
      <Checkbox
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
        color="primary"
      />

      {isEditing ? (
        <TextField
          className="todo-text-field"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          fullWidth
          size="small"
        />
      ) : (
        <div
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          onClick={handleEdit}
        >
          {todo.text}
        </div>
      )}

      {todo.deadline && (
        <div className="todo-deadline">
          {format(new Date(todo.deadline), 'dd.MM.yyyy')}
        </div>
      )}

      <IconButton
        className="todo-delete-button"
        onClick={() => deleteTodo(todo.id)}
        size="small"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default TodoItem;
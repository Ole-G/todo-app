import React, { useState, useCallback, memo } from 'react';
import { Checkbox, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './TodoItem.css';

const TodoItem = memo(({ todo, deleteTodo, toggleComplete, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  // Update newText when todo.text changes (for example, after reordering)
  React.useEffect(() => {
    setNewText(todo.text);
  }, [todo.text]);

  const handleDoubleClick = useCallback((e) => {
    // Stop propagation to prevent parent handlers from triggering
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    if (newText.trim() !== '') {
      editTodo(todo.id, newText);
      setIsEditing(false);
    } else {
      // If empty, revert to original text
      setNewText(todo.text);
      setIsEditing(false);
    }
  }, [editTodo, newText, todo.id, todo.text]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setNewText(todo.text);
      setIsEditing(false);
    }
  }, [handleSave, todo.text]);

  const handleChange = useCallback((e) => {
    setNewText(e.target.value);
  }, []);

  // Stop event propagation for the entire component to prevent drag-and-drop conflicts
  const handleClick = useCallback((e) => {
    // Only stop propagation if editing
    if (isEditing) {
      e.stopPropagation();
    }
  }, [isEditing]);

  const handleCheckboxChange = useCallback(() => {
    toggleComplete(todo.id);
  }, [toggleComplete, todo.id]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    deleteTodo(todo.id);
  }, [deleteTodo, todo.id]);

  return (
    <div className="todo-item-content" onClick={handleClick}>
      <Checkbox
        checked={todo.completed}
        onChange={handleCheckboxChange}
        className="todo-checkbox"
        onClick={(e) => e.stopPropagation()}
      />
      {isEditing ? (
        <TextField
          value={newText}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          fullWidth
          size="small"
          className="todo-text-field"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
        >
          {todo.text}
        </span>
      )}
      <span className="todo-deadline">
        {todo.deadline ? `Дедлайн: ${todo.deadline}` : ''}
      </span>
      <IconButton 
        onClick={handleDeleteClick}
        className="todo-delete-button"
        size="small"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
});

export default TodoItem;
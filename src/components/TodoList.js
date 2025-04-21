import React, { useState, useEffect, useCallback } from 'react';
import AddTodo from './AddTodo';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Load todos from localStorage on component mount
  useEffect(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
      console.log('Завантажуємо з localStorage:', savedTodos);
      setTodos(savedTodos);
    } catch (error) {
      console.error('Помилка завантаження даних з localStorage:', error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      console.log('Зберігаємо в localStorage:', todos);
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  // Function to add a new todo
  const addTodo = useCallback((text, deadline) => {
    const newTodo = {
      id: uuidv4(),
      text,
      completed: false,
      deadline: deadline || null,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []);

  // Function to delete a todo
  const deleteTodo = useCallback((id) => {
    if (window.confirm('Ви впевнені, що хочете видалити це завдання?')) {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }
  }, []);

  // Function to toggle todo completion status
  const toggleComplete = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // Function to edit todo text
  const editTodo = useCallback((id, newText) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  }, []);

  // Handle drag start
  const handleDragStart = (e, todo, index) => {
    setDraggedItem(todo);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.4";
    
    // This is needed for Firefox
    e.dataTransfer.setData("text/plain", todo.id);
  };

  // Handle drag over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    e.preventDefault();
    if (e.target.style) {
      e.target.style.opacity = "1";
    }
    setDragOverIndex(null);
  };

  // Handle drop
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const draggedItemIndex = todos.findIndex(todo => todo.id === draggedItem.id);
    
    // Don't do anything if dropping onto the same item
    if (draggedItemIndex === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }
    
    // Create a new copy of the todos array
    const newTodos = [...todos];
    // Remove the dragged item
    newTodos.splice(draggedItemIndex, 1);
    // Insert it at the new position
    newTodos.splice(dropIndex, 0, draggedItem);
    
    // Update state
    setTodos(newTodos);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="todo-container">
        <h1>Список справ</h1>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <h1>Список справ</h1>
      <AddTodo addTodo={addTodo} />
      
      {todos.length === 0 ? (
        <p>Немає завдань</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li 
              key={todo.id}
              className={`todo-item ${dragOverIndex === index ? 'drag-over' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, todo, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="drag-handle">≡</div>
              <TodoItem
                todo={todo}
                deleteTodo={deleteTodo}
                toggleComplete={toggleComplete}
                editTodo={editTodo}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
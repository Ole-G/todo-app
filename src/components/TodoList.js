import React, { useState, useEffect } from 'react';
import AddTodo from './AddTodo';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from './TodoItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  // Завантаження даних з LocalStorage при завантаженні
  useEffect(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
      console.log('Завантажуємо з localStorage:', savedTodos);
      setTodos(savedTodos);
    } catch (error) {
      console.error('Помилка завантаження даних з localStorage:', error);
      setTodos([]);
    }
  }, []);

  // Збереження даних у LocalStorage при зміні списку
  useEffect(() => {
    console.log('Зберігаємо в localStorage:', todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Функція для додавання нового завдання
  const addTodo = (text, deadline) => {
    const newTodo = {
      id: uuidv4(),
      text,
      completed: false,
      deadline: deadline || null,
    };
    setTodos([...todos, newTodo]);
  };

  // Функція для видалення завдання
  const deleteTodo = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити це завдання?')) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  // Функція для позначення завдання як виконане
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Функція для редагування тексту завдання
  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  // Функція для переміщення завдань (drag-and-drop)
  const onDragEnd = (result) => {
    console.log('onDragEnd result:', result);
    if (!result.destination) return;
    const reorderedTodos = Array.from(todos);
    const [movedTodo] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, movedTodo);
    setTodos(reorderedTodos);
  };

  return (
    <div>
      <h1>Список справ</h1>
      <AddTodo addTodo={addTodo} />
      {todos.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoItem
                          todo={todo}
                          deleteTodo={deleteTodo}
                          toggleComplete={toggleComplete}
                          editTodo={editTodo}
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <p>Немає завдань</p>
      )}
    </div>
  );
};

export default TodoList;
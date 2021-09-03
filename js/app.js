//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const time = document.querySelector(".time");
const date = document.querySelector(".date");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", delCheck);
filterOption.addEventListener("click", filterTodo);

//Functions
function addTodo(e) {
  //Prevent the default behaviour of submitting the form
  e.preventDefault();
  //Todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  if (todoInput.value === "")
    alert("Your todo is empty!!\nWrite a task to add.");
  else {
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;

    newTodo.classList.add("todo-item");
    //Save to localstorage
    saveLocalTodos(todoInput.value);
    //Create delete button
    const delTodo = document.createElement("button");
    delTodo.innerHTML = '<i class="fas fa-trash"></i>';
    delTodo.classList.add("del-todo");
    //Create check button
    const checkTodo = document.createElement("button");
    checkTodo.innerHTML = '<i class="fas fa-check"></i>';
    checkTodo.classList.add("check-todo");
    // Append all the items to div
    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(delTodo);
    todoDiv.appendChild(checkTodo);
    //Append to todo-list
    todoList.appendChild(todoDiv);
    //Clear todoInput value
    todoInput.value = "";
  }
}

//Mark done or delete a todo
function delCheck(e) {
  const item = e.target;
  if (item.classList[0] === "del-todo") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    //At the end
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }
  if (item.classList[0] === "check-todo") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

//Filter all, done and pending todos
function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

//Save your tasks to the localstorage
function saveLocalTodos(todo) {
  //Check if i have something already
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//Remove your tasks from the localstorage
function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//Get the saved todos in the localstorage
function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoInput.value = "";
    //Create delete button
    const delTodo = document.createElement("button");
    delTodo.innerHTML = '<i class="fas fa-trash"></i>';
    delTodo.classList.add("del-todo");
    //Create check button
    const checkTodo = document.createElement("button");
    checkTodo.innerHTML = '<i class="fas fa-check"></i>';
    checkTodo.classList.add("check-todo");
    // Append all the items to div
    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(delTodo);
    todoDiv.appendChild(checkTodo);
    //Append to todo-list
    todoList.appendChild(todoDiv);
  });
}

//Date & Time
function showDateTime() {
  const currentDate = new Date();
  setTimeout(function () {
    showDateTime();
    date.innerText = currentDate.toLocaleDateString();
    time.innerText = currentDate.toLocaleTimeString("en-US");
  }, 500);
}
showDateTime();

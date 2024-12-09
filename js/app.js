//Selectors
const todoInput = document.getElementsByClassName("todo-input")[0];
const todoButton = document.getElementsByClassName("todo-button")[0];
const todoList = document.getElementsByClassName("todo-list")[0];
const filterOption = document.getElementsByClassName("filter-todo")[0];
const prev = document.getElementsByClassName("prev")[0];
const next = document.getElementsByClassName("next")[0];
const date = document.getElementsByClassName("date")[0];

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", delCheck);
filterOption.addEventListener("click", filterTodo);
date.addEventListener("click", currentTodo);
prev.addEventListener("click", prevTodo);
next.addEventListener("click", nextTodo);

// Useful variables
var completedToday = []; // Completed today tasks
var currentDay = new Date(); // Current displayed day
const cDay = new Date(); // Current day
const docTitle = document.title;

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
		if (confirm("Are you sure you want to remove the task " + todo.textContent + "?")) {
			todo.classList.add("fall");
			//At the end
			removeLocalTodos(todo);
			todo.addEventListener("transitionend", () => {
			  todo.remove();
			});
		}
	}
	if (item.classList[0] === "check-todo") {
		const todo = item.parentElement;
		todo.classList.toggle("completed");
		storeTodoState(todo);
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
	refreshTodo();
}

// Get current Datetime
function Datetime(date = null) {
	const currentDate = (date === null) ? currentDay : new Date(date);
	const Datetime = "" + currentDate.getFullYear() + currentDate.getMonth() + currentDate.getDate();
	return Datetime;
}

// Get previous day Date and refresh list
function prevTodo() {
	const dateOffset = 24 * 60 * 60 * 1000;
	const prevDate = currentDay;
	prevDate.setTime(prevDate.getTime() - dateOffset);
	console.log("Request ", prevDate.getDate(), prevDate.getMonth() + 1, prevDate.getFullYear());
	refreshTodo(prevDate);
}

// Get next day Date and refresh list
function nextTodo() {
	const dateOffset = 24 * 60 * 60 * 1000;
	const nextDate = currentDay;
	nextDate.setTime(nextDate.getTime() + dateOffset);
	console.log("Request ", nextDate.getDate(), nextDate.getMonth() + 1, nextDate.getFullYear());
	refreshTodo(nextDate);
}

// Get current day and refresh list
function currentTodo() {
	currentDay = new Date();
	refreshTodo();
}

// Update the todolist with the current date
function refreshTodo(customDate = null) {
	showDateTime(customDate);
	completedToday = JSON.parse(localStorage.getItem(Datetime(customDate)));
	if (completedToday === null) completedToday = [];
	const tasks = document.getElementsByClassName("todo");
	for(var i = 0; i < tasks.length; i++) {
		(completedToday.indexOf(tasks[i].textContent) != -1) ? tasks[i].classList.add("completed") : tasks[i].classList.remove("completed");
		if (customDate !== null && customDate.getTime() != cDay.getTime()) {
			tasks[i].getElementsByClassName("del-todo")[0].style.display = "none";
			tasks[i].getElementsByClassName("check-todo")[0].style.display = "none";
		} else {
			tasks[i].getElementsByClassName("del-todo")[0].style.display = "flex";
			tasks[i].getElementsByClassName("check-todo")[0].style.display = "flex";
		}
	}
	document.title = "[" + (tasks.length - completedToday.length) + "] " + docTitle;
}

// Store a todo task state and update the list state
function storeTodoState(todo) {
	if (completedToday.indexOf(todo.childNodes[0].textContent) == -1) {
		completedToday.push(todo.childNodes[0].textContent);
	} else {
		completedToday.splice(completedToday.indexOf(todo.childNodes[0].textContent), 1);
	}
	localStorage.setItem(Datetime(), JSON.stringify(completedToday));
	document.title = "[" + (document.getElementsByClassName("todo").length - completedToday.length) + "] " + docTitle;
}

//Date & Time
function showDateTime(customDate) {
	const currentDate = (customDate === null) ? currentDay : new Date(customDate);
	date.innerText = currentDate.toLocaleDateString();
}

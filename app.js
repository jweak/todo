// bootstrap
if (document.readyState == "complete") {
  TodoStart();
} else {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      TodoStart();
    }
  }
}

function State() {
  this.todos = [];
};

State.prototype.addTodo = function(todo) {
  this.todos.push(todo);
}


function TodoApp(elementId) {
  this.element = document.querySelector("." + elementId);


  this.state = new State();
  this.state.addTodo(this.getTodo("Clean kitchen", true));
  this.state.addTodo(this.getTodo("Pick up children from kindergarten"));

  this.listView = new TodoListView(this.state.todos);
  this.textBox = new TextBox();
}

TodoApp.prototype.getTodo = function(todoStr, done) {
  return {
    text: todoStr,
    done: done || false
  }
}

TodoApp.prototype.render = function() {
  this.element.appendChild(this.listView.render());
  this.element.appendChild(this.textBox.render());
};

function TodoListView(todos) {
  this.element = document.createElement("ul");
  this.element.className = "todo-list"
  this.todos = todos;
  this.template = 
  '<li class="todo-list-item light-border-bottom __DONE__">\
    <span class="dot"></span>\
    <span class="text light-border-left">__TEXT__</span>\
    <span class="delete"></span>\
  </li>';
};

TodoListView.prototype.render = function() {
  var template = this.template;
  var innerHTML = this.todos.map(function(todo) {
    return template.replace("__TEXT__", todo.text).replace("__DONE__", todo.done ? "done" : "");
  }).reduce(function(a, b) {
    return a + b;
  });
  this.element.innerHTML = innerHTML;
  return this.element;
};

function TextBox(element) {
  this.element = document.createElement("div");
  this.element.className = "textbox light-border-bottom";
}

TextBox.prototype.render = function() {
  this.element.innerHTML = '<div class="light-border-left margin-left-column"><input type="text" placeholder="Add a new task..."></input></div>';
  return this.element;
}

function TodoStart() {
  var app = new TodoApp("app-container");
  app.render();
}
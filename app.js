// bootstrap
if (document.readyState == "complete") {
  TodoStart();
} else {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      TodoStart();
    }
  };
}

function Task() {
  this.tasks = [];
  this.idCounter = 0;
  this.listeners = [];
}

Task.prototype.add = function(task) {
  task.id = "todo-" + this.idCounter++;
  this.tasks.push(task);
  this.onChange();
};

Task.prototype.remove = function(id) {
  var found = this.find(id);
  if (found) {
    var foundIndex = this.tasks.indexOf(found);
    this.tasks.splice(foundIndex, 1);
    this.onChange();
  }
};

Task.prototype.toggle = function(id) {
  var found = this.find(id);
  if (found) {
    found.done = !found.done;
    this.onChange();
  }
};

Task.prototype.find = function(id) {
  var filteredtasks = this.tasks.filter(function(task) {
    return task.id === id;
  });
  var found = filteredtasks[0];
  return found;
};

Task.prototype.findAll = function() {
  return this.tasks;
};

Task.prototype.findOpen = function() {
  return this.tasks.filter(function(task) {
    return !task.done;
  });
};

Task.prototype.addListener = function(listener) {
  this.listeners.push(listener);
};

Task.prototype.onChange = function() {
  this.listeners.forEach(function(listener) {
    listener();
  });
};

function TodoApp(elementId) {
  this.element = document.querySelector("." + elementId);

  this.tasks = new Task();
  this.tasks.add({ 
    text: "Clean kitchen",
    done: true
  });
  this.tasks.add({ 
    text: "Pick up children from kindergarten",
    done: false
  });

  this.tasks.addListener(this.onStateChange.bind(this));

  this.listView = new TodoListView();
  this.listView.addDeleteListener(this.onDelete.bind(this));
  this.listView.addToggleListener(this.onToggle.bind(this));
  this.textBox = new TextBox();
  this.textBox.addListener(this.onNewTodo.bind(this));
}

TodoApp.prototype.onDelete = function(todoId) {
  this.tasks.remove(todoId);
};

TodoApp.prototype.onToggle = function(todoId) {
  this.tasks.toggle(todoId);
};

TodoApp.prototype.onNewTodo = function(todoStr) {
  this.tasks.add({
    text: todoStr,
    done: false
  });
};

TodoApp.prototype.onStateChange = function() {
  this.listView.render(this.tasks.findAll());
};

TodoApp.prototype.render = function() {
  this.element.appendChild(this.listView.render(this.tasks.findAll()));
  this.element.appendChild(this.textBox.render());
};

function TodoListView() {
  this.element = document.createElement("ul");
  this.element.className = "todo-list";
  this.template = 
    '<li class="todo-list-item light-border-bottom __DONE__" id="__ID__">' +
      '<span class="dot"></span>' +
      '<span class="text light-border-left">__TEXT__</span>' + 
      '<span class="delete"></span>' +
    '</li>';
  this.deleteListeners = [];
  this.toggleListeners = [];
  this.clickListener = this.onClick.bind(this);
}

TodoListView.prototype.render = function(todos) {
  this.element.removeEventListener("click", this.clickListener, false);
  
  var html = this.generateHTML(todos);
  this.element.innerHTML = html;

  this.element.addEventListener("click", this.clickListener, false);
  return this.element;
};

TodoListView.prototype.generateHTML = function(todos) {
  var template = this.template;
  var html =  todos.map(function(todo) {
    return template.replace("__TEXT__", todo.text)
          .replace("__DONE__", todo.done ? "done" : "")
          .replace("__ID__", todo.id);
  }).reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  }, "");

  return html;
};

TodoListView.prototype.addDeleteListener = function(listener) {
  this.deleteListeners.push(listener);
};

TodoListView.prototype.addToggleListener = function(listener) {
  this.toggleListeners.push(listener);
};

TodoListView.prototype.onClick = function(event) {
  var target = event.srcElement;
  var id = target.parentElement.id;
  if (target.classList.contains("delete")) {
    this.deleteListeners.forEach(function(listener) {
      listener(id);
    });
  } else if (target.classList.contains("dot")) {
    this.toggleListeners.forEach(function(listener) {
      listener(id);
    });
  }
};

function TextBox() {
  this.listeners = [];
  this.element = document.createElement("div");
  this.element.className = "textbox light-border-bottom";
}

TextBox.prototype.addListener = function(listener) {
  this.listeners.push(listener);
};

TextBox.prototype.render = function() {
  var input = this.getInputElement();
  if (input) {
    input.removeEventListener("keypress", this.onKeyPress.bind(this), false);
  }
  this.element.innerHTML = '<div class="light-border-left margin-left-column"><input type="text" placeholder="Add a new task..."></input></div>';
  this.getInputElement().addEventListener("keypress", this.onKeyPress.bind(this), false);
  return this.element;
};

TextBox.prototype.getInputElement = function() {
  return this.element.querySelector("input");
};

TextBox.prototype.onKeyPress = function(event) {
  if (event.keyCode === 13) {
    var inputString = event.target.value;
    if (inputString !== "") {
      this.listeners.forEach(function(listener) {
        listener(inputString);
      });
      event.target.value = "";
    }
  }
};

function TodoStart() {
  var app = new TodoApp("app-container");
  app.render();
}
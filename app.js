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

function TodoApp(elementId) {
  this.element = document.querySelector("." + elementId);

  this.listView = new TodoListView();
  this.textBox = new TextBox();
}

TodoApp.prototype.render = function() {
  this.listView.render();
  this.textBox.render();

  this.element.appendChild(this.listView.element);
  this.element.appendChild(this.textBox.element);
};

function TodoListView() {
  this.element = document.createElement("ul");
  this.element.className = "todo-list"
};

TodoListView.prototype.render = function() {
  this.element.innerHTML = '<li class="todo-list-item light-border-bottom done">\
          <span class="dot"></span>\
          <span class="text light-border-left">Clean the kitchen</span>\
          <span class="delete"></span>\
        </li>\
        <li class="todo-list-item light-border-bottom">\
          <span class="dot"></span>\
          <span class="text light-border-left">Pick up children from kindergarten</span>\
          <span class="delete"></span>\
        </li>';
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
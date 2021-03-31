var taskIdCounter = 0;

var formEl = document.querySelector("#task-form"); 
var tasksToDoEl = document.querySelector("#tasks-to-do"); 
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");
var pageContentE1 = document.querySelector("#page-content");

var taskFormHandler = function(event) { 
    event.preventDefault(); 
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    
    //reset form fields 
    document.querySelector("input[name='task-name']").value="";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    //check if task is new
    var isEdit = formEl.hasAttribute("data-task-id");
    
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };

        createTaskE1(taskDataObj) 
    }
 }; 

 var createTaskE1 = function(taskDataObj) {
   var listItemEl = document.createElement("li"); 
   listItemEl.className = "task-item";
   listItemEl.setAttribute("data-task-id", taskIdCounter);
  
   var taskInfoE1 = document.createElement("div");
   taskInfoE1.className = "task-info";
   taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
   listItemEl.appendChild(taskInfoE1);

   // create task actions
   var taskActionsE1 = createTaskActions(taskIdCounter);
   listItemEl.appendChild(taskActionsE1);
   tasksToDoEl.appendChild(listItemEl);

   taskIdCounter++;

};

var createTaskActions = function(taskId) {
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";

    // create edit button
    var editButtonE1 = document.createElement("button");
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(editButtonE1);

    // create delete button
    var deleteButtonE1 = document.createElement("button");
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className ="btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(deleteButtonE1);

    var statusSelectE1 = document.createElement("select");
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectE1.appendChild(statusOptionE1);
    };

    actionContainerE1.appendChild(statusSelectE1);

    return actionContainerE1;
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    formE1.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event){
    var targetE1 = event.target;

    if (targetE1.matches(".edit-btn")){
        var taskId = targetE1.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if (targetE1.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");

    var statusValue = event.target.value.toLowercase();

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressE1.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedE1.appendChild(taskSelected);
    }
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id'" + taskId + "']");

    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    formeE1.setAttribute("data-task-id", taskId);

    formEl.setAttribute("#save-task").textContent ="saveTask";
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};


    formEl.addEventListener("submit", taskFormHandler);
    pageContentE1.addEventListener("click", taskButtonHandler);
    pageContentE1.addEventListener("change", taskStatusChangeHandler);
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form"); 
var tasksToDoEl = document.querySelector("#tasks-to-do"); 
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var tasks = [];

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
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
 }; 

 var createTaskEl = function(taskDataObj) {
   var listItemEl = document.createElement("li"); 
   listItemEl.className = "task-item";
   listItemEl.setAttribute("data-task-id", taskIdCounter);
   console.log(taskDataObj);
   console.log(taskDataObj.status);
  
   var taskInfoEl = document.createElement("div");
   taskInfoEl.className = "task-info";
   taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
   listItemEl.appendChild(taskInfoEl);

   switch (taskDataObj.status) {
       case "to do":
           taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
           tasksToDoEl.append(listItemEl);
           break;
        case "completed":
            tasksActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.append(listItemEl);
            break;
        default:
            console.log("something went wrong")
   }

   taskDataObj.id = taskIdCounter;

   tasks.push(taskDataObj);

   saveTasks();

   taskIdCounter++;

};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className ="btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    formEl.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event){
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if (targetEl.matches(".delete-btn")) {
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
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id'" + taskId + "']");

    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    formeEl.setAttribute("data-task-id", taskId);

    formEl.setAttribute("#save-task").textContent ="saveTask";
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks=updatedTaskArr;
    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//get task items from local storage
//converts tasks from the string format to an array
// iterates through a tasks array and creates task elements on the page

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    for (var i = 0; i < savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
    }
};



    formEl.addEventListener("submit", taskFormHandler);
    pageContentEl.addEventListener("click", taskButtonHandler);
    pageContentEl.addEventListener("change", taskStatusChangeHandler);

    loadTasks();
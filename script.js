let tasks = {
  list: []
}
let completedTasks = {
  list: []
};

const messageDiv = document.getElementById('message');
const tableOfCompletedTasks = document.querySelector('.completed');
let tableOfCompletedTasksStatus = null;

const getDate = () => {
  let today = new Date();
  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let year = today.getFullYear();
  today = `${day}/${month}/${year}`;
  return today;
}

/******************* Check local storage ***********************/
const checkLocalStorage = () => {
  //localStorage.clear();
  if (localStorage.length != 0) {
    // current tasks
    let savedValues = JSON.parse(localStorage.getItem('myTasks'));
    tasks = savedValues;
    const list = document.querySelector(".tasks");
    let tableContent = null;

    for (let i = 0; i < savedValues.list.length; i++) {
      tableContent = "<td>";
      tableContent += `${savedValues.list[i].name}`;
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += "<input type='checkbox' class='current'> </input>";
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += `${savedValues.list[i].dateOfCreation}`;
      tableContent += "</td>";

      // a column for subtasks
      if (savedValues.list[i].subtasks) {
        tableContent += "<td class='inputFields'>";
        tableContent += "</td>";
      } else {
        tableContent += "<td>";
        tableContent += "</td>";
      }

      const row = document.createElement('tr');
      row.className = "task";
      row.innerHTML = tableContent;
      list.appendChild(row);

      // if a task has subtasks, display them
      if (savedValues.list[i].subtasks) {
        for (let j = 0; j < savedValues.list[i].subtasks.length; j++) {
          const tableRow = document.createElement('tr');
          tableRow.className = "subtask";
          tableRow.innerHTML += `<td>${savedValues.list[i].subtasks[j].subtaskName} </td> <td> <input type="checkbox" class="subtasksCheckbox"> </td>`;
          row.lastChild.appendChild(tableRow);
        }

        // display subtasks marked as completed
        const taskRow = document.querySelectorAll(".task");
        const subtaskRow = taskRow[i].querySelectorAll(".subtask");
        for (let j = 0; j < savedValues.list[i].subtasks.length; j++) {
          if (savedValues.list[i].subtasks[j].completed === true) {
            const additionalColumn = document.createElement('td');
            additionalColumn.textContent = "completed";
            subtaskRow[j].className = "completedSubtask";
            subtaskRow[j].appendChild(additionalColumn);
          }
        }

      }
    }
  }

  // completed tasks
  if (localStorage.getItem("completedTasks") !== null) {
    let savedValuesCompleted = JSON.parse(localStorage.getItem('completedTasks'));
    completedTasks = savedValuesCompleted;
    const listCompleted = document.querySelector(".completedTasks");
    let tableContentCompleted = null;

    for (let i = 0; i < savedValuesCompleted.list.length; i++) {
      tableContentCompleted = "<td>";
      tableContentCompleted += `${savedValuesCompleted.list[i].name}`;
      tableContentCompleted += "</td>";
      tableContentCompleted += "<td>";
      tableContentCompleted += "<input type='checkbox' class='completedCheckbox'> </input>";
      tableContentCompleted += "</td>";
      tableContentCompleted += "<td>";
      tableContentCompleted += `${savedValuesCompleted.list[i].dateOfCreation}`;
      tableContentCompleted += "</td>";
      tableContentCompleted += "<td>";
      tableContentCompleted += `${savedValuesCompleted.list[i].dateOfCompletion}`;
      tableContentCompleted += "</td>";

      const row = document.createElement('tr');
      row.className = "completedTask";
      row.innerHTML = tableContentCompleted;
      listCompleted.appendChild(row);
    }

    // Hide table of completed tasks if there are no completed tasks
    if (savedValuesCompleted.list.length === 0) {
      tableOfCompletedTasks.style.display = "none";
      tableOfCompletedTasksStatus = false;
    } else {
      tableOfCompletedTasks.style.display = "block";
      tableOfCompletedTasksStatus = true;
    }
  }
}

checkLocalStorage();

/*********** Show and hide warnings *************/
// function which creates a warning
const showWarning = (message) => {
  messageDiv.innerHTML = `<h2 class="warning"> ${message} </h2>`;;
}

// function which removes warning if it exists
const hideWarning = () => {
  if (messageDiv.getElementsByTagName('h2').length > 0) {
    messageDiv.innerHTML = "";
  }
}

/**************** Add tasks *********************/
const addTask = () => {
  const input = document.getElementById("add_task_input");
  const list = document.querySelector(".tasks");
  let tableContent = null;

  const row = document.createElement('tr');
  // if no data are entered in the input field, show a warning
  if (input.value.length === 0) {
    showWarning('No data are provided for the name of the task!');
  } else {
    tasks.list.push({
      name: input.value,
      dateOfCreation: getDate()
    });
      // if a warning about empty input was shown earlier, hide it
      hideWarning();

      tableContent = "<td>";
      tableContent += tasks.list[tasks.list.length-1].name;
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += "<input type='checkbox' class='current'> </input>";
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += tasks.list[tasks.list.length-1].dateOfCreation;
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += "</td>";

      row.innerHTML = tableContent;
      row.className = "task";
      list.appendChild(row);

      input.value = "";
      // save tasks to local storage
      localStorage.setItem('myTasks', JSON.stringify(tasks));

  }
}

document.getElementById("add_task_button").addEventListener("click", addTask);

/**************** Delete tasks *****************/
const deleteTask = () => {
  let count = 0;

  // delete current tasks
  const checkboxes = document.querySelectorAll(".current");
  for (let i = 0; i < checkboxes.length; i++) {
    /***********/
    // delete subtasks
    let countSubtasks = 0;
    const checkboxesSubtasks = checkboxes[i].parentNode.parentNode.lastChild.querySelectorAll(".subtasksCheckbox");
      for (let j = 0; j < checkboxesSubtasks.length; j++) {
        if (checkboxesSubtasks[j].checked === true) {
         /* Determine from which tasks delete a subtask depending on a  checkbox position. Checkboxes of current tasks
         are in the same order as the tasks in the array */
         let localCheckbox = checkboxesSubtasks[j].parentNode.parentNode.parentNode.parentNode.firstChild.nextSibling.firstChild;
         const checkboxesArray = Array.from(checkboxes);

          if (countSubtasks === 0) {
            tasks.list[checkboxesArray.indexOf(localCheckbox)].subtasks.splice(j, 1);
          } else {
            tasks.list[checkboxesArray.indexOf(localCheckbox)].subtasks.splice(j-countSubtasks, 1);
          }
        countSubtasks += 1;
        checkboxesSubtasks[j].parentNode.parentNode.parentNode.removeChild(checkboxesSubtasks[j].parentNode.parentNode);
        }
      }
    /************/
    if (checkboxes[i].checked === true) {
        checkboxes[i].parentNode.parentNode.parentNode.removeChild(checkboxes[i].parentNode.parentNode);
        if (count === 0) {
          tasks.list.splice(i, 1);
        } else {
          tasks.list.splice(i-count, 1);
        }
        count += 1;
    }
  }
  // save updated tasks to the local storage
 localStorage.setItem('myTasks', JSON.stringify(tasks));

  // delete completed tasks
  const completedCheckboxes = document.querySelectorAll(".completedCheckbox");
  for (let j = 0; j < completedCheckboxes.length; j++) {
    if (completedCheckboxes[j].checked === true) {
      completedCheckboxes[j].parentNode.parentNode.parentNode.removeChild(completedCheckboxes[j].parentNode.parentNode);
      if (count === 0) {
        completedTasks.list.splice(j, 1);
      } else {
        completedTasks.list.splice(j-count, 1);
      }
      count += 1;
    }
  }
  // save updated completed tasks to the local storage
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

  // if after deletion there are no more completed tasks hide the table of completed tasks
  if (completedTasks.list.length === 0) {
    tableOfCompletedTasks.style.display = "none";
    tableOfCompletedTasksStatus = false;
  }
}

document.getElementById("delete").addEventListener("click", deleteTask);

/********************** Edit tasks **********************/
let edited = false;
const editTask = () => {
  // if any warning was shown earlier, hide it
  hideWarning();

  if (edited === false) {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked === true
        && checkboxes[i].className !== "completedCheckbox") {
        let taskName = checkboxes[i].parentNode.parentNode.firstChild.textContent;

        let taskNameField = null;
        if (checkboxes[i].className == "current") {
          taskNameField = checkboxes[i].parentNode.parentNode.firstChild;
        }

        if (checkboxes[i].className == "subtasksCheckbox") {
          taskNameField = checkboxes[i].parentNode.parentNode.firstChild;
        }

        taskNameField.textContent = "";
        const inputField = document.createElement('input');
        inputField.className = "edited";
        taskNameField.appendChild(inputField);
        inputField.value = taskName;
        edited = true;
      }

      if (checkboxes[i].checked === true && checkboxes[i].className === "completedCheckbox") {
        showWarning('Completed tasks cannot be edited!');
      }
    }
  }
}

document.getElementById("edit").addEventListener("click", editTask);

  /******************* Save edited tasks to the local storage *******************/
const saveChanges = () => {
  // if any warning was shown earlier, hide it
  hideWarning();

  if (edited === true) {
    // save edited tasks
    const checkboxes = document.querySelectorAll(".current");
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].parentNode.parentNode.firstChild.firstChild.tagName === "INPUT") {
        tasks.list[i].name = checkboxes[i].parentNode.parentNode.firstChild.firstChild.value;
        // save updated tasks to the local storage
        localStorage.setItem('myTasks', JSON.stringify(tasks));
        checkboxes[i].parentNode.parentNode.firstChild.textContent = tasks.list[i].name;
      }

    // save edited subtasks
      const subtasksCheckbox = checkboxes[i].parentNode.parentNode.lastChild.querySelectorAll(".subtasksCheckbox");
      for (let j = 0; j < subtasksCheckbox.length; j++) {
        if (subtasksCheckbox[j].parentNode.parentNode.firstChild.firstChild.tagName == "INPUT") {
          tasks.list[i].subtasks[j].subtaskName = subtasksCheckbox[j].parentNode.parentNode.firstChild.firstChild.value;
          localStorage.setItem('myTasks', JSON.stringify(tasks));
          subtasksCheckbox[j].parentNode.parentNode.firstChild.textContent = tasks.list[i].subtasks[j].subtaskName;
          }
        }
    } // for loop
  }
  edited = false;
}

document.getElementById("save").addEventListener("click", saveChanges);

/******************** Mark tasks as complete **********************/
const markComplete = () => {
  // if any warning was shown earlier, hide it
  hideWarning();

  let count = 0;
  const checkboxes = document.querySelectorAll(".current");

  /* remove selected tasks from "tasks" array and paste them
    into "completedTasks" array */
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true && checkboxes[i].className !== "completedCheckbox") {
      checkboxes[i].parentNode.parentNode.parentNode.removeChild(checkboxes[i].parentNode.parentNode);
      if (count === 0) {
        tasks.list[i].dateOfCompletion = getDate();
        completedTasks.list.push(tasks.list[i]);
        tasks.list.splice(i, 1);
      } else {
        tasks.list[i-count].dateOfCompletion = getDate();
        completedTasks.list.push(tasks.list[i-count]);
        tasks.list.splice(i-count, 1);
      }
      count += 1;
    }

    // Mark subtasks as completed
    const subtasksCheckbox = checkboxes[i].parentNode.parentNode.lastChild.querySelectorAll(".subtasksCheckbox");
    for (let j = 0; j < subtasksCheckbox.length; j++ ) {
      if (subtasksCheckbox[j].checked === true) {
        if (subtasksCheckbox[j].parentNode.parentNode.lastChild.className != "additionalColumn") {
          const additionalColumn = document.createElement('td');
          additionalColumn.className = "additionalColumn";
          subtasksCheckbox[j].parentNode.parentNode.appendChild(additionalColumn);
          additionalColumn.textContent = "completed";
          tasks.list[i].subtasks[j].completed = true;
        }
        subtasksCheckbox[j].parentNode.parentNode.className = "completedSubtask";
      }
    }
}
  // save updated tasks to the local storage
  localStorage.setItem('myTasks', JSON.stringify(tasks));
  // save completed tasks to the local storage
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

  /* update table of completed tasks by removing all rows displayed previously
  and displaying them again according to a new array of completed tasks */
  const list = document.querySelector(".completedTasks");
  let tableContent = null;

  let rows = document.querySelectorAll('.completedTasks tr');
  for (let i = 0; i < rows.length; i++) {
    list.removeChild(rows[i]);
  }

  for (let i = 0; i < completedTasks.list.length; i++) {
    const row = document.createElement('tr');

    tableContent = "<td>";
    tableContent += completedTasks.list[i].name;
    tableContent += "</td>";

    tableContent += "<td>";
    tableContent += "<input type='checkbox' class='completedCheckbox'> </input>";
    tableContent += "</td>";

    tableContent += "<td>";
    tableContent += completedTasks.list[i].dateOfCreation;
    tableContent += "</td>";

    tableContent += "<td>";
    tableContent += completedTasks.list[i].dateOfCompletion;
    tableContent += "</td>";

    row.innerHTML = tableContent;
    row.className = "completedTask";
    list.appendChild(row);
    }

    // Display a table of completed tasks if a new task is marked as completed
    let savedValuesCompleted = JSON.parse(localStorage.getItem('completedTasks'));
    if (tableOfCompletedTasksStatus === false && savedValuesCompleted.list.length > 0) {
      tableOfCompletedTasks.style.display = "block";
      tableOfCompletedTasksStatus = true;
    }
}

document.getElementById("complete").addEventListener("click", markComplete);

/********************* Select all tasks **********************/
// a function which selects or unselects all checkboxes at once
const selectAll = (checkboxesType) => {
  let count = 0;
  for (let i = 0; i < checkboxesType.length; i++) {
    if (checkboxesType[i].checked === true) {
      count++;
    }
  }

  if (count === checkboxesType.length) {
    for (let i = 0; i < checkboxesType.length; i++) {
    checkboxesType[i].checked = false;
    }
  } else {
    for (let i = 0; i < checkboxesType.length; i++) {
    checkboxesType[i].checked = true;
    }
  }
//localStorage.clear();
}

document.getElementById("select-all-current").addEventListener("click", () => {
  let checkboxesCurrent = document.querySelectorAll(".current");
  selectAll(checkboxesCurrent);
});

document.getElementById("select-all-completed").addEventListener("click", () => {
  let checkboxesCompleted = document.querySelectorAll(".completedCheckbox");
  selectAll(checkboxesCompleted);
});

/********************* Add a subtask to the selected task ********************/
const addSubtask = () => {
  hideWarning();

  let checkboxesCurrent = document.querySelectorAll(".current");
  const tableColumnHeader = document.createElement("td");

  for (let i = 0; i < checkboxesCurrent.length; i++) {
    if (checkboxesCurrent[i].checked === true
      && checkboxesCurrent[i].parentNode.parentNode.lastChild.className != "inputFields") {
        const inputForSubtask = document.createElement("input");
        checkboxesCurrent[i].parentNode.parentNode.lastChild.className = "inputFields";
        checkboxesCurrent[i].parentNode.parentNode.lastChild.appendChild(inputForSubtask);
    }
    else if (checkboxesCurrent[i].checked === true
      && checkboxesCurrent[i].parentNode.parentNode.lastChild.firstChild.tagName != "INPUT") {
      const inputForSubtask = document.createElement("input");
      checkboxesCurrent[i].parentNode.parentNode.lastChild.insertBefore(inputForSubtask, checkboxesCurrent[i].parentNode.parentNode.lastChild.childNodes[0]);
    }
  }

  // show warning if a user tries to add a subtask to a completed task
  let checkboxesCompleted = document.querySelectorAll(".completedCheckbox");
  for (let i = 0; i < checkboxesCompleted.length; i++) {
    if (checkboxesCompleted[i].checked === true) {
      showWarning('You cannot add subtasks to the tasks marked as completed');
    }
  }

}

document.getElementById("addSubtask").addEventListener("click", addSubtask);

// Save subtasks
const saveSubtask = () => {
    hideWarning();
    let checkboxesCurrent = document.querySelectorAll(".current");

    for (let i = 0; i < checkboxesCurrent.length; i++) {
      if (checkboxesCurrent[i].checked === true) {
        if (checkboxesCurrent[i].parentNode.parentNode.lastChild.firstChild.value.length > 0) {
          if (!tasks.list[i].subtasks) {
            tasks.list[i].subtasks = [];
          }

          tasks.list[i].subtasks.push({
            subtaskName: checkboxesCurrent[i].parentNode.parentNode.lastChild.firstChild.value,
            subtaskDateOfCreation: getDate()
          });
          // save updated tasks to the local storage
          localStorage.setItem('myTasks', JSON.stringify(tasks));

          // after getting data from the input filed remove it
          checkboxesCurrent[i].parentNode.parentNode.lastChild.removeChild(checkboxesCurrent[i].parentNode.parentNode.lastChild.firstChild);

          // display subtasks on the screen
          const row = document.createElement('tr');
          row.innerHTML += `<td> ${tasks.list[i].subtasks[tasks.list[i].subtasks.length-1].subtaskName} </td> <td> <input type="checkbox" class="subtasksCheckbox"> </td>`;
          row.className  = "subtask";
          checkboxesCurrent[i].parentNode.parentNode.lastChild.appendChild(row);
        } else {
          showWarning('You cannot create a subtask with no name!');
        }
      }
    }
}

document.getElementById("saveSubtask").addEventListener("click", saveSubtask);

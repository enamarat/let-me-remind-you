let tasks = {
  list: []
}
let completedTasks = {
  list: []
};

const messageDiv = document.getElementById('message');

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
      tableContent += "<input type='checkbox'> </input>";
      tableContent += "</td>";
      tableContent += "<td>";
      tableContent += `${savedValues.list[i].dateOfCreation}`;
      tableContent += "</td>";
      const row = document.createElement('tr');
      row.innerHTML = tableContent;
      list.appendChild(row);
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
      tableContentCompleted += "<td class='completion'>";
      tableContentCompleted += `${savedValuesCompleted.list[i].dateOfCompletion}`;
      tableContentCompleted += "</td>";
      const row = document.createElement('tr');
      row.innerHTML = tableContentCompleted;
      listCompleted.appendChild(row);
    }
  }

}

checkLocalStorage();

/*********** Show andd hide warnings *************/
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
      // if warning about empty input was shown earlier, hide it
      hideWarning();

      tableContent = "<td>";
      tableContent += tasks.list[tasks.list.length-1].name;
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += "<input type='checkbox'> </input>";
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += tasks.list[tasks.list.length-1].dateOfCreation;
      tableContent += "</td>";

      row.innerHTML = tableContent;
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
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true) {
      if (checkboxes[i].parentNode.parentNode.lastChild.className !== "completion") {
        checkboxes[i].parentNode.parentNode.parentNode.removeChild(checkboxes[i].parentNode.parentNode);
        if (count === 0) {
          tasks.list.splice(i, 1);
        } else {
          tasks.list.splice(i-count, 1);
        }
        count += 1;
      }
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

}

document.getElementById("delete").addEventListener("click", deleteTask);

/********************* Select all tasks **********************/
let allCheckboxesSelected = false;
// a function which selects or unselects all checkboxes at once
const selectAll = () => {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  // unselect all checkboxes if the "Select all" button is clicked second time
  if (allCheckboxesSelected === true) {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    allCheckboxesSelected = false;
  } else if (allCheckboxesSelected === false) {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
    allCheckboxesSelected = true;
  }
  //localStorage.clear();
}

document.getElementById("select-all").addEventListener("click", selectAll);

  /********************** Edit tasks **********************/
  let edited = false;
  const editTask = () => {
    if (edited === false) {
      const checkboxes = document.querySelectorAll("input[type='checkbox']");
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
          let taskName = checkboxes[i].parentNode.parentNode.firstChild.textContent;
          let taskNameField = checkboxes[i].parentNode.parentNode.firstChild;

          taskNameField.textContent = "";
          const inputField = document.createElement('input');
          inputField.className = "edited";
          taskNameField.appendChild(inputField);
          inputField.value = taskName;
          edited = true;

        }
      }
    }

  }

  document.getElementById("edit").addEventListener("click", editTask);

  /******************* Save edited tasks to local storage *******************/
  const saveChanges = () => {
    if (edited === true) {
      const checkboxes = document.querySelectorAll("input[type='checkbox']");
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].parentNode.parentNode.firstChild.firstChild.tagName === "INPUT") {
          tasks.list[i].name = checkboxes[i].parentNode.parentNode.firstChild.firstChild.value;
          // save updated tasks to the local storage
         localStorage.setItem('myTasks', JSON.stringify(tasks));
         checkboxes[i].parentNode.parentNode.firstChild.textContent = tasks.list[i].name;
        }
      }
    }
    edited = false;
  }

  document.getElementById("save").addEventListener("click", saveChanges);

  /******************** Mark tasks as complete **********************/
  const markComplete = () => {
    // if any warning was shown earlier, hide it
    hideWarning();

    let count = 0;
    const checkboxes = document.querySelectorAll("input[type='checkbox']");

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
      if (checkboxes[i].checked === true && checkboxes[i].className === "completedCheckbox") {
        console.log('Hey!');
        showWarning('The task is already completed!');
      }
  }
    // save updated tasks to the local storage
   localStorage.setItem('myTasks', JSON.stringify(tasks));
   // save completed tasks to the local storage
   localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

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

      tableContent += "<td class='completion'>";
      tableContent += completedTasks.list[i].dateOfCompletion;
      tableContent += "</td>";

      row.innerHTML = tableContent;
      list.appendChild(row);
      }

}

  document.getElementById("complete").addEventListener("click", markComplete);

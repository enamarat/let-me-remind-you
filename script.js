let tasks = {
  list: []
}
let completedTasks = {
  list: []
};

const getDate = () => {
  let today = new Date();
  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let year = today.getFullYear();
  today = `${day}/${month}/${year}`;
  return today;
}

const checkLocalStorage = () => {
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
      tableContentCompleted += "<input type='checkbox'> </input>";
      tableContentCompleted += "</td>";
      tableContentCompleted += "<td>";
      tableContentCompleted += `${savedValuesCompleted.list[i].dateOfCreation}`;
      tableContentCompleted += "</td>";
      const row = document.createElement('tr');
      row.innerHTML = tableContentCompleted;
      listCompleted.appendChild(row);
    }
  }

}

checkLocalStorage();

/*************************************************/
const addTask = () => {
  const input = document.getElementById("add_task_input");
  const list = document.querySelector(".tasks");

  const existingListItems = document.querySelectorAll("tr");
  let tableContent = null;

  // function which creates a warning
  const showWarning = () => {
    tableContent = "<tr class='warning'>";
    tableContent += "<td>";
    tableContent += "No data is entered!";
    tableContent += "</td>";
    tableContent += "</tr>";
    row.innerHTML = tableContent;
    list.appendChild(row);
  }

  // function which removes warning if it exists
  const hideWarning = () => {
    for (let i = 0; i < existingListItems.length; i++) {
      if (existingListItems[i].textContent.toLowerCase() === "no data is entered!") {
        list.removeChild(existingListItems[i]);
      }
    }
  }

  const row = document.createElement('tr');
  // if no data is entered in the input field, show a warning
  if (input.value.length === 0) {
    // prevent warning duplication
    hideWarning();
    showWarning();
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

/*************************************************/
const deleteTask = () => {
  let count = 0;
  const checkboxes = document.querySelectorAll("input[type='checkbox']");

  for (let i = 0; i < checkboxes.length; i++) {
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
}

document.getElementById("delete").addEventListener("click", deleteTask);

/*************************************************/
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
}

document.getElementById("select-all").addEventListener("click", selectAll);

  /*************************************************/
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

  /*************************************************/
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

  /*************************************************/
  const markComplete = () => {

    let count = 0;
    const checkboxes = document.querySelectorAll("input[type='checkbox']");


    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked === true) {
        checkboxes[i].parentNode.parentNode.parentNode.removeChild(checkboxes[i].parentNode.parentNode);
        if (count === 0) {
          completedTasks.list.push(tasks.list[i]);
          tasks.list.splice(i, 1);
        } else {
          completedTasks.list.push(tasks.list[i-count]);
          tasks.list.splice(i-count, 1);
        }
        count += 1;
      }
  }
  // save updated tasks to the local storage
 localStorage.setItem('myTasks', JSON.stringify(tasks));
 // save completed tasks to the local storage
 localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

 const list = document.querySelector(".completedTasks");
 let tableContent = null;

 let rows = document.querySelectorAll('.completedTasks tr');
 console.log(rows);
  for (let i = 0; i < rows.length; i++) {
    list.removeChild(rows[i]);
  }

  for (let i = 0; i < completedTasks.list.length; i++) {
    const row = document.createElement('tr');
    tableContent = "<td>";
  //  tableContent += completedTasks.list[completedTasks.list.length-1].name;
    tableContent += completedTasks.list[i].name;
    tableContent += "</td>";

    tableContent += "<td>";
    tableContent += "<input type='checkbox'> </input>";
    tableContent += "</td>";

    tableContent += "<td>";
  //  tableContent += completedTasks.list[completedTasks.list.length-1].dateOfCreation;
    tableContent += completedTasks.list[i].dateOfCreation;
    tableContent += "</td>";

    row.innerHTML = tableContent;
    list.appendChild(row);
    }

    //localStorage.clear();
}

  document.getElementById("complete").addEventListener("click", markComplete);

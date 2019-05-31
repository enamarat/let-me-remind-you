let tasks = null;

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

  } else {
    tasks = {
      list: []
    }
  }
}

checkLocalStorage();

//////////////////////////////////////
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
//console.log(tasks);
      // if warning about empty input was shown earlier, hide it
      hideWarning();

      //tableContent = "<tr>";
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

/////////////////////////////////////////
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

// a function which selects or unselects all checkboxes at once
let allCheckboxesSelected = false;

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

  //localStorage.clear();

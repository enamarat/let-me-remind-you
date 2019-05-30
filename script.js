let tasks = null;

const checkLocalStorage = () => {
  if (localStorage.length != 0) {
    let savedValues = JSON.parse(localStorage.getItem('myTasks'));
    tasks = savedValues;
    const list = document.querySelector(".tasks");
    let tableContent = null;

    for (let i = 0; i < savedValues.list.length; i++) {
      tableContent = "<td>";
      tableContent += `${savedValues.list[i]}`;
      tableContent += "</td>";
      tableContent += "<td>";
      tableContent += "<input type='checkbox'> </input>";
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
    // create a warining
    tableContent = "<tr class='warning'>";
    tableContent += "<td>";
    tableContent += "No data is entered!";
    tableContent += "</td>";
    tableContent += "</tr>";
    row.innerHTML = tableContent;
    list.appendChild(row);
  } else {
    tasks.list.push(input.value);
console.log(tasks);
      // if warning about empty input was shown earlier, hide it
      hideWarning();

      //tableContent = "<tr>";
      tableContent = "<td>";
      tableContent += tasks.list[tasks.list.length-1];
      tableContent += "</td>";

      tableContent += "<td>";
      tableContent += "<input type='checkbox'> </input>";
      tableContent += "</td>";
      //tableContent += "</tr>";

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
  // save updated tasks to local storage
 localStorage.setItem('myTasks', JSON.stringify(tasks));
}

document.getElementById("delete").addEventListener("click", deleteTask);

//////////////////////////////////////
const selectAll = () => {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");

  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = true;
  }
}

document.getElementById("select-all").addEventListener("click", selectAll);

  //localStorage.clear();

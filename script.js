let tasks = null;

const checkLocalStorage = () => {
  if (localStorage.length != 0) {
    let savedValues = JSON.parse(localStorage.getItem('myTasks'));
console.log(savedValues.list);
console.log(localStorage.length);

  tasks = savedValues;
    const list = document.querySelector(".tasks");
    let listContent = null;

    for (let i = 0; i < savedValues.list.length; i++) {
      listContent = "<li>";
      listContent += savedValues.list[i];
      listContent += "<input type='checkbox'> </input>";
      listContent += "</li>";
      const li = document.createElement('li');
      li.innerHTML = listContent;
      list.appendChild(li);
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
  const li = document.createElement('li');
  const existingListItems = document.querySelectorAll("li");
  let listContent = null;

  // function which removes warning if it exists
  const hideWarning = () => {
    for (let i = 0; i < existingListItems.length; i++) {
      if (existingListItems[i].textContent.toLowerCase() === "no data is entered!") {
        list.removeChild(existingListItems[i]);
      }
    }
  }

  // if no data is entered in the input field, show a warning
  if (input.value.length === 0) {
    // prevent warning duplication
    hideWarning();
    // create a warining
    listContent = "<li class='warning'>";
    listContent = "No data is entered!";
    listContent += "</li>";
    li.innerHTML = listContent;
    list.appendChild(li);
  } else {
    tasks.list.push(input.value);
console.log(tasks);
      // if warning about empty input was shown earlier, hide it
      hideWarning();

      listContent = "<li>";
      listContent += tasks.list[tasks.list.length-1];
      listContent += "<input type='checkbox'> </input>";
      listContent += "</li>";

      li.innerHTML = listContent;
      list.appendChild(li);

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
      checkboxes[i].parentNode.parentNode.removeChild(checkboxes[i].parentNode);
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

  //localStorage.clear();
}

document.getElementById("select-all").addEventListener("click", selectAll);

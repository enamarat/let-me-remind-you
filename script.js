let tasks = [];

const addTask = () => {
  const input = document.getElementById("add_task_input");
  const list = document.querySelector(".tasks");
  const li = document.createElement('li');
  const existingListItems = document.querySelectorAll("li");
  let listContent = null;

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
    tasks.push(input.value);
  console.log(tasks);
      // if warning about empty input was shown earlier, hide it
      hideWarning();

      listContent = "<li>";
      listContent += tasks[tasks.length-1];
      listContent += "<input type='checkbox'> </input>";
      listContent += "</li>";

      li.innerHTML = listContent;
      list.appendChild(li);

      input.value = "";
  }
}

document.getElementById("add_task_button").addEventListener("click", addTask);



const deleteTask = () => {
  const tasksToDelete = [];
  let count = 0;
  const checkboxes = document.querySelectorAll("input[type='checkbox']");

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true) {
      checkboxes[i].parentNode.parentNode.removeChild(checkboxes[i].parentNode);
      if (count === 0) {
        tasks.splice(i, 1);
      } else {
        tasks.splice(i-count, 1);
      }
      count += 1;
    }
  }


console.log(tasks);

}

document.getElementById("delete").addEventListener("click", deleteTask);

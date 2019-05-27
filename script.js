let tasks = [];

const addTask = () => {
  const input = document.getElementById("add_task_input");

  if (input.value.length === 0) {
    console.log('No data is entered!');
  } else {
    tasks.push(input.value);
    console.log(tasks);
      const list = document.querySelector(".tasks");
      const li = document.createElement('li');

      let listContent = "<li>";
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
  const checkboxes = document.querySelectorAll("input[type]");
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true) {
      tasks.splice(i, 1);
      checkboxes[i].parentNode.parentNode.removeChild(checkboxes[i].parentNode);
    }
  }
}

document.getElementById("delete").addEventListener("click", deleteTask);

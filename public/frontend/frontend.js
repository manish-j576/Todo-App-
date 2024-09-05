

console.log("Script started frontend");

async function main() {
  let response = await fetch("http://localhost:8080/");
  let data = await response.json();
  console.log(data);

  let todoList = document.getElementById("todoList");
  data.forEach((dataPacket) => {
    let todoItem = document.createElement("div");
    todoItem.innerHTML = `
        <div class="todo-item">
          <p class="serialNo" >${dataPacket.id}</p>
          <p>${dataPacket.todo}</p>
          <p>${dataPacket.date}</p>
          <button id=${dataPacket.id} class="deleteBtn">delete</button>
        </div>
      `;
    todoList.appendChild(todoItem);
  });
  document.getElementById("add").addEventListener("click", addTodo);
  function addTodo() {
    console.log("hello world");
    let todoName = document.getElementById("todo").value;
    let todoDate = document.getElementById("date").value;
    axios.post("http://localhost:8080/", {
      todo: `${todoName}`,
      date: `${todoDate}`,
    });
    location.reload();
  }


  let deleteBtn = document.querySelectorAll(".deleteBtn")
  function deleteTodo(event){

    let id = event.srcElement.id
    console.log(id)
    
   axios.delete(`http://localhost:8080/?id=${id}`)
   
   console.log("Item deleted")
   location.reload();
  }
  deleteBtn.forEach((item)=>{
    item.addEventListener("click",deleteTodo)
  })


}

main();

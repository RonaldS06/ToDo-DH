// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = document.querySelector("#closeApp");
  const userName = document.querySelector(".user-name")
  const formCrearTarea = document.querySelector(".nueva-tarea")
  const addTask = document.querySelector("#nuevaTarea")
  const tareasPendientes = document.querySelector(".tareas-pendientes")
  const tareasTerminadas = document.querySelector(".tareas-terminadas")
  const cantidadFinalizadas = this.document.querySelector("#cantidad-finalizadas")

  //Fetch url
  const url = "https://todo-api.digitalhouse.com/v1"
  //Token
  const tokenUser = localStorage.getItem("token")
  console.log(tokenUser)

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {

    let exitValid = confirm("¿Seguro de cerrar sesión?")

    if (exitValid) {
      window.location.href = "index.html"
      localStorage.clear()
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const settings = {
      method: 'GET',
      headers: {
        'Authorization': `${tokenUser}`,
        'Content-Type': `application/json`
      }
    }
    realizarPeticion(settings)

  };

  obtenerNombreUsuario()

  async function realizarPeticion(settings) {
    try {
      const response = await fetch(`${url}/users/getMe`, settings)
      const data = await response.json()

      const nombreUser = data.firstName

      userName.innerText = nombreUser.charAt(0).toUpperCase() + nombreUser.slice(1)

    } catch (error) {
      console.log("👉Este es un error: " + error)
    }

  }


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {

    const settings = {
      method: "GET",
      headers: {
        'Authorization': `${tokenUser}`,
        'Content-type': `application/json`
      }
    }

    peticionListaTareas(settings)


  };
  consultarTareas()

  async function peticionListaTareas(settings) {
    try {
      const response = await fetch(`${url}/tasks`, settings)
      const data = await response.json()
      console.log(data)
      renderizarTareas(data)
      tareasFinalizadas(data)

    } catch (error) {
      console.log(`Esto es un error 👉 ${error}`)
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {

    event.preventDefault()

    const isValidTask = validarTexto(addTask.value, "Ingresa la tarea a realizar")

    let tasks
    if (isValidTask) {
      tasks = {
        description: addTask.value,
        completed: false
      }
    } else {
      return
    }

    const settings = {
      method: 'POST',
      body: JSON.stringify(tasks),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': tokenUser,
      }
    }

    crearTarea(settings)
    formCrearTarea.reset()

  });

  async function crearTarea(settings) {
    try {
      const response = await fetch(`${url}/tasks`, settings)
      const data = await response.json()
      console.log(data)
      location.reload()
    } catch (error) {
      console.log("Esto es un error: " + error)
    }
  }


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    listado.map(lista => {
      if (!lista.completed) {
        //Container Tasks
        const task = document.createElement("li")
        task.setAttribute("data-id", lista.id)
        task.classList.add("tarea")
        //btn+description
        const btnDescContainer = document.createElement("div")
        btnDescContainer.classList.add("descripcion")
        //Description Tasks
        const description = document.createElement("a")
        description.classList.add("nombre")
        //Check Button
        const checkButton = document.createElement("button")
        checkButton.setAttribute("id", lista.id)
        const timeStamp = document.createElement("p")
        timeStamp.classList.add("timestamp")


        tareasPendientes.appendChild(task)
        task.appendChild(checkButton)
        task.appendChild(btnDescContainer)
        // task.appendChild(deleteButton)
        btnDescContainer.appendChild(description)
        btnDescContainer.appendChild(timeStamp)
        // btnDescContainer.appendChild(deleteIcon)

        description.innerHTML = `${lista.description}`
        timeStamp.textContent = new Date(lista.createdAt).toLocaleDateString()


        // Llama a la función para asignar el evento al botón de estado
        botonesCambioEstado(checkButton, lista)

        // botonBorrarTarea(deleteIcon)
      }

    })
  };

  function tareasFinalizadas(listado) {
    let contador = 0
    listado.map((lista, index) => {
      if (lista.completed) {
        //Container Tasks
        const task = document.createElement("li")
        task.setAttribute("data-id", lista.id)
        task.setAttribute("id", index)
        task.classList.add("tarea")
        //btn+description
        const btnDescContainer = document.createElement("div")
        btnDescContainer.classList.add("descripcion")
        //Description Tasks
        const description = document.createElement("a")
        description.classList.add("nombre")
        //Delete button
        const deleteButton = document.createElement("button")
        deleteButton.classList.add("borrar")
        const deleteIcon = document.createElement("i")
        deleteIcon.setAttribute('id', lista.id)
        deleteIcon.setAttribute("class", `fas fa-trash-alt`)
        //Check button
        const checkButton = document.createElement("button")
        checkButton.classList.add("hecha")
        const checkIcon = document.createElement("i")
        checkIcon.setAttribute("class", "far fa-check-circle")
        //Rehacer Tarea a incompleta
        const incompleteTask = document.createElement("button")
        incompleteTask.classList.add("incompleta")
        const incompleteIcon = document.createElement("i")
        incompleteIcon.setAttribute('id', lista.id)
        incompleteIcon.setAttribute("class", `fas fa-undo-alt`)

        tareasPendientes.appendChild(task)
        task.appendChild(checkButton)
        checkButton.append(checkIcon)
        task.appendChild(btnDescContainer)
        btnDescContainer.appendChild(description)
        //Tarea incompleta
        btnDescContainer.appendChild(incompleteTask)
        incompleteTask.appendChild(incompleteIcon)
        //Borrar tarea
        btnDescContainer.appendChild(deleteButton)
        deleteButton.appendChild(deleteIcon)

        tareasTerminadas.appendChild(task)
        description.innerHTML = `${lista.description}`

        // Llama a la función para asignar el evento al botón de estado
        botonesCambioEstado(incompleteIcon, lista)
        botonBorrarTarea(deleteIcon)
        contador++
        cantidadFinalizadas.innerText = contador
      }
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(btnEstado, taskEstado) {
    btnEstado.addEventListener("click", (e) => {
      const btnId = e.target.id
      const updatedTask = {
        description: taskEstado.description,
        completed: !taskEstado.completed
      }

      const settings = {
        method: "PUT",
        body: JSON.stringify(updatedTask),
        headers: {
          'Authorization': tokenUser,
          'Content-Type': 'application/json'
        }
      }

      // Llamar a la función para enviar la solicitud PUT
      requireTask(settings, btnId)
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(deleteIcon) {
    const settings = {
      method: "DELETE",
      headers: {
        'Authorization': tokenUser,
        'Content-Type': 'application/json'
      }
    }
    deleteIcon.addEventListener("click", (e) => {
      const idButton = e.target.id
      // console.log(idButton)
      if (idButton) {
        requireTask(settings, idButton)
      }
    })

  };

  async function requireTask(settings, id) {
    try {
      const response = await fetch(`${url}/tasks/${id}`, settings)
      const data = await response.json()
      console.log(data)
      location.reload()
    } catch (error) {
      console.log("Esto es un error: " + error)
    }
  }
});
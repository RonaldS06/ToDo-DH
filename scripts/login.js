window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector("form")
    const inputEmail = document.querySelector("#inputEmail")
    const inputPassword = document.querySelector("#inputPassword")
    const errorMessage = document.querySelector(".errorMessage")

    const url = "https://todo-api.digitalhouse.com/v1"
    const tokenUser = localStorage.getItem('token')

    if (tokenUser) {
        location.replace("./mis-tareas.html")
    }
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault()

        const isValidEmail = validarEmail(inputEmail.value)
        const isValidPassword = validarContrasenia(inputPassword.value)

        const isValid = isValidEmail && isValidPassword

        let payload;
        if (isValid) {
            payload = {
                email: inputEmail.value,
                password: inputPassword.value
            }
        }
        // console.log(payload)
        if (payload !== undefined) {
            const settings = {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    "Content-type": "application/json"
                }
            }

            realizarLogin(settings)
        }

    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    //Validar si el correo existe

    async function realizarLogin(settings) {

        try {
            const response = await fetch(`${url}/users/login`, settings)
            const data = await response.json()

            if (JSON.stringify(data) === `"Contraseña incorrecta"`) {
                errorMessage.classList.remove("disabled")
                errorMessage.innerText = `${JSON.stringify(data)}`
                return
            }

            console.log(data)

            localStorage.setItem('token', data.jwt)
            console.log(`👉Data jwt del usuario ${JSON.stringify(data)}`)
            if (!data.jwt) {
                errorMessage.classList.remove("disabled")
                errorMessage.innerText = `${JSON.stringify(data)}`
            } else {
                location.replace("./mis-tareas.html")
            }


        } catch (err) {
            console.log(`👉Se ve un error: ${err}`)
        }
    };

});
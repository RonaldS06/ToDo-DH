window.addEventListener("load", function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector("form");
    const inputNombre = document.querySelector("#inputNombre");
    const inputApellido = document.querySelector("#inputApellido");
    const inputEmail = document.querySelector("#inputEmail");
    const inputPassword = document.querySelector("#inputPassword");
    const inputPasswordRepetida = document.querySelector("#inputPasswordRepetida");


    const url = "https://todo-api.digitalhouse.com/v1";

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let mensajeNombre = "Por favor ingrese correctamente su nombre";
        let mensajeApellido = "Por favor ingrese correctamente su apellido";

        const isValidnombre = validarTexto(inputNombre.value, mensajeNombre);
        const isValidapellido = validarTexto(inputApellido.value, mensajeApellido);
        const isValidmail = validarEmail(inputEmail.value);
        const isValidpassword = validarContrasenia(inputPassword.value);
        const isValidpasswordRepetida = validarContrasenia(
            inputPasswordRepetida.value
        );
        const arePasswordsEqual = compararContrasenias(
            inputPassword.value,
            inputPasswordRepetida.value
        );

        //! Todos retornan false, entonces como este es false no pasa a la condicion isValid
        // console.log(isValidnombre + "🤔");

        const isValid =
            isValidnombre &&
            isValidapellido &&
            isValidmail &&
            isValidpassword &&
            isValidpasswordRepetida &&
            arePasswordsEqual;

        let payload;

        if (isValid) {
            payload = {
                firstName: inputNombre.value,
                lastName: inputApellido.value,
                email: inputEmail.value,
                password: inputPassword.value,
            };
        }

        if (payload !== undefined) {
            console.log(`Enviando los datos ${payload}`);
            const settings = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            };

            realizarRegister(settings);

            console.log("Datos enviados");
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    async function realizarRegister(settings) {
        try {
            const response = await fetch(`${url}/users`, settings);
            const data = await response.json();
            console.log(data);
            console.log(data.jwt);

            //Guardamos el token en LocalStorage
            if (data.jwt) {
                localStorage.setItem('tokens', data.jwt);
                form.reset();
                console.log("Redireccionando")
                setTimeout(() => {
                    // window.location.href = "mis-tareas.html"
                    location.replace("./mis-tareas.html")
                    alert("Registrado con éxito")
                }, 10000);
            }

        } catch (error) {
            console.log("Este es un " + error);
        }
    }
});


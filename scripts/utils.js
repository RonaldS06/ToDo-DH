/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto, message) {
    let isValid = normalizarTexto(texto);

    if (isValid === "" || isValid.length < 3) {
        alert(message);
        return false;
    }
    return true;
}

function normalizarTexto(texto) {
    return texto.toLowerCase().trim();
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    let isValid = normalizarEmail(email);
    let regExp = new RegExp("[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}");
    if (isValid === "") {
        alert("Por favor ingrese correctamente su correo");
        return false;
    } else if (!regExp.test(email)) {
        alert("El mail ingresado es incorrecto");
        return false;
    }
    return true;
}

function normalizarEmail(email) {
    return email.toLowerCase().trim();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    if (contrasenia === "" || contrasenia.length <= 5) {
        alert("La contraseña debe tener mínimo 5 carácteres👁️");
        return false;
    } else if (contrasenia.includes(" ")) {
        alert("La contraseña no debe contener espacios");
        return false;
    }
    return true;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    if (contrasenia_1 !== contrasenia_2) {
        alert("Las contraseñas no coinciden🤔");
        return false;
    }
    return true;
}

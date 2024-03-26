const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function FormcreateElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'innerText')
            element.innerText = value
        else
            element.setAttribute(key, value);
    }
    return element;
}

export function FormAppendElements(parent, ...children) {
    children.forEach(child => parent.appendChild(child));
}

export function checkEmail(event) {
    let inputEmail = event.target.value
    if (inputEmail.match(EMAIL_REGEX) )
    {
        printError("email", false, "")
        return true;
    }
    else
    {
        printError("email", true, "Wrong email address")
        return false;
    }
}

export function printError(field, isError, innerText)
{
    if (isError)
        document.querySelector(`form .error[for="` + field + `"]`).classList.remove("d-none");
    else
        document.querySelector(`form .error[for="` + field + `"]`).classList.add("d-none");
    document.querySelector(`form .error[for="` + field + `"]`).innerHTML = innerText;
}

export function checkBlankField(event)
{
    let value = event.target.value;
    let field = event.target.getAttribute("id");
    if (value === "")
    {
        document.querySelector(`form .error[for="` + field + `"]`).classList.remove("d-none");
        document.querySelector(`form .error[for="` + field + `"]`).innerHTML = "this fields must not be blank";
        return false;
    }
    else
    {
        document.querySelector(`form .error[for="` + field + `"]`).classList.add("d-none");
        return true;
    }
}
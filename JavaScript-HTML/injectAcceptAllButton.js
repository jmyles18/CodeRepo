var first = true;

function injectAcceptButton() {
    var btnContainer = document.querySelector(".save-preference-btn-container");
    btnContainer.setAttribute("id", "ot-button-container");
    var acceptBtn = document.createElement("button");
    acceptBtn.setAttribute("id", "accept-recommended-btn-handler");
    acceptBtn.setAttribute("class", "button-theme");
    acceptBtn.innerText = "Allow All";
    var poweredByLogo = document.querySelector(".ot-pc-footer-logo");
    poweredByLogo.setAttribute("id", "powered-by-onetrust");

    btnContainer.insertBefore(acceptBtn, poweredByLogo)
    first = false;
}
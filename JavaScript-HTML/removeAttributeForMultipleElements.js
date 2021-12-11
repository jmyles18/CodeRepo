function removeTabIndex() {
    var links = document.querySelectorAll('#onetrust-policy-text p a');
    console.log("links" + links);

    for (var i = 0; i < links.length; i++) {
        links[i].removeAttribute("tabindex");
        console.log("tabindex removed");
    }
}
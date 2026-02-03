if (window.location.hash == "#thanks") {
    document.getElementsByClassName("hk-form")[0].style.display = "none";
    document.getElementById("hk-form-thanks").style.display = "";
}

document.getElementsByClassName("hk-form")[0].addEventListener("submit", function (e) {
    retURL = document.getElementsByName("retURL")[0];
    if (retURL.value.indexOf("http") != 0) {
        retURL.value = window.location.origin + retURL.value;
    }
})

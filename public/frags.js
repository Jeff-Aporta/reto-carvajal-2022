document.getElementById("seccion-encabezado").innerHTML = readText("-encabezado.html")

if (localStorage.getItem("acceso") == "true") {
  document.getElementById("btn-login").style.display = "none";
  document.getElementById("btn-logout").style.display = "";
  document.getElementById("btn-wish").style.display = "";
} else {
  document.getElementById("btn-login").style.display = "";
  document.getElementById("btn-logout").style.display = "none";
  document.getElementById("btn-wish").style.display = "none";
}


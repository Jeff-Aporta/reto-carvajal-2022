socket = io();

socket.emit("consultar catalogo");

if (localStorage.getItem("acceso") == "true") {
  document.getElementById("btn-nuevo-producto").style.display = "";
} else {
  document.getElementById("btn-nuevo-producto").style.display = "none";
}

socket.on("catalogo completo", (catalogo) => {
  localStorage.setItem("catalogo", JSON.stringify(catalogo, null, "\t"));
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) ?? [];
  let ids = [];
  for (const w of wishlist) {
    ids.push(w.ID);
  }
  html = "";
  for (const producto of catalogo) {
    html += `<div class='item' ${
      Number(producto.CANTIDAD) ? "" : "style='opacity:0.3;'"
    }>`;
    html += `<div class='id'>`;
    html += "ID: " + producto.ID;
    html += "</div>";
    html += `<div class='titulo' title="${producto.NOMBRE}">`;
    html += producto.NOMBRE;
    html += "</div>";
    html += "<table>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td class='imagen'>";
    html += `<img src = ${producto.IMAGENES.split(",")[0]}>`;
    html += "</td>";
    html += "<td class='descripcion'>";
    html += producto.DESCRIPCION;
    html += "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td class='precio'>";
    html += Number(producto.PRECIO).formatMoney();
    html += "</td>";
    html += "<td class='cantidad'>";
    html += "cantidad: " + producto.CANTIDAD;
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    if (localStorage.getItem("acceso") == "true") {
      html += "<hr>";
      if (ids.includes(producto.ID)) {
        html += `<span class='btn btn-danger' onclick="quitarWishlist('${producto.ID}')">`;
        html += `<i class="fas fa-heart-broken"></i> Quitar de Wishlist`;
      } else {
        html += `<span class='btn btn-primary'onclick="agregarWishlist('${escape(
          JSON.stringify(producto)
        )}')">`;
        html += `<i class="fas fa-heart"></i> Agregar a Wishlist`;
      }
      html += "</span>";
    }
    html += "</div>";
  }
  document.getElementById("catalogo").innerHTML = html;
});

function quitarWishlist(ID) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) ?? [];
  for (let i = 0; i < wishlist.length; i++) {
    if (wishlist[i].ID == ID) {
      wishlist.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  socket.emit("escribir archivo", "wishlist", JSON.stringify(wishlist));
  socket.emit("consultar catalogo");
}

function agregarWishlist(producto_json) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) ?? [];
  let producto = JSON.parse(unescape(producto_json));
  wishlist.push(producto);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  socket.emit("escribir archivo", "wishlist", JSON.stringify(wishlist));
  socket.emit("consultar catalogo");
}

function logout() {
  localStorage.removeItem("acceso");
  localStorage.removeItem("wishlist");
  location.reload();
}

async function login() {
  let { value: usuario } = await swal.fire({
    title: "Login",
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    html: `
          Usuario: usr, Contraseña: 123
          <br>
          <form name="form" onsubmit="return false">
               <input type="text" placeholder="Usuario" id="usuario-lin" class="swal2-input" required>
               <br>
               <input type="password" placeholder="Contraseña" id="contraseña-lin" class="swal2-input" required>
               <br>
               <br>
               <span class="btn btn-danger" onclick="Swal.clickCancel()">
                    Cancelar
               </span>
               <button class="btn btn-primary" onclick="if(!document.forms['form']['name'].required) Swal.clickConfirm()">
                    Ingresar
               </button>
          <form>
          `,
    preConfirm: () => {
      let usuario = document.getElementById("usuario-lin").value;
      let contraseña = document.getElementById("contraseña-lin").value;
      if (usuario == "usr" && contraseña == "123") {
        return "true";
      } else {
        Swal.showValidationMessage(`Usuario o contraseña incorrectos`);
        return false;
      }
    },
  });
  if (usuario) {
    localStorage.setItem("acceso", "true");
    socket.emit("leer archivo", "wishlist");
  }
}

socket.on("archivo consultado:", (nombre, valor) => {
  switch (nombre) {
    case "wishlist":
      localStorage.setItem("wishlist", valor)
      location.reload()    
      break;
    default:
      break;
  }
});


socket.on("archivo NO consultado:", (nombre) => {
  switch (nombre) {
    case "wishlist":
      socket.emit("escribir archivo", "wishlist", "[]");
      location.reload()    
      break;
    default:
      break;
  }
});

async function nuevoProducto() {
  let { value: producto } = await swal.fire({
    title: "Nuevo producto",
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    allowEnterKey: false,
    html: `
          <form name="form"  onsubmit="return false">
               <input type="text" placeholder="Imagenes" id="imagenes-np" class="swal2-input" required>
               <br>
               <input type="text" placeholder="Nombre" id="nombre-np" class="swal2-input" maxlength="100" required>
               <br>
               <input type="number" placeholder="Precio" id="precio-np" class="swal2-input" required>
               <br>
               <input type="number" placeholder="Cantidad" id="cantidad-np" class="swal2-input" required>
               <br>
               <textarea  id="descripcion-np" placeholder="Descripción" class="swal2-textarea" maxlength="200" required></textarea>
               <br>
               <br>
               <button class="btn btn-danger" onclick="Swal.clickCancel()">
                    Cancelar
               </button>
               <button class="btn btn-primary" onclick="if(!document.forms['form']['name'].required) Swal.clickConfirm()">
                    Crear
               </button>
          <form>
          `,
    preConfirm: () => {
      return {
        IMAGENES: document.getElementById("imagenes-np").value,
        NOMBRE: document.getElementById("nombre-np").value,
        PRECIO: document.getElementById("precio-np").value,
        CANTIDAD: document.getElementById("cantidad-np").value,
        DESCRIPCION: document.getElementById("descripcion-np").value,
      };
    },
  });
  if (producto) {
    socket.emit("agregar producto a inventario", producto);
  }
}

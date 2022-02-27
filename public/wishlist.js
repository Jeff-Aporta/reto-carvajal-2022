socket = io();

function logout() {
  localStorage.removeItem("acceso");
  localStorage.removeItem("wishlist");
  var root = location.protocol + "//" + location.host;
  window.open(root, "_self");
}

cargarWishlist();

function cargarWishlist() {
  html = "";
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) ?? [];
  if (wishlist.length) {
    for (const w of wishlist) {
      html += `<div class="item" style="${
        Number(w.CANTIDAD) ? "" : "opacity:0.3"
      }">`;
      html += `<table>`;
      html += `<tbody>`;
      html += `<tr>`;
      html += `<td rowspan="5" class="imagenProducto">`;
      html += `<img src="${w.IMAGENES.split(",")[0]}">`;
      html += `</td>`;
      html += `<th>Nombre: </th>`;
      html += `<td>`;
      html += w.NOMBRE;
      html += `</td>`;
      html += `</tr>`;
      html += `<tr>`;
      html += `<th>Precio: </th>`;
      html += `<td>`;
      html += w.PRECIO;
      html += `</td>`;
      html += `</tr>`;
      html += `<tr>`;
      html += `<th>Descripción: </th>`;
      html += `<td>`;
      html += w.DESCRIPCION;
      html += `</tr>`;
      html += `</td>`;
      html += `<tr>`;
      html += `<th>Existencia: </th>`;
      html += `<td>`;
      html += w.CANTIDAD;
      html += `</td>`;
      html += `</tr>`;
      html += `<tr>`;
      html += `<td colspan="2" style="text-align: right;">`;
      html += ` <span class="btn btn-danger" onclick="quitarWishlist('${w.ID}')">
                  <i class="fas fa-heart-broken"></i> Quitar de Wishlist
                </span>`;
      html += `&nbsp;`;
      html += `<span class="btn btn-primary" onclick="${
        !Number(w.CANTIDAD)
          ? "swal.fire('Error','No hay existencia','error')"
          : "swal.fire('Éxito','Agregado al carrito','success')"
      }"><i class="fas fa-cart-plus"></i> Comprar</span>`;
      html += `</td>`;
      html += `</tr>`;
      html += `</tbody>`;
      html += `</table>`;
      html += `</div>`;
    }
  } else {
    html += `<div class="no-hay-items">`;
    html += `No hay elementos en el wishlist`;
    html += `</div>`;
  }
  console.log(wishlist);
  document.getElementById("wishlist").innerHTML = html;
}

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
  cargarWishlist();
}

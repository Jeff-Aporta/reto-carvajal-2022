const base_de_datos = require("mongoose");
const Schema = require("mongoose").Schema;

const fs = require("fs");

base_de_datos
  .connect(
    "mongodb+srv://udt:udtccsso@cluster0.fceho.mongodb.net/reto-carvajal?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then((_) =>
    console.log("todo correcto con la base de datos desde socket.js")
  )
  .catch((_) =>
    console.log("Ha habido error al conectar la base de datos " + _)
  );

const objeto = base_de_datos.model(
  "objetos",
  new Schema({
    _id: String,
    valor: String,
  })
);

module.exports = function (io, app) {
  io.on("connection", (socket) => {
    socket.on("agregar producto a inventario", (producto) => {
      producto.ID = (Math.random() + "").replace("0.", "");
      leerArchivo("productos", (txt) => {
        inventario = JSON.parse(txt);
        inventario.push(producto);
        escribirArchivo("productos", JSON.stringify(inventario, null, "\t"));
      });
    });

    socket.on("consultar catalogo", () => {
      leerArchivo("productos", (txt) => {
        io.to(socket.id).emit("catalogo completo", JSON.parse(txt));
      });
    });

    socket.on("escribir archivo", (nombre, contenido) => {
      escribirArchivo(nombre, contenido);
    });

    socket.on("escribir archivo", (nombre, contenido) => {
      escribirArchivo(nombre, contenido);
    });

    socket.on("leer archivo", (nombre) => {
      leerArchivo(
        nombre,
        (txt) => {
          io.to(socket.id).emit("archivo consultado:", nombre, txt);
        },
        () => {
          io.to(socket.id).emit("archivo NO consultado:", nombre);
        }
      );
    });
  });
};

function leerArchivo(name, promesa, promesa2 = () => {}) {
  objeto.find({ _id: name }).exec(function (error, wish) {
    if (wish[0]) {
      promesa(wish[0].valor);
    } else {
      promesa2();
    }
  });
}

function escribirArchivo(name, text) {
  datos = { _id: name, valor: text };
  const datoGuardar = new objeto(datos);
  objeto.findByIdAndUpdate(
    { _id: datos._id },
    datoGuardar,
    function (err, obj) {
      if (!obj) {
        datoGuardar.save();
      } else {
      }
    }
  );
}

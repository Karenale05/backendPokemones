var express = require('express');
var api = express();
api.use(express.json());

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Firulais1',
  database: 'listadodepokemones'
});

connection.connect();

// ACA SE PASA LA LISTA DE POKEMONES

function obtenerListaPokemones(request, response){
    
    var query = `
    select
        numeroPokedex,
        imagenPokemon,
        nombrePokemon,
        g.nombre GeneracionDePokemon,
        t.tipo,
        t2.tipo FuerteContra,
        t3.tipo DebilContra
    from
        pokemones p
    join generaciones g 
    on p.idGeneracion = g.ID 
    join tiposdepokemones t 
    on p.idTipoPokemon = t.ID 
    join tiposdepokemones t2
    on p.idTipoFuerteContra = t2.ID
    join tiposdepokemones t3
    on p.idTipoDebilContra  = t3.ID
    `
    connection.query(query, function(err, rows, fields) {
        response.send(rows)
      });

}

api.get('/obtenerListaPokemones', obtenerListaPokemones);

// ACA SE AGREGAN POKEMONES

function agregarPokemonALista(request, response){

    var numeroPokedex=request.body['numeroPokedex']
    var nombrePokemon=request.body['nombrePokemon']
    var imagenPokemon=request.body['imagenPokemon']
    var idGeneracion=request.body['idGeneracion']
    var idTipoPokemon=request.body['idTipoPokemon']
    var idTipoFuerteContra=request.body['idTipoFuerteContra']
    var idTipoDebilContra=request.body['idTipoDebilContra']

    var query=`
    INSERT into pokemones (numeroPokedex,imagenPokemon,nombrePokemon,idGeneracion,idTipoPokemon,idTipoFuerteContra,idTipoDebilContra)
    values ('${numeroPokedex}','${imagenPokemon}','${nombrePokemon}',${idGeneracion},${idTipoPokemon},${idTipoFuerteContra},${idTipoDebilContra})
`
    console.log ("Aqui se agregarian pokemones", query)

    connection.query(query, function(err, rows, fields) {

        response.send("Se agrego correctamente")
      });
}

api.post('/agregarPokemonALista', agregarPokemonALista);

//ACA SE ELIMINA

function eliminarpokemon(request, response){

   var numeroPokedex=request.params['numeroPokedex']

   var query=
   `DELETE FROM pokemones  where numeroPokedex = '${numeroPokedex}'`

   connection.query(query, function(err, rows, fields) {

    response.send("Se elimino el pokemon correctamente " + numeroPokedex)

  });


}

api.delete('/eliminarpokemon/:numeroPokedex', eliminarpokemon);

//ACA SE MODIFICAN POKEMONES

function modificarPokemon(request, response){

    var numeroPokedex=request.params['numeroPokedex']

    var nombrePokemon=request.body['nombrePokemon']
    var imagenPokemon=request.body['imagenPokemon']
    var idGeneracion=request.body['idGeneracion']
    var idTipoPokemon=request.body['idTipoPokemon']
    var idTipoFuerteContra=request.body['idTipoFuerteContra']
    var idTipoDebilContra=request.body['idTipoDebilContra']

var query =
`UPDATE pokemones 
set imagenPokemon = '${imagenPokemon}', nombrePokemon ='${nombrePokemon}',idGeneracion = ${idGeneracion}, idTipoPokemon = ${idTipoPokemon}, idTipoFuerteContra = ${idTipoFuerteContra}, idTipoDebilContra = ${idTipoDebilContra}
WHERE numeroPokedex = '${numeroPokedex}';`

connection.query(query, function(err, rows, fields) {

    response.send("Se modifico el pokemon " + numeroPokedex)

  });

}

api.put('/modificarPokemon/:numeroPokedex', modificarPokemon)


// Funcion que se ejecuta al empezar a escuchar
function escuchando() {
    console.log ("No entiendo pero anda. La api ya esta escuchando en el puerto 3000")
}

// a partir de aca la api empieza a escuchar en el puerto 5000
api.listen(5000, escuchando)
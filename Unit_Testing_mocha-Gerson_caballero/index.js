const express = require('express');
const bodyParser = require('body-parser');
// initialize our express app
const app = express();
app.use(bodyParser());

const mongo = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'

var server = app.listen(8081, function () {
});

mongo.connect(url, { useMongoClient: true}, (err, client) => {
    if (err) {
      console.error(err)
      return
    }

    const db = client.db('banco');
    const collection = db.collection('banco');
    const collectionabono = db.collection('abono');
    const collectionretiro = db.collection('retiro');

    app.post('/api/cuenta/crear', function(req, res){
        var nombre = req.body.nombre;
        var cedula = req.body.cedula;

        var fecha = new Date;

        collection.find({nombre: nombre}).toArray((err, items, next) => {
            if (err) {
                console.error(err)
                return
            }
        
            if (items.length != 0) {
                res.send({succes: false})
            }
            else {
                collection.insertOne({cedula: cedula, nombre: nombre, amount: 0, date: fecha}, (err, result) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                });
      
                res.send(200)
            }
        });
    });

    app.post('/api/cuenta/abono', function(req, res){
        var cantidad = req.body.cantidad;
        var cedula = req.body.cedula;
        var newamount = 0;

        var fecha = new Date;

        if(cantidad > 10000){
            res.send({succes: false})
        }
        else{
            collection.find({cedula: cedula}).toArray((err, items, next) => {
                if(items.length != 0) {
                    res.send({succes: false})
                }
                else{
                    if (items.length != 0) newamount = cantidad + items[0].amount; 
                
                    collection.updateOne({cedula: cedula}, {'$set': {'amount': newamount}}, (err, item) => {
    
                        collectionabono.insertOne({cedula: items[0].cedula, nombre: items[0].nombre, amount: cantidad, date: fecha}, (err, result) => {
                            if (err) {
                                console.error(err)
                            }
        
                            res.send("El abono se realizo exitosamente" + item)
                        });
                    });
                }
               
            });
        }
    });

    app.post('/api/cuenta/retiro', function(req, res){
        var cantidad = req.body.cantidad;
        var cedula = req.body.cedula;
        var newamount = 0;
        var fecha = new Date;

        if(cantidad > 10000){
            res.send("No se puede enviar más de 10000 lempiras.")
        }
        else{
            collectionretiro.find({cedula: cedula}).toArray((err, items) =>{
                var cont = 0;
                for(var i = 0; i < items.length; i++){
                    var fecharetiro = new Date(items[i].date)
                    if (fecha.getDate() == fecharetiro.getDate() && fecha.getMonth() == fecharetiro.getMonth() && fecha.getFullYear() ==  fecharetiro.getFullYear() && fecha.getHours() ==  fecharetiro.getHours() && fecha.getMinutes() ==  fecharetiro.getMinutes()) {
                        cont++;
                    }

                    if(cont == 2){
                        cedula = "";
                        i = items.length
                        res.send({succes: false})
                    }
                }

                collection.find({cedula: cedula}).toArray((err, items) => {
                    if (items.length != 0){
                        if (items[0].amount > 50000){
                            newamount = items[0].amount - (cantidad * 0.015);
                        }
                        else{
                            newamount = items[0].amount - cantidad;
                        }
                        
                        if(newamount < 0){
                            res.send({succes: false})
                        }
                        else if(cantidad > 4000){
                            res.send({succes: false})
                        }
                        else{
                            collection.updateOne({cedula: cedula}, {'$set': {'amount': newamount}}, (err, item) => {
        
                                collectionretiro.insertOne({cedula: cedula, nombre: items[0].nombre, amount: cantidad, date: fecha}, (err, result) => {
                                    if (err) {
                                        console.error(err)
                                    }
                
                                    res.send("El retiro se realizo exitosamente")
                                });
                            });
                        }  
                    }
                    else{
                        res.send({succes:false})
                    }  
                });
                
            });
        }
    });

    app.delete('/api/cuenta/eliminar', function(req, res){
        var cedula = req.body.cedula;

        collection.deleteOne({cedula: cedula}, (err, item) => {
           res.send("Usuario eliminado con exito.")
        });
    });
});
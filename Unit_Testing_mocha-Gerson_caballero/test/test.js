var chai = require('chai');
var should = require('chai').should();
var chaiHttp = require('chai-http');
const server = 'http://localhost:8081';
const expect = require('chai').expect;

chai.use(chaiHttp);

describe('Banco', function(){
    describe('Crear cuenta', function(){
        it('CrearCuenta_CuentaNoExiste_TRUE', function() {
            chai.request(server)
            .post('/api/cuenta/crear')
            .send({
                nombre: 'Melvin Martinez',
                cedula: '0054198602453'
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('CrearCuenta_SiExisteLaCuenta_False', function() {
            chai.request(server)
            .post('/api/cuenta/crear')
            .send({
                nombre: 'Melvin Martinez',
                cedula: '0054198602453'
            })
            .then(function (res) {
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
            })
            .catch(function (err) {
                throw err;
            });
        });
    }),
    describe('Abonar', function(){
        it('AbonarEnCuenta_AbonarMontoCuenta_TRUE', function() {
            chai.request(server)
            .post('/api/cuenta/abono')
            .send({
                cantidad: 2000,
                cedula: '0054198602453'
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('AbonarEnCuenta_NoSePuedenAbonarMasDe10000Lempiras_FALSE', function() {
            chai.request(server)
            .post('/api/cuenta/abono')
            .send({
                cantidad: 10001,
                cedula: '0054198602453'
            })
            .then(function (res) {
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('AbonarEnCuenta_LaCuentaNoExiste_FALSE', function() {
            chai.request(server)
            .post('/api/cuenta/abono')
            .send({
                cantidad: 2000,
                cedula: '0463199900567'
            })
            .then(function (res) {
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
            })
            .catch(function (err) {
                throw err;
            });
        });
    }),
    describe('Retirar', function(){
        it('RetirarEnCuenta_RetiroDeLaCuenta#1_TRUE', function() {
            chai.request(server)
            .post('/api/cuenta/retiro')
            .send({
                cantidad: 500,
                cedula: '0054198602453'
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('RetirarEnCuenta_RetiroDeLaCuenta#2_TRUE', function() {
            chai.request(server)
            .post('/api/cuenta/retiro')
            .send({
                cantidad: 500,
                cedula: '0054198602453'
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('RetirarEnCuenta_SoloSePuedenHacer2RetirosPorMinuto_FALSE', function() {
            chai.request(server)
            .post('/api/cuenta/retiro')
            .send({
                cantidad: 500,
                cedula: '0054198602453'
            })
            .then(function (res) {
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('RetirarEnCuenta_LaCuentaNoEstaActiva_FALSE', function() {
            chai.request(server)
            .post('/api/cuenta/retiro')
            .send({
                cantidad: 500,
                cedula: '00129289301932'
            })
            .then(function (res) {
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('RetirarEnCuenta_LaCantidadQueQuiereRetirarEsMayorALaActual_FALSE', function() {
            chai.request(server)
            .post('/api/cuenta/retiro')
            .send({
                cantidad: 3500,
                cedula: '0502199804426'
            })
            .then(function (res) {
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
            })
            .catch(function (err) {
                throw err;
            });
        });
        it('RetirarEnCuenta_LaCantidadMaximaDeRetiroEsDe4000Lempiras_FALSE', function() {
            chai.request(server)
            .post('/api/cuenta/retiro')
            .send({
                cantidad: 5000,
                cedula: '0502199804426'
            })
            .then(function (res) {
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
            })
            .catch(function (err) {
                throw err;
            });
        });
    });
});
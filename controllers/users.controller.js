var {
    checkCredentials,
    checkTenantInfo,
    getUser
} = require('../services/user.service');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


//Metodo para realizar el login desde el endpoint
const External_login = async function (req, res, next) {
    console.log("Request: "+req.body)
    const {
        email,
        password,
        tenant
    } = req.body;

    try {
        console.log("01- Comienza el proceso de validacion")
        var isUserRegistered = await checkCredentials(email,password);
        console.log(isUserRegistered)
        if (isUserRegistered) {
            console.log("03- User validado, busca info del tenant")
            var TenantInfo = await checkTenantInfo(tenant);
            var User = await getUser(email,tenant);
            const token = await jwt.sign(User.toJSON(),TenantInfo.jwt_secret,{expiresIn:'1d'});
            console.log("06- Termina el crear Token")
            return res.status(200).json({
                status:200,
                token,
                message: "Token created successfully"
            });

        } else {
            return res.status(400).json({
                status: 400,
                data: isUserRegistered,
                message: "Couldn´t find credentials"
            });
        }
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}

module.exports = {
    External_login
}




/*
var UserService = require('../services/user.service');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getUsers = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)
    var User = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({token: createdUser, message: "Succesfully Created User"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "User Creation was Unsuccesfull"})
    }
}

exports.updateUser = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;
    var User = {
        id,
        name: req.body.name ? req.body.name : null,
        email: req.body.email ? req.body.email : null,
        password: req.body.password ? req.body.password : null
    }
    try {
        var updatedUser = await UserService.updateUser(User)
        return res.status(200).json({status: 200, data: updatedUser, message: "Succesfully Updated User"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeUser = async function (req, res, next) {

    var id = req.params.id;
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}


exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    var User = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await UserService.loginUser(User);
        return res.status(201).json({token: loginUser, message: "Succesfully login"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: "Invalid username or password"})
    }
}*/

var {app, PropertyModel} = require("../server.js");
var mongoose = require('mongoose');

const handleData = (req,res) =>{

    PropertyModel.find().then(console.log)

    /* PropertyModel.find().then(data => {
        res.send(data)
      })
     .catch(err => {
        console.error(err)
      }) */
}

module.exports = {
    handleData: handleData
};
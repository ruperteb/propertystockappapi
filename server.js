const express = require("express");
const cors = require('cors')

var mongoose = require('mongoose');

const MainList = require("./Controllers/Mainlist");

//Set up default mongoose connection
var mongoDB = 'mongodb://Rupert:fishes12@ds259738.mlab.com:59738/heroku_h375wbjc';
mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false });

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

let propertySchema = new mongoose.Schema({
    _id: Number,
        BuildingName: String, 
        Address: String,
        Suburb: String,
        EarliestOccupation: Date,
        EarliestExpiry: Date,
        ErfExtent: Number,
        TotalGLA: Number,
        VacantArea: Number,
        BuildingType: String,
        Province: String,
        Region: String,
        Agency: String,
        Agent: String,
        Phone: String,
        Email: String,
        Aerial: String,
        MainPhoto: String,
        SecondPhoto: String,
        Premises: [	
            {
              _id: Number,
          id: Number,
          Floor: String,
          Area: Number,
          Vacant: String,
          Type: String,
          Occupation: Date,
          PremisesNotes: String,
          NetRental: Number,
          OpCosts: Number,
          Other: Number,
          GrossRental: Number,
          Esc: Number,
          OpenBays: Number,
          OpenRate: Number,
          CoveredBays: Number,
          CoveredRate: Number,
          ShadedBays: Number,
          ShadedRate: Number,
          ParkingRatio: Number,
          Tenant: String,
          LeaseExpiry: Date,
          TenantNotes: String,
          Yard: Number,
          Height: Number,
          Doors: Number,
          Loading: String,
          Sprinklered: String,
          Canopies: String,
          Power: String
        }]
    
})


  let PropertyModel = mongoose.model('PropertyModel', propertySchema);



  let agencySchema = new mongoose.Schema({
    _id: Number,
        AgencyName: String, 
        AgencyWebsite: String,
        AgencyEmail: String,
        AgencyPhone: String,
        Agents: [	
            {
              _id: Number,
              AgentName: String, 
              AgentEmail: String,
              AgentPhone: String        
        }]
    
})


  let AgencyModel = mongoose.model('AgencyModel', agencySchema);


   const app = express();
   app.use(express.json());
   app.use(cors());



  /* PropertyModel.findOne().sort({_id: -1}).exec(function(err, result) {return result._id;
   });
 */





   app.post( "/mainlist/add", async function( request, response ) {
    const {BuildingName} = await request.body;
    console.log(request.body);
let lastAdded = await PropertyModel.findOne().sort({_id: -1});
    let property = new PropertyModel({
      _id: lastAdded._id +1,
      BuildingName: BuildingName,
      Region: "",
      Province: "",
      Suburb: "",
      Premises:[
        {
          id: 1,
          floor: "enter floor",
          area: 1000,
          occupation:"12/01/2020"}]
      
  });

    property.save( function( err ) {
        if( !err ) {
            return console.log( 'Post saved');
        } else {
            console.log( err );
        }
    });


    return response.send(property);
});

app.post( "/mainlist/remove", async function( request, response ) {
  const {_id} = await request.body;
  console.log(request.body);
await PropertyModel.findOneAndDelete({"_id":_id});

  return response.send();
});

app.post( "/mainlist/selprop", async function( request, response ) {
  const {_id} = await request.body;
  console.log(request.body);
await PropertyModel.findById({_id})
.then((doc)=>{return response.send(doc);})
  
});


   app.get("/mainlist", (req, res) => {
PropertyModel.find().then (data => {
    res.send(data);
})
   } 
   );  
   
   
   app.get("/mainlist/selprop/agents", (req, res) => {
 /*    AgencyModel.find({}, 'AgencyName', function(err, data){
      if(err) return next(err);
      res.send(data); */
      AgencyModel.find().then (data => {
        res.send(data);

    });
       } 
       ); 


   app.post( "/mainlist/selprop/save", async function( request, response ) {
    const _id = await request.body.saveData._id;
    console.log(_id);
    console.log(request.body);
  await PropertyModel.findByIdAndUpdate(_id, request.body.saveData
  /* {BuildingName: request.body.saveData.BuildingName,
    Address: request.body.saveData.Address,
    Suburb: request.body.saveData.Suburb,
    EarliestOccupation: request.body.saveData.EarliestOccupation,
    EarliestExpiry: request.body.saveData.EarliestExpiry,
    ErfExtent: request.body.saveData.ErfExtent,
    TotalGLA: request.body.saveData.TotalGLA,
    VacantArea: request.body.saveData.VacantArea,
    BuildingType: request.body.saveData.BuildingType,
    Province: request.body.saveData.Province,
    Region: request.body.saveData.Region,
    Agency: request.body.saveData.Agency,
    Agent: request.body.saveData.Agent,
    Phone: request.body.saveData.Phone,
    Email: request.body.saveData.Email,
    Premises: [	request.body.saveData.Premises
    ]
  
  } */, {upsert: true},
   function (err) {console.log(err)})
  .then((doc)=>{return response.send(doc);})
    
  });



  app.get("/agencylist", (req, res) => {
    AgencyModel.find().then (data => {
        res.send(data);
    })
       } 
       ); 

       app.post( "/agencylist/add", async function( request, response ) {
        const {AgencyName, AgencyWebsite, AgencyEmail, AgencyPhone } = await request.body;
        console.log(request.body);
    let lastAdded = await AgencyModel.findOne().sort({_id: -1});
        let Agency = new AgencyModel({
          _id: lastAdded._id + 1,
          AgencyName: AgencyName,
          AgencyWebsite: AgencyWebsite,
          AgencyEmail: AgencyEmail,
          AgencyPhone: AgencyPhone,
          Agents:[
            {
              _id: 1,
              AgentName: "Enter Name",
              AgentEmail: "",
              AgentPhone:""}]
          
      });
    
        Agency.save( function( err ) {
            if( !err ) {
                return console.log( 'Post saved');
            } else {
                console.log( err );
            }
        });
    
    
        return response.send(Agency);
    });

    app.post( "/agencylist/remove", async function( request, response ) {
      const {_id} = await request.body;
      console.log(request.body);
    await AgencyModel.findOneAndDelete({"_id":_id});
    
      return response.send();
    });

    app.post( "/agencylist/edit", async function( request, response ) {
      const _id = await request.body.saveEditData._id;
      console.log(_id);
      console.log(request.body);
    await AgencyModel.findByIdAndUpdate(_id, request.body.saveEditData
    , {upsert: true},
     function (err) {console.log(err)})
    .then((doc)=>{return response.send(doc);})
      
    });

    app.post( "/agencylist/selagency", async function( request, response ) {
      const {_id} = await request.body;
      console.log(request.body);
    await AgencyModel.findById({_id})
    .then((doc)=>{return response.send(doc);})
      
    });

    app.post( "/agencylist/selagency/add", async function( request, response ) {
      const _id = await request.body.saveAddData._id;
      console.log(_id);
      console.log(request.body);
    await AgencyModel.findByIdAndUpdate(_id, request.body.saveAddData
    , {upsert: true},
     function (err) {console.log(err)})
    .then((doc)=>{return response.send(doc);})
      
    });

  app.post( "/agencylist/selagency/remove", async function( request, response ) {
    const remove = await request.body;
    console.log(remove);
  
  
  await AgencyModel.update( { _id: remove._id }, { $pull: { Agents: { _id: remove._id2 } } } )
  
    return response.send();
  });

  app.post( "/agencylist/selagency/edit", async function( request, response ) {
    const _id = await request.body.saveEditData._id;
    console.log(_id);
    console.log(request.body);
  await AgencyModel.findByIdAndUpdate(_id, request.body.saveEditData
  , {upsert: true},
   function (err) {console.log(err)})
  .then((doc)=>{return response.send(doc);})
    
  });



app.listen (3000, () =>{
    console.log(`app is running on port 3000`);
})


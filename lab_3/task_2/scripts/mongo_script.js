use db

var foundStuff = db.london_postcodes.find({ dointr: 201409 })
printjson(foundStuff)
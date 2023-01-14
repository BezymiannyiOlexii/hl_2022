use db

var foundStuff = db.london_postcodes.find({ Northing: 168873 })
printjson(foundStuff)
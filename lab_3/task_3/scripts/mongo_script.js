function createRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function addDriverToCollection(){
	var name = createRandomString(6);
	var surname = createRandomString(12);
	var currentAddress = db.london_postcodes.aggregate([{ $sample: { size: 1 } }]).toArray()[0];
	
	db.drivers.insertOne({ name: name, surname: surname, currentLatitude: currentAddress.lat, currentLongitude: currentAddress.long });
}

function addDriversToCollection(count){
	for(var i = 0; i < count; i++){
		if(i % 100 == 0){
			printjson("Added 100 drivers")
		}
		addDriverToCollection();
	}
}

function addClientToCollection(){
	var name = createRandomString(6);
	var surname = createRandomString(12);
		
	db.clients.insertOne({ name: name, surname: surname });
}

function addClientsToCollection(count){
	for(var i = 0; i < count; i++){
		if(i % 100 == 0){
			printjson("Added 100 clients")
		}
		addClientToCollection();
	}
}

function IsInRange(bound1, bound2, value){
	if(bound1 < bound2){
		return value > bound1 && value < bound2
	}
	if(bound1 > bound2){
		return value - 24 > bound1 - 24 && value < bound2
	}
}

function addOrderToCollection(){
	
	var addresses = db.london_postcodes.aggregate([{ $sample: { size: 2 } }]).toArray();
	
	var client = db.london_postcodes.aggregate([{ $sample: { size: 1 } }]).toArray()[0];
	
	var departureAddress = addresses[0];
	var arrivalAddress = addresses[1];
	
	var closestDriver = db.drivers.aggregate([
		{
			$project:
			{
				_id: 1,
				currentLatitude: 1,
				currentLongitude: 1,
				distance: { $add: [
				{ $abs: { $subtract: [ departureAddress.lat, "$currentLatitude"] } },
				{ $abs: { $subtract: [ departureAddress.long, "$currentLongitude"] } }
				]}
			}
		},
		{
			$sort:
			{
				distance: 1
			}
		},
		{
			$limit: 1
		}
	]).toArray()[0]
	
	db.drivers.updateOne({ "_id": closestDriver._id },
	{ $set:
		{
			"currentLatitude": arrivalAddress.lat,
			"currentLongitude": arrivalAddress.long
		}
	})
	
	var startDate = new Date()
	
	var offset = Math.random() * 60 * 60 * 1000 * 24
	
	startDate = new Date(startDate.getTime() + offset)
	
	var startHour = startDate.getUTCHours()
	
	var rushHourStart1 = 7
	var rushHourEnd1 = 10
	
	var rushHourStart2 = 18
	var rushHourEnd2 = 21
	
	var nightTimeStart = 22
	var nightTimeEnd = 4
	
	var price = closestDriver.distance * 5000 * (IsInRange(rushHourStart1, rushHourEnd1, startHour) ? 1.5 : 1) * (IsInRange(rushHourStart2, rushHourEnd2, startHour) ? 1.5 : 1) * (IsInRange(nightTimeStart, nightTimeEnd, startHour) ? 2 : 1) + 50
	var timeToGetToPoint = closestDriver.distance * 60 * 60 * 100000
	
	var endDate = new Date(startDate.getTime() + timeToGetToPoint)
	
	var clientHasReviewChance = 0.9;
	var driverHasReviewChance = 0.8;
	
	var clientHasWrittenReviewChance = 0.3;
	var driverHasWrittenReviewChance = 0.2;
	
	var goodClientReviewChance = 0.9
	var goodDriverReviewChance = 0.85
	
	var clientHasReview = Math.random() < clientHasReviewChance
	var driverHasReview = Math.random() < driverHasReviewChance
	
	var clientHasWrittenReview = Math.random() < clientHasWrittenReviewChance
	var driverHasWrittenReview = Math.random() < driverHasWrittenReviewChance
	
	var isGoodClientReview = Math.random() < goodClientReviewChance
	var isGoodDriverReview = Math.random() < goodDriverReviewChance
	
	var hasGoodDrivingSkills = Math.random() < goodDriverReviewChance
	var hasGoodConversationSkills = Math.random() < goodDriverReviewChance
	var hasPoliteAttitude = Math.random() < goodDriverReviewChance
	
	var clientReview = null
	var driverReview = null
	
	var clientWrittenReview = null
	var driverWrittenReview = null
	
	var drivingSkillsReview = null
	var conversationSkillsReview = null
	var politeAttitudeReview = null
	
	if(clientHasReview){
		if(isGoodClientReview){
			clientReview = 5
		}
		else{
			clientReview = Math.floor(Math.random() * 5)
		}
		
		if(clientHasWrittenReview){
			clientWrittenReview = "Some review for the client"
		}
	}
	
	if(driverHasReview){
		if(isGoodDriverReview){
			driverReview = 5
		}
		else{
			driverReview = Math.floor(Math.random() * 5)
		}
		
		if(driverHasWrittenReview){
			driverWrittenReview = "Some review for the client"
		}
		
		if(hasGoodDrivingSkills){
			drivingSkillsReview = 5
		}else{
			drivingSkillsReview = Math.floor(Math.random() * 5)
		}
		
		if(hasGoodConversationSkills){
			conversationSkillsReview = 5
		}else{
			conversationSkillsReview = Math.floor(Math.random() * 5)
		}
		
		if(hasPoliteAttitude){
			politeAttitudeReview = 5
		}else{
			politeAttitudeReview = Math.floor(Math.random() * 5)
		}
	}
	
	db.orders.insertOne(
	{
		driverId: closestDriver._id,
		clientId: client._id,
		departureLatitude: departureAddress.lat,
		departureLongitude: departureAddress.long,
		arrivalLatitude: arrivalAddress.lat,
		arrivalLongitude: arrivalAddress.long,
		price: price,
		startDate: startDate,
		endDate: endDate,
		clientReview: clientReview,
		driverReview: driverReview,
		clientWrittenReview: clientWrittenReview,
		driverWrittenReview: driverWrittenReview,
		drivingSkillsReview: drivingSkillsReview,
		conversationSkillsReview: conversationSkillsReview,
		politeAttitudeReview: politeAttitudeReview
	})
}

function addOrdersToCollection(count){
	for(var i = 0; i < count; i++){
		if(i % 100 == 0){
			printjson("Added 100 orders")
		}
		addOrderToCollection();
	}
}

use db

db.createCollection('orders')

db.createCollection('clients')

db.createCollection('drivers')

addDriversToCollection(2000)

addClientsToCollection(4000)


// to generate 10 GB of data put 10000000 as the argument of this function
// it takes around 3 second for 100 entries, so it would take a very long time
addOrdersToCollection(100000)

printjson(db.orders.count())
printjson(db.clients.count())
printjson(db.drivers.count())

printjson(db.orders.findOne())

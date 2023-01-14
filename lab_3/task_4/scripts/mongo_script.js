use db

// variant 5, get 100 drivers who earned the most amount

// is is said that mapreduce is deprecated in the modern version of mongodb and using aggregate is preferable

var bestEarningDrivers = db.orders.aggregate([
		{
			$group:
			{
				_id: "$driverId",
				moneyMade: { $sum: "$price" }
			}
		},
		{
			$sort:
			{
				moneyMade: -1
			}
		},
		{
			$limit: 100
		}
	]).toArray()

// however, here is the same query as mapreduce

var mapReduceResult = db.orders.mapReduce(
											function() { emit(this.driverId, this.price); },
											function(key, values) { return Array.sum(values) },
											{
												out: 'result'
											}
										 )

printjson("Aggregate query result")

printjson(bestEarningDrivers)

printjson("MapReduce query result")

printjson(db.result.find().sort({ value: -1 }).limit(100).toArray())

echo "Importing db"
mongoimport --host mongo_main_server:27017 --db db --collection london_postcodes --type=csv --headerline --file='data/London postcodes.csv'
mongoimport --host mongo_main_server:27017 --db db --collection clients --type=json --file=data/clients.json
mongoimport --host mongo_main_server:27017 --db db --collection drivers --type=json --file=data/drivers.json
mongoimport --host mongo_main_server:27017 --db db --collection orders --type=json --file=data/orders.json
echo "Running script in db"
mongosh --host mongo_main_server:27017 < scripts/mongo_script.js
echo "Script execution finished"

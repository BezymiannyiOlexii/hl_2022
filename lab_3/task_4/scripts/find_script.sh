echo "Importing db"
mongoimport --host mongo_main_server:27017 --db db --collection london_postcodes --type=csv --headerline --file=scripts/london_postcodes.csv
mongoimport --host mongo_main_server:27017 --db db --collection clients --type=json --file=scripts/clients.json
mongoimport --host mongo_main_server:27017 --db db --collection drivers --type=json --file=scripts/drivers.json
mongoimport --host mongo_main_server:27017 --db db --collection orders --type=json --file=scripts/orders.json
echo "Running script in db"
mongosh --host mongo_main_server:27017 < scripts/mongo_script.js
echo "Script execution finished"

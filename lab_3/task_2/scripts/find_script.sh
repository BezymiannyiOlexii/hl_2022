echo "Importing db"
mongoimport --host mongo_main_server:27017 --db db --collection london_postcodes --type=csv --headerline --file=scripts/london_postcodes.csv
echo "Running script in db"
mongosh --host mongo_main_server:27017 < scripts/mongo_script.js
echo "Script execution finished"
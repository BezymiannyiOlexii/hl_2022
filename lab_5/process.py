class Processor:

    def __init__(self, df):
        self.df = df
        self.drivers_rating = self.df.filter(lambda trip: trip['driver_rate'] > 0).map(
            self._trip_driver_rate_map).reduceByKey(self._driver_rate_reduce).map(self._driver_avg_map)

    @staticmethod
    def _trip_driver_rate_map(trip):
        return trip['driver'], (trip['driver_rate'], 1)

    @staticmethod
    def _driver_rate_reduce(acc, n):
        return acc[0] + n[0], acc[1] + n[1]

    @staticmethod
    def _driver_avg_map(driver):
        avg_rating = round(driver[1][0] / driver[1][1], 2)
        return driver[0], avg_rating

    def top_drivers(self, n):
        return self.drivers_rating.takeOrdered(n, key=lambda driver: -driver[1])

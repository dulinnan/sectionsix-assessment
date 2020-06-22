/** @format */

const moment = require("moment-timezone");
const log = require("../lib/logger")();
const geoTz = require("geo-tz");
const CSVToJSON = require("csvtojson");
const haversine = require("haversine");
const csvFilePath = "timezone.csv";

exports.convert = async function (req, res) {
  const id = req.query.id;

  if (id === null || id === undefined) {
    res.sendStatus(400);
  }

  const getAllIndex = async (array) => {
    try {
      return array.reduce(function (a, e, i) {
        if (e.id === id) a.push(i);
        return a;
      }, []);
    } catch (error) {
      log.warn(
        `admin.controller.convert: couldn't return all index match with id in ${array}: ${error}`
      );
      return error;
    }
  };

  const getTimeZone = (lat, lon) => {
    try {
      const zone = geoTz(lat, lon);
      return zone[0];
    } catch (error) {
      log.warn(
        `admin.controller.convert: couldn't get time zone from ${
          (lat, lon)
        }: ${error}`
      );
      return error;
    }
  };

  const getTimezoneAbbr = (zone) => {
    try {
      const abbr = moment.tz(zone).format("zz");
      return abbr;
    } catch (error) {
      log.warn(
        `admin.controller.convert: couldn't get time zone abbr from ${zone}: ${error}`
      );
      return error;
    }
  };

  const formatUtc = (utc, zone) => {
    try {
      const timezoneOffset = moment(utc, "x").tz(zone).format("Z");
      const formattedOffset = timezoneOffset.replace(":", "");
      const convertedTime =
        moment(utc, "x").tz(zone).format("DD/MM/YYYY HH:mm") +
        " " +
        formattedOffset;
      return convertedTime;
    } catch (error) {
      log.warn(`admin.controller.convert: couldn't format utc time: ${error}`);
      return error;
    }
  };

  const calcutaleDistance = (matchedIdArray) => {
    try {
      let points = [];
      matchedIdArray.forEach((matchedId) => {
        const latitude = jsonData[matchedId].lat;
        const longitude = jsonData[matchedId].lng;
        const point = { latitude: latitude, longitude: longitude };
        points.push(point);
      });

      const distance = haversine(points[0], points[1]);
      return distance;
    } catch (error) {
      log.warn(
        `admin.controller.convert: couldn't calculate distance between ${matchedIdArray}: ${error}`
      );
      return error;
    }
  };

  const fetchData = async () => {
    try {
      return await CSVToJSON().fromFile(csvFilePath);
    } catch (error) {
      log.warn(
        `admin.controller.convert: couldn't convert to json from ${csvFilePath}: ${error}`
      );
      return error;
    }
  };

  const convertRecord = (record) => {
    try {
      const matchedTimestamp = record.timestamp_utc;
      const matchedLat = record.lat;
      const matchedLon = record.lng;
      const timezone = getTimeZone(matchedLat, matchedLon);
      const timezoneAbbr = getTimezoneAbbr(timezone);
      const utcTime = formatUtc(matchedTimestamp, timezone);
      let formattedTime = utcTime;
      if (timezoneAbbr.startsWith("+") || timezoneAbbr.startsWith("-")) {
        formattedTime = formattedTime;
      } else {
        formattedTime =
          utcTime.slice(0, 17) + timezoneAbbr + " " + utcTime.slice(17);
      }
      return formattedTime;
    } catch (error) {
      log.warn(
        `admin.controller.convert: couldn't convert utc time from ${record}: ${error}`
      );
      return error;
    }
  };

  const jsonData = await fetchData();
  const matchedId = await getAllIndex(jsonData);
  let matchedRecord = [];

  if (matchedId !== null || matchedId !== undefined) {
    matchedId.forEach((id) => {
      matchedRecord.push(jsonData[id]);
    });
  }

  if (matchedRecord === null || matchedRecord === undefined) {
    res.sendStatus(404);
  }

  if (matchedRecord !== undefined) {
    let time = [];
    let distance = 0;
    matchedRecord.forEach((record) => {
      const formattedTime = convertRecord(record);
      time.push(formattedTime);
    });

    if (matchedId.length > 1) {
      distance = calcutaleDistance(matchedId);
    }
    res.status(200).json({
      time: time,
      distance: distance,
    });
  }
};

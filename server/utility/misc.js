const weatherAPI = new require('./weather')();
const callEventsAPI = new require('./cal_events')();
/**
 * https://github.com/gouch/to-title-case/blob/master/to-title-case.js
 * https://daringfireball.net/2008/05/title_case
 */
String.prototype.toTitleCase = function() {
  'use strict';
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
  var alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
  var wordSeparators = /([ :–—-])/;

  return this.split(wordSeparators)
    .map(function(current, index, array) {
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase();
      }

      /* Ignore intentional capitalization */
      if (current.substr(1).search(/[A-Z]|\../) > -1) {
        return current;
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current;
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, function(match) {
        return match.toUpperCase();
      });
    })
    .join('');
};

/**
 * Returns a date <minutes> after the given <date>.
 * @param date
 * @param minutes
 */
const addMInutes = ({ date, minutes = 0 }) => {
  const newDate = new Date(date.valueOf());
  newDate.setTime(date.getTime() + minutes * 1000);
  return newDate;
};

/**
 *
 * @param {*} currentKey optional apiKey
 * this generates the next possible apiKey based on an array of possible keys by getting the next index's
 */
const NextKeyInSequence = (currentKey) => {
  // HOW TO CALL
  // check all APIKEYs used
  // const nxtApiKey = await miscUtilities.requireNextKey(models.WeatherKeyController);
  // console.log('Next data :: ', nxtApiKey);
  const keys = JSON.parse(process.env.WEATHER_API_KEY_OWM);
  return !currentKey
    ? keys[0] // can be done randomly
    : (function(ky) {
        let ndx = keys.findIndex((k) => k === ky);
        return ndx < 0 || ndx + 1 > keys.length - 1 ? keys[0] : keys[ndx + 1];
      })(currentKey);
};

/**
 *
 * @param {*} modelComponent 'WeatherKeyController' model
 * this is an entirely test/simulation method using the apikeys while assuming they are all in the model
 * a back fill process for apikeys for test run
 */
const generateApiKeysData = async (modelComponent) => {
  JSON.parse(process.env.WEATHER_API_KEY_OWM)
    .map((k) => {
      return [k, Math.round(Math.random() * 60 + 1, 0)];
    })
    .forEach(async (keyset, ndx) => {
      for (let ii = 1; ii <= keyset[1]; ii++) {
        await new modelComponent({
          apiKey: keyset[0],
        }).save();
      }
    });
};

/**
 *
 * @param {*} seconds the number of seconds to wait, this could be a decimal if the delay is less than 1 sec
 * used to asynchronously delay an operation
 */
const asyncDelay = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

/**
 *
 * @param {*} modelComponent the model 'WeatherKeyController'
 * returns the next available apiKey
 * BY i. returns the very lastest apiKey that has been in use
 *   ii. if the total number of times it has been used is not up to the limit as specified in configuration
 *  iii. then it uses otherwise, invokes 'NextKeyInSequence' to return the next apiKey after the latest used
 */
const requireNextKey = async (modelComponent) => {
  // HOW TO CALL
  //   await miscUtilities.requireNextKey(WeatherKeyController),
  return await modelComponent.nextAPIKey();
};

/**
 *
 * @param {*} modelComponents container for models
 * @param {*} apiKey next available apikey to use
 * @param {*} latitude latitude of position being queried
 * @param {*} longitude longitude of position being queried
 *    a test to get the next available apiKey, call weatherAPI using the geo-coordinate latitude longitude provided
 */
const fetchWeatherDetails = async (
  modelComponents,
  apiKey,
  latitude,
  longitude
) => {
  // HOW TO CALL
  // // GeoData Loader

  // const weatherTestGeoCoordsData = miscUtilities.weatherTestDataGeoCoordsForAPI();
  // for (let ii = 0; ii < weatherTestGeoCoordsData.length; ii++) {
  //   const weatherDetails = await miscUtilities.fetchWeatherDetails(
  //     models,
  //     await miscUtilities.requireNextKey(models.WeatherKeyController),
  //     weatherTestGeoCoordsData[ii].latitude,
  //     weatherTestGeoCoordsData[ii].longitude
  //   );
  //   await miscUtilities.asyncDelay(0.05);
  // }

  // save/keep/log the apiKey;
  await modelComponents.WeatherKeyController.logAPIKey(apiKey);
  const currentWeather = await weatherAPI.getCurrentWeatherByGeoCoords(
    apiKey,
    'metric',
    latitude,
    longitude
  );
  // log the weather returned
  await modelComponents.WeatherRepo.logWeatherPayload(
    apiKey,
    currentWeather,
    latitude,
    longitude
  );
  return currentWeather;
};

/**
 * randomly generated geo cordinates to test WeatherRepo model
 * these will be data from weatherAPI for geo-coordinates of interest
 */
const weatherTestDataGeoCoordsForAPI = () => {
  return JSON.parse(
    '[{"latitude":6.4474,"longitude":3.3903},{"latitude":6.479977811995447,"longitude":3.3692924356638243},{"latitude":6.478343401530209,"longitude":3.437935684999667},{"latitude":6.409431958874429,"longitude":3.359767742424528},{"latitude":6.39747065729134,"longitude":3.4097222177596143},{"latitude":6.391908062580194,"longitude":3.402882776347687},{"latitude":6.469433660669565,"longitude":3.4374984832951254},{"latitude":6.398791034082617,"longitude":3.434923710276373},{"latitude":6.4966177884709655,"longitude":3.366657453473748},{"latitude":6.475682309314353,"longitude":3.3776303957707556},{"latitude":6.459959450831984,"longitude":3.430355062101775},{"latitude":6.498465907774038,"longitude":3.425126197098368},{"latitude":6.423877971654755,"longitude":3.368332439258279},{"latitude":6.469934597279312,"longitude":3.4314545178393274},{"latitude":6.443693516177371,"longitude":3.4336192643115493},{"latitude":6.44043664407907,"longitude":3.3577337862639176},{"latitude":6.411335415582597,"longitude":3.4090762145452085},{"latitude":6.416518071605113,"longitude":3.341027610149479},{"latitude":6.410807011319294,"longitude":3.447146500589996},{"latitude":6.449861853839378,"longitude":3.436835782673867},{"latitude":6.411495390792403,"longitude":3.4316956021170153},{"latitude":6.440442634109575,"longitude":3.3951283395729788},{"latitude":6.428512394874736,"longitude":3.4518933819747124},{"latitude":6.415752323965298,"longitude":3.4355302919044632},{"latitude":6.393399561354621,"longitude":3.4280793965563436},{"latitude":6.429521780124191,"longitude":3.390681111542677},{"latitude":6.483155552827045,"longitude":3.431467919137215},{"latitude":6.437949568710258,"longitude":3.352323400891763},{"latitude":6.387256088903387,"longitude":3.3990129469317916},{"latitude":6.443963724210545,"longitude":3.443656071471891},{"latitude":6.513294121579577,"longitude":3.378471451782351},{"latitude":6.474848066882708,"longitude":3.3752645431355313},{"latitude":6.425759208786185,"longitude":3.450028027318011},{"latitude":6.465893814396231,"longitude":3.4484069919472176},{"latitude":6.480505988981038,"longitude":3.4444397003637994},{"latitude":6.437944927022527,"longitude":3.3592942210542516},{"latitude":6.476288701605761,"longitude":3.3950212939467863},{"latitude":6.474956608428299,"longitude":3.3860347528657755},{"latitude":6.404332290258837,"longitude":3.3664986051959334},{"latitude":6.4405643898879195,"longitude":3.419990709821438},{"latitude":6.414112606319631,"longitude":3.3983649483322353},{"latitude":6.384312193657292,"longitude":3.4099782507831295},{"latitude":6.4870644903001775,"longitude":3.366215037876655},{"latitude":6.408679816855044,"longitude":3.3792808727245576},{"latitude":6.399573122100054,"longitude":3.368833815109282},{"latitude":6.469243473842065,"longitude":3.3549553734310322},{"latitude":6.427949192125011,"longitude":3.345990542257721},{"latitude":6.473409515714406,"longitude":3.412146306562652},{"latitude":6.391997490930065,"longitude":3.3838755105471896},{"latitude":6.445574218254633,"longitude":3.3784811539662933},{"latitude":6.406186691471521,"longitude":3.4285546964087295},{"latitude":51.9417,"longitude":-2.4149},{"latitude":51.904070768174606,"longitude":-2.3831364186518202},{"latitude":51.94153262375409,"longitude":-2.377586328569238},{"latitude":51.90067941752898,"longitude":-2.4583241050106572},{"latitude":51.91255340520969,"longitude":-2.4786460517374347},{"latitude":51.98607894095762,"longitude":-2.4878300752456313},{"latitude":51.93906885058039,"longitude":-2.4887563361793017},{"latitude":52.000442558057145,"longitude":-2.4400111444063612},{"latitude":51.90828786714535,"longitude":-2.4542812465942636},{"latitude":51.896031818182465,"longitude":-2.461113252065369},{"latitude":51.980847915066704,"longitude":-2.353691948403718},{"latitude":51.9340691068884,"longitude":-2.5143016447985636},{"latitude":51.89380948705995,"longitude":-2.3791182413676415},{"latitude":51.95927387482337,"longitude":-2.4267102397468228},{"latitude":51.92394563715355,"longitude":-2.32498324766093},{"latitude":51.90496353021035,"longitude":-2.503114401496119},{"latitude":51.9255838284479,"longitude":-2.317362808597821},{"latitude":51.900685734125496,"longitude":-2.4563066701206315},{"latitude":51.98976730216936,"longitude":-2.4648838804654156},{"latitude":51.93709783557303,"longitude":-2.354825011098585},{"latitude":51.96422511799265,"longitude":-2.43527993113383},{"latitude":51.95924879848761,"longitude":-2.4799577909363246},{"latitude":51.95202548721842,"longitude":-2.3539206815149423},{"latitude":51.963717086707746,"longitude":-2.3685065138017145},{"latitude":51.90763816247523,"longitude":-2.359407053200631},{"latitude":52.002490533335056,"longitude":-2.425150763737089},{"latitude":51.92090454805774,"longitude":-2.4308796576666913},{"latitude":51.892680278375366,"longitude":-2.4107619341747446},{"latitude":51.9461041853305,"longitude":-2.317253724424672},{"latitude":51.92022535794143,"longitude":-2.3272896418926763},{"latitude":51.944971377769164,"longitude":-2.507868946463573},{"latitude":51.88438123342272,"longitude":-2.3943493329151972},{"latitude":51.909396256133164,"longitude":-2.389824004466537},{"latitude":51.95571050943731,"longitude":-2.4030577515125584},{"latitude":51.93331222143221,"longitude":-2.4346959236382357},{"latitude":51.927438603975894,"longitude":-2.359921806964048},{"latitude":51.984808108399626,"longitude":-2.436262670629653},{"latitude":51.99360717348528,"longitude":-2.386118124618277},{"latitude":51.92773784202217,"longitude":-2.329391829261357},{"latitude":51.91571974605041,"longitude":-2.4438205410178386},{"latitude":51.97592782700326,"longitude":-2.3238942862777434},{"latitude":51.98664139629786,"longitude":-2.3769504145302465},{"latitude":51.89745674302584,"longitude":-2.421884857300725},{"latitude":51.97974077774608,"longitude":-2.3411149286523862},{"latitude":51.917714756566006,"longitude":-2.382945919198593},{"latitude":51.93819814027012,"longitude":-2.4793851513502663},{"latitude":51.93943590320768,"longitude":-2.3882308154892105},{"latitude":51.96794999489842,"longitude":-2.3601356714714834},{"latitude":51.98602526784197,"longitude":-2.3823371612438518},{"latitude":51.97359998578329,"longitude":-2.32823878073418},{"latitude":52.004459583616175,"longitude":-2.4493974639206244},{"latitude":34.0531,"longitude":-118.242},{"latitude":34.03171396691551,"longitude":-118.21986250583957},{"latitude":34.0423081644676,"longitude":-118.30597136264353},{"latitude":34.09520242724552,"longitude":-118.25483467202744},{"latitude":34.0212726678423,"longitude":-118.27243626638146},{"latitude":34.0140361915178,"longitude":-118.19207544006868},{"latitude":34.075293683357565,"longitude":-118.23131040411259},{"latitude":34.10171143028779,"longitude":-118.27331540349853},{"latitude":34.045905549530076,"longitude":-118.2965984869926},{"latitude":34.075053997410684,"longitude":-118.31644344739135},{"latitude":34.06470510116354,"longitude":-118.27618460805259},{"latitude":34.007667321008036,"longitude":-118.1920736654242},{"latitude":34.01379916802078,"longitude":-118.21269642389105},{"latitude":34.108550051418874,"longitude":-118.2869611685872},{"latitude":34.09233978840553,"longitude":-118.2174157991328},{"latitude":34.0638708048869,"longitude":-118.17035614621545},{"latitude":34.08187953152866,"longitude":-118.28632454015654},{"latitude":34.02483066717697,"longitude":-118.24584187644264},{"latitude":34.057161177617246,"longitude":-118.19478545644317},{"latitude":34.075584603546595,"longitude":-118.26023721256757},{"latitude":34.05140564571501,"longitude":-118.18462822135236},{"latitude":34.085941957475065,"longitude":-118.20594415866329},{"latitude":34.04431942667805,"longitude":-118.21843868208542},{"latitude":34.09313075891218,"longitude":-118.22336295545672},{"latitude":34.034100738777504,"longitude":-118.31703496292742},{"latitude":34.08319171757319,"longitude":-118.29260746500775},{"latitude":34.102777115044525,"longitude":-118.19550947833538},{"latitude":34.119074341412485,"longitude":-118.22568211577244},{"latitude":34.06643208858599,"longitude":-118.19747632621109},{"latitude":34.02882337871885,"longitude":-118.18878293506256},{"latitude":34.09534318360958,"longitude":-118.2433794435039},{"latitude":34.02832628907878,"longitude":-118.24177058075004},{"latitude":33.998134652413945,"longitude":-118.20394034629022},{"latitude":34.0426987978655,"longitude":-118.31961057469148},{"latitude":34.09351850957114,"longitude":-118.2036434644904},{"latitude":34.07128492493352,"longitude":-118.30654874175441},{"latitude":34.077448014469645,"longitude":-118.22241047686015},{"latitude":34.05658167137462,"longitude":-118.20258874052689},{"latitude":34.083827148551855,"longitude":-118.17051926592406},{"latitude":34.03086324701742,"longitude":-118.26419292457702},{"latitude":34.07318725198051,"longitude":-118.30041313326585},{"latitude":34.02159429342678,"longitude":-118.197061345816},{"latitude":34.07984447754616,"longitude":-118.26814839720271},{"latitude":34.10706239023152,"longitude":-118.22275647630372},{"latitude":34.00316700958345,"longitude":-118.25351785374068},{"latitude":34.01711826169846,"longitude":-118.19257109188285},{"latitude":34.098066688300065,"longitude":-118.27086365574274},{"latitude":34.103955092171326,"longitude":-118.2763984286905},{"latitude":34.05169654319684,"longitude":-118.25957685285701},{"latitude":34.0854660906888,"longitude":-118.18590887004662},{"latitude":34.07461905188474,"longitude":-118.29302397598072}]'
  );
};

/**
 * randomly generated geo coordinates to test searching for a geo-cordinate of interest before the weatherAPi is called
 */
const weatherTestVerificationCallGeoCoordsForAPI = () => {
  return JSON.parse(
    '[{"latitude":6.446941779695214,"longitude":3.297941497533888},{"latitude":6.4331444433491285,"longitude":3.3477178950871185},{"latitude":6.444016135322083,"longitude":3.486587581246014},{"latitude":6.342075201631609,"longitude":3.424347593012134},{"latitude":6.494020715408902,"longitude":3.399540950380481},{"latitude":6.371635945291065,"longitude":3.4141789671976435},{"latitude":6.503055648757041,"longitude":3.4785734370405974},{"latitude":6.431315092278742,"longitude":3.441368804874531},{"latitude":6.3716595562919,"longitude":3.3840325911401905},{"latitude":6.543638265725063,"longitude":3.3608350936487237},{"latitude":51.859502186480164,"longitude":-2.4642725103711887},{"latitude":51.93513437244608,"longitude":-2.287988107871279},{"latitude":51.95565708844978,"longitude":-2.46916862650634},{"latitude":52.022299479271275,"longitude":-2.433913101284309},{"latitude":51.94255509464136,"longitude":-2.548925173773491},{"latitude":52.02167888205772,"longitude":-2.3415645577680557},{"latitude":51.87553536799774,"longitude":-2.3337818258003082},{"latitude":51.89980861799056,"longitude":-2.367315271243198},{"latitude":51.84064775171846,"longitude":-2.4454516813278926},{"latitude":52.002799486009344,"longitude":-2.367516637874088},{"latitude":34.15872773290294,"longitude":-118.21305650482975},{"latitude":34.096684011896286,"longitude":-118.12287189719372},{"latitude":34.12816041689571,"longitude":-118.21380633951222},{"latitude":34.022702838283635,"longitude":-118.23281077717834},{"latitude":33.98673026423416,"longitude":-118.2159415986883},{"latitude":34.0456770396033,"longitude":-118.27343699908364},{"latitude":34.037055635564016,"longitude":-118.3214263028884},{"latitude":34.11469679242537,"longitude":-118.31424684763326},{"latitude":34.12067945958813,"longitude":-118.26716439262792},{"latitude":34.042368297259735,"longitude":-118.3570679890435}]'
  );
};

/**
 *
 * @param {*} modelComponents model container, in this case needed for WeatherRepo model
 * @param {*} coordsTest geo - coordinates of interest to be searched first from the database base
 *                to check if there is an existing weatherAPI data for any radius of 2.5km to the geo-cordinates of interest
 *                best guess, if there is an existing weather data for a geo-coordnate of interest, it means there is every
 *                likelihood to have the same weather info rather than initiate a fresh API call
 */
const queryCheck = async (
  modelComponents,
  coordsTest = [-0.05025088235295927, 50.41660449325532]
) => {
  // HOW TO CALL
  // // GeoData Searches
  // const weatherTestCheck = miscUtilities.weatherTestVerificationCallGeoCoordsForAPI();
  // const dataIndex = Math.round(Math.random() * weatherTestCheck.length - 1);
  // console.log(weatherTestCheck.length);
  // console.log(dataIndex);
  // console.log(weatherTestCheck[dataIndex]);
  // const weatherTestGeoCoordsData = await miscUtilities.queryCheck(models, [
  //   weatherTestCheck[dataIndex].longitude,
  //   weatherTestCheck[dataIndex].latitude,
  // ]);
  console.time(`weatherRepoSearch`);
  const weatherrepo = await modelComponents.WeatherRepo.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: coordsTest,
        },
        distanceField: 'coords',
        maxDistance: 2500,
        spherical: true,
        distanceField: 'distance',
      },
    },
    {
      $project: {
        _id: 0,
        payload: 1,
        distance: 1,
      },
    },
  ]);
  console.log(weatherrepo);
  console.timeEnd(`weatherRepoSearch`);
};

const testEventsAPI = async (country, state) => {
  // const reg_code = 'gb-eng';
  // const reg_code = 'us-ca';
  // const reg_code = 'ng-la';
  const parameters = {
    country: `${country}`,
    year: new Date().getFullYear(),
    day: new Date().getDate() - 1,
    month: new Date().getMonth() + 1,
  };
  // console.log(parameters);
  try {
    const testAPIResult = await callEventsAPI.holidays(parameters);
    testAPIResult.holidays.forEach((hol) => console.log(hol));
    return testAPIResult;
  } catch (err) {
    return {};
  }

  //{ country: 'ng', year: 2020, day: 13, month: 6, location: 'ng-la' }
  // { holidays: [] }

  //{ country: 'us', year: 2020, day: 13, month: 6, location: 'us-ca' }
  // {
  //   holidays: [
  //     {
  //       name: 'International Albinism Awareness Day',
  //       description: 'International Albinism Awareness Day aims to stop the persecution and murders of people with albinism.',
  //       country: [Object],
  //       date: [Object],
  //       type: [Array],
  //       locations: 'All',
  //       states: 'All'
  //     }
  //   ]
  // }

  //   { country: 'gb', year: 2020, day: 13, month: 6, location: 'gb-eng' }
  // {
  //   name: "Queen's Birthday",
  //   description: "The Queen's birthday, also known as the Queen's Official Birthday, is celebrated in many Commonwealth countries around the world. It is a public holiday in countries such as Australia, New Zealand, and Gibraltar, although on different dates.",
  //   country: { id: 'gb', name: 'United Kingdom' },
  //   date: { iso: '2020-06-13', datetime: { year: 2020, month: 6, day: 13 } },
  //   type: [ 'Observance' ],
  //   locations: 'All',
  //   states: 'All'
  // }
};

/**
 *
 * @param {*} modelComponent the model to be used for operation LocationEvent
 * @param {*} month month for loading all events
 * @param {*} year year of month for loading all events
 * @param {*} country optional country for which to load all events but this is no applicable here
 */
const eventsLoadAll = async (modelComponent, month, year, country) => {
  let numOfCountries = 0,
    numOfRegions = 0;
  // // HOW TO CALL
  // const evtLoad = await miscUtilities.eventsLoadAll(
  //   models.LocationEvent,
  //   new Date().getMonth() + 1,
  //   new Date().getFullYear(),
  //   'au'
  // );
  try {
    const APIResult = await callEventsAPI.countries(country);
    if (APIResult && APIResult.countries.length) {
      for (let countryDetails of APIResult.countries) {
        const parameters = {
          country: `${countryDetails['iso-3166'].toLowerCase()}`,
          year: year,
          month: month,
        };
        try {
          const evtAPIResult = await callEventsAPI.holidays(parameters);
          if (evtAPIResult && evtAPIResult.holidays.length) {
            // first remove from the db collection
            await modelComponent.espoungeEvents(
              `${countryDetails['iso-3166'].toLowerCase()}`,
              year,
              month
            );

            for (let evtDetails of evtAPIResult.holidays) {
              const { name, description, type } = evtDetails;
              const locationEvent = {
                country: countryDetails['iso-3166'].toLowerCase(),
                date: evtDetails.date.iso.split('T')[0],
                payload: {
                  name,
                  description,
                  type,
                },
              };
              if (typeof evtDetails.states === 'string') {
                locationEvent.region = evtDetails.states;
                const rsp = await modelComponent.logEvent(locationEvent);
              } else if (typeof evtDetails.states === 'object') {
                // just drop using all as states
                for (let eachRegion of evtDetails.states) {
                  // use the state's abbrev if it exist and its not null
                  // if null, use iso
                  // but check if the iso does not contains '-', if it does
                  // remove everything before the '-' inclusive and use the rest as region
                  locationEvent.region = eachRegion.abbrev
                    ? eachRegion.abbrev.toLowerCase()
                    : eachRegion.iso.indexOf('-') >= 0
                    ? eachRegion.iso.split('-')[1].toLowerCase()
                    : eachRegion.iso.toLowerCase();
                  const rsp = await modelComponent.logEvent(locationEvent);
                }
              }
              asyncDelay(0.015);
            }
          }
        } catch (err) {
          console.log('Country Holiday Error :: ', err);
        }
        numOfCountries++;
        // console.log('numOfCountries :: ', numOfCountries);
        asyncDelay(0.35);
      }
      return { msg: "completed all countries's holiday events" };
    }
  } catch (err) {
    console.log(err);
  }
  return {};
};

const holidayEvents = async (country, year, month) => {};

module.exports = {
  NextKeyInSequence,
  generateApiKeysData,
  requireNextKey,
  fetchWeatherDetails,
  asyncDelay,
  weatherTestDataGeoCoordsForAPI,
  weatherTestVerificationCallGeoCoordsForAPI,
  queryCheck,
  testEventsAPI,
  eventsLoadAll,
  holidayEvents,
};

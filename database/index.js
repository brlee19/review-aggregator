const {Pool, Client} = require('pg');

const pool = new Pool({
  user: process.env.db_user || require('../config.js').db_user,
  host: process.env.db_host || require('../config.js').db_host,
  database: process.env.database || require('../config.js').database,
  port: process.env.db_port || require('../config.js').db_port,
  password: process.env.db_password || require('../config.js').db_password
});

const getAllIds = () => {
  const queryStr = 'select * from review_site_ids';
  return pool.query(queryStr)
    .then(res => res.rows)
    .catch(err => console.log(err));
};

const getIdsByYelpId = (yelpId) => {
  const queryStr = `select * from review_site_ids where yelp = $1`;
  const values = [yelpId];
  return pool.query(queryStr, values)
    // .then(res => console.log(res))
    .then(res => res.rows[0])
    .catch(err => console.log(err));
};

const addIds = (ids) => { //ids is an object with yelp, google, and foursquare keys
  const queryStr = `insert into review_site_ids(yelp, google, foursquare) values ($1, $2, $3)\
                    on conflict (yelp) do nothing`;
  const values = [ids.yelp, ids.google, ids.foursquare];
  return pool.query(queryStr, values)
    // .then(res => console.log(res))
    .catch(err => console.log(err));
};

const reset = () => {
  const queryStr = `drop table if exists review_site_ids;
                    create table review_site_ids(
                    yelp varchar(140) unique,
                    google varchar(140) unique,
                    foursquare varchar(140) unique,
                    primary key(yelp));`
  return pool.query(queryStr)
    // .then(res => console.log(res))
    .catch(err => console.log(err));
}

//TODO: DB should update IDs if the last check was over a week ago or there is an error

exports.getAllIds = getAllIds;
exports.getIdsByYelpId = getIdsByYelpId;
exports.addIds = addIds;
exports.reset = reset;
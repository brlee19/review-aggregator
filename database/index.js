const {Pool, Client} = require('pg');

const pool = new Pool({
  user: 'brianlee',
  host: 'localhost',
  database: 'brianlee',
  port: 5432
});

const getAllIds = () => {
  const queryStr = 'select * from review_site_ids';
  return pool.query(queryStr)
    .then(res => res.rows)
    .catch(err => console.log(err));
}

const getIdsByYelpId = (yelpId) => {
  const queryStr = `select * from review_site_ids where yelp = $1`;
  const values = [yelpId];
  return pool.query(queryStr, values)
    .then(res => res.rows[0])
    .catch(err => console.log(err));
}

const addIds = (ids) => { //ids is an object with yelp, google, and foursquare keys
  const queryStr = `insert into review_site_ids(yelp, google, foursquare) values ($1, $2, $3)\
                    on conflict (yelp) do nothing`;
  const values = [ids.yelp, ids.google, ids.foursquare];
  return pool.query(queryStr, values)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

//TODO: DB should update IDs if the last check was over a week ago or there is an error

exports.getAllIds = getAllIds;
exports.getIdsByYelpId = getIdsByYelpId;
exports.addIds = addIds;
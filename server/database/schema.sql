drop table if exists review_site_ids

create table review_site_ids(
  yelp varchar(140) unique,
  google varchar(140) unique,
  foursquare varchar(140) unique,
  primary key(yelp)
);
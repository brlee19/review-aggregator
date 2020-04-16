# ReviewCanoe

> Kayak.com for restaurants

## Overview

When a user searches ReviewCanoe for restaurants, it returns a list of restaurants based on Yelp's Search API. This provides basic info about the restaurant, like its average Yelp review rating and contact information.

When a user clicks on one of the results for more details, ReviewCanoe will first check Redis to see if there are any cached results, and return those results if so. If there are no cached results, this triggers additional API calls: to Yelp's Reviews API, Google's Places API, and Foursquare's API. ReviewCanoe then aggregates this information to display to the user. This way the user gets all this information in one place, including information unique to one of these APIs (like Yelp's review snippets and Foursquare's tips). Finally, ReviewCanoe averages the restaurant's review scores and price ratings from each of these sites to calculate the ReviewCanoe Value rating.

## Key Technologies Used

- React
- Node
- Express
- PostgreSQL
- Redis
- Google, Yelp, and Foursquare APIs

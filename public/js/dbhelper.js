
class DBHelper {


  
  static get DATABASE_URL() {
    
      if(navigator.onLine){
        console.log('online')
        return `https://cors-anywhere.herokuapp.com/https://restaurant-app-3c008.firebaseapp.com/data/restaurants.json`
      }
       return './data/restaurants.json'
    //   $.getJSON("./restaurants.json", function(json) {
    //     console.log(json)
    //     return json;
    //  });
   
    }

  
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { 
        const json = JSON.parse(xhr.responseText);
        console.log("json" , JSON.parse(xhr.responseText))
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { 
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  
  static fetchRestaurantById(id, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { 
          callback(null, restaurant);
        } else { 
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  
  static fetchRestaurantByCuisine(cuisine, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { 
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { 
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

 
  static fetchNeighborhoods(callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  static fetchCuisines(callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

 
  static imageUrlForRestaurant(restaurant) {
    return (`./img/${restaurant.photograph}`);
  }

  
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      })
      marker.addTo(newMap);
    return marker;
  }
 

}
var isHosted = (window.location.hostname === "https://restaurant-app-3c008.firebaseapp.com/") ? 'true' : '' ;
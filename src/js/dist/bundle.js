let restaurants,neighborhoods,cuisines;var map,markers=[];document.addEventListener("DOMContentLoaded",()=>{fillRestaurantsHTML(),fetchNeighborhoods(),fetchCuisines(),serviceWorkerRegister()}),serviceWorkerRegister=()=>{"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then((a)=>{console.log("ServiceWorker registration successful with scope: ",a.scope)},(a)=>{console.log("ServiceWorker registration failed: ",a)})})},fetchNeighborhoods=()=>{DBHelper.fetchNeighborhoods((a,b)=>{a?console.error(a):(self.neighborhoods=b,fillNeighborhoodsHTML())})},fillNeighborhoodsHTML=(a=self.neighborhoods)=>{const b=document.getElementById("neighborhoods-select");a.forEach((a)=>{const c=document.createElement("option");c.innerHTML=a,c.value=a,b.append(c)})},fetchCuisines=()=>{DBHelper.fetchCuisines((a,b)=>{a?console.error(a):(self.cuisines=b,fillCuisinesHTML())})},fillCuisinesHTML=(a=self.cuisines)=>{const b=document.getElementById("cuisines-select");a.forEach((a)=>{const c=document.createElement("option");c.innerHTML=a,c.value=a,b.append(c)})},window.waitMap=()=>{const a=document.getElementById("map");a.className="first-show";const b=document.createElement("p");b.innerHTML="Tap here to show restaurant map",a.appendChild(b),a.onclick=()=>{initMap()},updateRestaurants()},initMap=()=>{const a=document.getElementById("map");a.onclick=null,updateRestaurants();self.map=new google.maps.Map(document.getElementById("map"),{zoom:11,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1})},updateRestaurants=()=>{const a=document.getElementById("cuisines-select"),b=document.getElementById("neighborhoods-select"),c=a.selectedIndex,d=b.selectedIndex,e=a[c].value,f=b[d].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(e,f,(a,b)=>{a?console.error(a):(resetRestaurants(b),fillRestaurantsHTML())})},resetRestaurants=(a)=>{self.restaurants=[];const b=document.getElementById("restaurants-list");b.innerHTML="",self.markers.forEach((a)=>a.setMap(null)),self.markers=[],self.restaurants=a},fillRestaurantsHTML=(a=self.restaurants)=>{const b=document.getElementById("restaurants-list");a.forEach((a)=>{b.append(createRestaurantHTML(a))}),addMarkersToMap()},createRestaurantHTML=(a)=>{const b=document.createElement("li");b.className="resrev-quarter";const c=document.createElement("img");c.className="restaurant-img b-lazy",c.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",c.setAttribute("alt",`Restaurant ${a.name}`),c.setAttribute("data-src",DBHelper.imageUrlForRestaurant(a)),b.append(c);const d=document.createElement("h2");d.innerHTML=a.name,b.append(d);const e=document.createElement("p");e.innerHTML=a.neighborhood,b.append(e);const f=document.createElement("p");f.innerHTML=a.address,b.append(f);const g=document.createElement("a");return g.innerHTML="View Details",g.href=DBHelper.urlForRestaurant(a),b.append(g),setTimeout(()=>{Blazy()},0),b},addMarkersToMap=(a=self.restaurants)=>{a.forEach((a)=>{const b=DBHelper.mapMarkerForRestaurant(a,self.map);google.maps.event.addListener(b,"click",()=>{window.location.href=b.url}),self.markers.push(b)})};var db=new Dexie("restaurant_database");db.version(1).stores({restaurants:"id"});class DBHelper{static get DATABASE_URL(){return`http://localhost:${1337}/restaurants`}static fetchRestaurants(a){if(navigator.onLine){let b=new XMLHttpRequest;b.open("GET",DBHelper.DATABASE_URL),b.onload=()=>{if(200===b.status){const c=JSON.parse(b.responseText);c.forEach((a)=>{db.restaurants.put(a)}),a(null,c)}else{const c=`Request failed. Returned status of ${b.status}`;a(c,null)}},b.send()}else console.log("===================================="),console.log("Offline"),console.log("===================================="),db.restaurants.toArray().then((b)=>{a(null,b)})}static fetchRestaurantById(a,b){DBHelper.fetchRestaurants((c,d)=>{if(c)b(c,null);else{const c=d.find((b)=>b.id==a);c?b(null,c):b("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(a,b){DBHelper.fetchRestaurants((c,d)=>{if(c)b(c,null);else{const c=d.filter((b)=>b.cuisine_type==a);b(null,c)}})}static fetchRestaurantByNeighborhood(a,b){DBHelper.fetchRestaurants((c,d)=>{if(c)b(c,null);else{const c=d.filter((b)=>b.neighborhood==a);b(null,c)}})}static fetchRestaurantByCuisineAndNeighborhood(a,b,c){DBHelper.fetchRestaurants((d,e)=>{if(d)c(d,null);else{let d=e;"all"!=a&&(d=d.filter((b)=>b.cuisine_type==a)),"all"!=b&&(d=d.filter((a)=>a.neighborhood==b)),c(null,d)}})}static fetchNeighborhoods(a){DBHelper.fetchRestaurants((b,c)=>{if(b)a(b,null);else{const b=c.map((a,b)=>c[b].neighborhood),d=b.filter((a,c)=>b.indexOf(a)==c);a(null,d)}})}static fetchCuisines(a){DBHelper.fetchRestaurants((b,c)=>{if(b)a(b,null);else{const b=c.map((a,b)=>c[b].cuisine_type),d=b.filter((a,c)=>b.indexOf(a)==c);a(null,d)}})}static urlForRestaurant(a){return`./restaurant.html?id=${a.id}`}static imageUrlForRestaurant(a){let b=parseInt(a.id,null);return`/img/${b.toString()}.jpg`}static mapMarkerForRestaurant(a,b){const c=new google.maps.Marker({position:a.latlng,title:a.name,url:DBHelper.urlForRestaurant(a),map:b,animation:google.maps.Animation.DROP});return c}}
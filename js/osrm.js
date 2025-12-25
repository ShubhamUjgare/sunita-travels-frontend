// Get coordinates from place name (FREE)
async function getCoordinates(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0) {
    throw new Error("Location not found");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon
  };
}

// Get distance using OSRM (FREE)
async function getDistanceKm(pickup, destination) {
  const pick = await getCoordinates(pickup);
  const drop = await getCoordinates(destination);

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pick.lon},${pick.lat};${drop.lon},${drop.lat}?overview=false`;

  const res = await fetch(osrmUrl);
  const data = await res.json();

  const distanceKm = data.routes[0].distance / 1000;
  return distanceKm;
}

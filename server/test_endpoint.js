async function run() {
  const fetch = (await import('node-fetch')).default;
  try {
    const res = await fetch('http://localhost:5000/api/weather/KJFK');
    const json = await res.json();
    console.log(json);
  } catch (e) {
    console.error(e);
  }
}
run();

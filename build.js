import ical from 'node-ical';
import { promises as fsp } from 'fs';

export async function fetchEvents() {
  const webEvents = await ical.async.fromURL(
    'http://calendar.planningcenteronline.com/icals/eJxj4ajmsGLLz2TacNaKK7U4v6CkmtOKrcRTSdLQwNzAxEQHTJmCKVNjNis21xArtmJPJf7EnJz41LLUvJJiNmsOoFhpJrPCPhYr9jKgXj6QZElmbipEjrsgsSgxt7iazYq9ODGTDQC6dx7df0208dc798352795595b1ba5eddf82e33d9db146',
  );

  return Object.values(webEvents)
    .filter((x) => x.type === 'VEVENT')
    .sort((a, b) => a.start - b.start);
}

async function main() {
  let events = await fetchEvents();
  let grouped = {};
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const key = `${event.start.getMonth() + 1}${event.start.getFullYear()}`;
    if (grouped[key]) {
      grouped[key].push(event);
    } else {
      grouped[key] = [event];
    }
  }
  await fsp.rmdir('./build', { recursive: true });
  await fsp.mkdir('./build');
  for (const entry of Object.entries(grouped)) {
    await fsp.writeFile(`./build/${entry[0]}.json`, JSON.stringify(entry[1]));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

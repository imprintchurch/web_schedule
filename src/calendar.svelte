<script>
  import calendarize from 'calendarize';
  import { onMount } from 'svelte';
  import hostLocation from 'consts:hostLocation';

  let date = new Date();
  const cal = calendarize(date);

  let data;
  onMount(async () => {
    let res = await fetch(hostLocation + '/12021.json');
    let json = await res.json();
    data = json.reduce((agg, val) => {
      let key = new Date(val.start).toString().split(' ').slice(2)[0];
      console.log(key);
      if (agg[key]) {
        agg[key].push(val);
      } else {
        agg[key] = [val];
      }
      return agg;
    }, {});
  });
</script>

<div class="cal">
  <h2>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
  <table style="">
    <thead>
      <th>Sunday</th>
      <th>Monday</th>
      <th>Tuesday</th>
      <th>Wednesday</th>
      <th>Thursday</th>
      <th>Friday</th>
      <th>Saturday</th>
    </thead>
    {#if data}
      {#each cal as week}
        <tr>
          {#each week as day}
            <td>
              <div class="date-number">{day != 0 ? day : ''}</div>
              <ul>
                {#each data[day] || [] as event}
                  <li>
                    <span class="time"
                      >{new Date(event.start).toLocaleTimeString('default', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span
                    >
                    <span>
                      {event.summary}
                    </span>
                  </li>
                {/each}
              </ul>
            </td>
          {/each}
        </tr>
      {/each}
    {/if}
  </table>
</div>

<style>
  h2 {
    margin: 10px 0 0 0;
  }
  .cal {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }
  .time {
    display: block;
  }
  ul {
    list-style: none;
  }
  thead th {
    background-color: #a9a9a9;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.78rem;
    padding: 8px 6px;
  }
  table {
    border-collapse: collapse;
    background-color: #f7f7f7;
  }
  .cal th {
    width: 14.2857%;
  }

  .cal td {
    vertical-align: top;
    padding: 6px;
  }
  td + td {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
  td ul {
    padding: 0;
    min-height: 6em;
  }

  li + li {
    margin-top: 12px;
  }
  .date-number {
    font-weight: 700;
  }
</style>

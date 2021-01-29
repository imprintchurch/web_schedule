<script>
  import calendarize from 'calendarize';
  import { fade } from 'svelte/transition';
  import hostLocation from 'consts:hostLocation';

  let date = new Date();
  let selection = date
    .toLocaleDateString('default', { month: 'numeric', year: 'numeric' })
    .replace('/', '');
  let cal = calendarize(date);
  let data = {};

  $: {
    let d = /(?<month>\d+)(?<year>\d{4})/g.exec(selection);
    date = new Date(+d.groups.year, +d.groups.month - 1, 1);
    loadMonthData().then(() => {
      cal = calendarize(date);
    });
  }

  async function loadMonthData() {
    console.log(selection);
    let res = await fetch(hostLocation + `/${selection}.json`);
    if (res.ok) {
      let json = await res.json();
      data = json.reduce((agg, val) => {
        let key = +new Date(val.start).toString().split(' ').slice(2)[0];
        if (agg[key]) {
          agg[key].push(val);
        } else {
          agg[key] = [val];
        }
        return agg;
      }, {});
      console.log(data);
    }
  }
</script>

<div class="cal">
  <div class="cal-head">
    <h3>
      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
    </h3>
    <select bind:value={selection} name="month" id="month-select">
      <option value="12021">January 2021</option>
      <option value="22021">February 2021</option>
      <option value="32021">March 2021</option>
      <option value="42021">April 2021</option>
      <option value="52021">May 2021</option>
      <option value="62021">June 2021</option>
      <option value="72021">July 2021</option>
    </select>
  </div>
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
                {#each data[day] || [] as event (event.uid)}
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
  h3 {
    margin: 0 0 0 0;
    flex: 1;
  }
  .cal-head {
    display: flex;
    align-items: center;
  }
  .cal {
    --border-color: #d1d5db;
    font-family: 'Montserrat', Arial, 'Helvetica Neue', Helvetica, sans-serif;
    max-width: 1200px;
    width: 100%;
    margin: 12px auto;
  }
  .time {
    display: block;
    font-weight: 600;
  }
  ul {
    list-style: none;
  }
  thead th {
    background-color: var(--cal-header-background, #a9a9a9);
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.78rem;
    padding: 8px 6px;
    text-align: center;
    border: 1px solid var(--border-color);
  }

  table {
    border-collapse: collapse;
    background-color: var(--cal-table-background, #f7f7f7);
    width: 100%;
  }
  .cal th {
    width: 14.2857%;
  }

  .cal td {
    vertical-align: top;
    padding: 6px;
  }
  td {
    border-left: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
  td ul {
    padding: 0;
    min-height: 6em;
  }

  li + li {
    margin-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding-top: 12px;
  }
  li {
    line-height: 1.5;
  }
  .date-number {
    font-weight: 700;
    font-size: 0.8rem;
    color: #374151;
  }
</style>

# Home Assistant Basic Dashboard

Basic Dashboard for Home Assistant meant to be shown on an Kindle device.

![](overview.png)

It should work with any [ES3](https://en.wikipedia.org/wiki/ECMAScript_version_history) compatible device (at least viewing) and was tested with [Kindle 4](https://en.wikipedia.org/wiki/Amazon_Kindle#Kindle_4). But it's much more useable with an illuminate touch device like [Kindle Paperwhite](<https://en.wikipedia.org/wiki/Amazon_Kindle#Kindle_Paperwhite_(first_iteration)>).

Loosely inspired by [KFloorP](https://github.com/viny182/kfloorp/) and [Hatki](https://github.com/tombo1337/hatki).

## Installation

Just deploy the content of the `dist` directory to any HTTP server and create a configuration.

The simplest way is to use Home Assistant's build in server at `.../config/www/BasicDashboard/`.
This one is reachable (if enabled) at <http:/127.0.0.1:8123/local/BasicDashboard/index.html>.

I'm using a git clone and a symlink to have a simple way for updates:

```sh
# install
git clone https://github.com/escoand/ha-basic-dashboard.git /path/to/local/clone
ln -s /path/to/local/clone/dist /path/to/config/www/BasicDashboard
# update
cd /path/to/local/clone
git pull
```

## Configuration

The configuration has to be in the file `config.json` located in the same directory as `index.html`.
The comments below are just for documentation and have to be removed - JSON actually doesn't allow comments.

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/escoand/ha-basic-dashboard/refs/heads/main/config.schema.json",
    // URL to Home Assistant (optional, default URL of HTTP server)
    "base": "http://127.0.0.1:8123",
    // Long living access token from user settings
    "token": "...",
    // Time in milliseconds for refreshing the entitites (optional, default 1 min)
    "refresh": 10000,
    // List of floors or tabs
    "floors": {
        // Name of the floor or tab
        "Floor 1": [
            // Array of elements to show
            {
                // entity_id of the respective entity
                "entity_id": "sensor.my_sensor",
                // Attribute to show (optional, default state of entity, array also possible)
                "attribute": "last_updated",
                // Unit of measurement (optional)
                "unit_of_measurement": "°C",
                // Name to show (optional, default name in HA)
                "name": "Custom name",
                // Service to call on click (optional)
                "service": "homeassistant.toggle",
                // Data to pass to service call (optional, any type of data)
                "service_data": { ... },
            },
            // history chart
            {
                // entities to show
                "entities": [
                    // entity_id as string, to show the state
                    "sensor.my_sensor",
                    // or show an attribute
                    {
                        "entity_id": "sensor.my_sensor",
                        "attribute": "current_temperature"
                    }
                ],
                // Name to show (optional)
                "name": "Temperatur (°C)",
                // chart configuration
                "chart": {
                    // height of the chart in px (optional)
                    "height": 200,
                    // width of the chart in px (optional)
                    "width": 426,
                    // number of y-axis ticks (optional, default 3)
                    "ticks": 3,
                    // format of the x-axis (optional)
                    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#date-time_component_options
                    "datetime_format": { ... }
                }
            },
            // chart of an action's result
            {
                // action to call (formerly known as service)
                "action": "tibber.get_prices",
                // data to pass to the action (optional)
                "action_data": { ... },
                // Name to show (optional)
                "name": "Preis (ct/kWh)",
                // chart configuration
                "chart": {
                    "data": [
                        // same as history chart and additionally
                        {
                            // path in the action response to the data
                            // the path should point to an array of data
                            "data": ["service_response", "prices", ...],
                            // multiply the value with (optional)
                            "factor": 1,
                            // show the graph as stepline, like HA by default (optional, default false)
                            "stepline": false,
                            // path to the data of the x-axis, string or array
                            "x": "start_time",
                            // path to the data of the y-axis, string or array
                            "y": "price"
                        }
                    ],
                    // show an indicator for the current time (optional, default false)
                    "now": false
                }
            }
        ],
        // Use string as regex to filter all entities
        "Switches": "^(switch|light)\\..*$",
        // Use null to show all entities
        "All": null
    }
}
```

## Troubleshooting

### Screensaver on Kindle Paperwhite

To disable the screensaver you can enter `~ds` in the search box on the home screen. To enable it again you have to restart the device.

### Separate HTTP server

If you want to use a separate HTTP server you've to setup the [CORS headers](https://www.home-assistant.io/integrations/http/#cors_allowed_origins).

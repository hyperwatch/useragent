# API

Include the `@hyperwatch/useragent` parser in you node.js application:

```js
const useragent = require('@hyperwatch/useragent');
```

### useragent.parse(useragent string);

This is the actual user agent parser, this is where all the magic is happening.
The function accepts 1 argument, the user agent string that is known on the server
from the `req.headers.useragent` header.

The parser returns a Agent instance, this allows you to output user agent
information in different predefined formats. See the Agent section for more
information.

```js
const agent = useragent.parse(req.headers['user-agent']);
```

The parse method returns a `Agent` instance which contains all details about the
user agent. See the Agent section of the API documentation for the available
methods.

### useragent.fromJSON(obj);

Transforms the JSON representation of a `Agent` instance back in to a working
`Agent` instance

```js
const agent = useragent.parse(req.headers['user-agent']),
  another = useragent.fromJSON(JSON.stringify(agent));

console.log(agent == another);
```

---

## Agent, Os and Device instances

Most of the methods mentioned above return a Agent instance. The Agent exposes
the parsed out information from the user agent strings. This allows us to
extend the agent with more methods that do not necessarily need to be in the
core agent instance, allowing us to expose a plugin interface for third party
developers and at the same time create a uniform interface for all versioning.

The Agent has the following property

- `family` The browser family, or browser name, it defaults to `null`.
- `major` The major version number of the family, it defaults to `null`.
- `minor` The minor version number of the family, it defaults to `null`.
- `patch` The patch version number of the family, it defaults to `null`.
- `patch_minor` The patch version number of the family, it defaults to `null`.

In addition to the properties mentioned above, it also has 2 special properties,
which are:

- `os` Os instance
- `device` Device instance

When you access those 2 properties the agent will do on demand parsing of the
Operating System or/and Device information.

The Os has the same properties as the Agent, for the Device we
don't have any versioning information available, so only the `family` property is
set there. If we cannot find the family, they will default to `null`.

The following methods are available:

### Agent.toAgent();

Returns the family and version number concatenated in a nice human readable
string.

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.toAgent(); // 'Firefox 82.0'
```

### Agent.toString();

Returns the results of the `Agent.toAgent()` but also adds the parsed operating
system to the string in a human readable format.

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.toString(); // 'Firefox 82.0 / Mac OS X 10.15'

// as it's a to string method you can also concat it with another string
'your useragent is ' + agent;
// 'your useragent is Firefox 82.0 / Mac OS X 10.15'
```

### Agent.toVersion();

Returns the version of the browser in a human readable string.

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.toVersion(); // '82.0'
```

### Agent.toJSON();

Generates a JSON representation of the Agent. By using the `toJSON` method we
automatically allow it to be stringified when supplying as to the
`JSON.stringify` method.

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.toJSON(); // returns an object

JSON.stringify(agent);
```

### Os.toString();

Generates a stringified version of operating system;

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.os.toString(); // 'Mac OS X 10.15'
```

### Os.toVersion();

Generates a stringified version of operating system's version;

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.os.toVersion(); // '10.15'
```

### Os.toJSON();

Generates a JSON representation of the Os (Operating System). By using the `toJSON`
method we automatically allow it to be stringified when supplying as to the
`JSON.stringify` method.

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.os.toJSON(); // returns an object

JSON.stringify(agent.os);
```

### Device.toString();

Generates a stringified version of device;

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.device.toString(); // 'Asus A100'
```

### Device.toVersion();

Generates a stringified version of device's version;

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.device.toVersion(); // '' , no version found but could also be '0.0.0'
```

### Device.toJSON();

Generates a JSON representation of the Device. By using the `toJSON` method we
automatically allow it to be stringified when supplying as to the
`JSON.stringify` method.

```js
const agent = useragent.parse(req.headers['user-agent']);
agent.device.toJSON(); // returns an object

JSON.stringify(agent.device);
```

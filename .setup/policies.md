## config/policies.js

Policies allow middleware to be ran on routes (controller methods). A file must exist `config/policies.js` that has this shape:

```js
module.exports = {
  '*': true, // applies to any controllers and methods that are not defined
  organization: {
    '*': 'jwt', // applies to any methods that are not defined
    test: true, // allows this route to be accessed 
  },
  region: false, // blocks this controller and all it's methods
  user: {
    create: ['isAdmin'], // applies each policy to this method
    destroy: false, // block this method on the user controller 
  },
};
```

### Rules & Use

The `config/policies.js` file must export an object and the keys are the `controller` names. A controller value can be one of: 

- `string` The name of the policy file in `api/policies` directory
- `boolean` Where `true` allows the controller to be accessed and `false` blocks the controller
- `object` Each key is the name of a method which specifies the policies. A wildcard can be used to apply a rull to any methods that are NOT listed in the controller, ie: `"*": array | boolean | string`
- `array<string>` Where each value in the array is the name of a policy

The top level of the exported object can contain a wildcard key => value to apply a rule to any controller or methods that are NOT explicitly defined, ie: `"*": array | boolean | string`

> The strings in this example, `jwt` and `isAdmin` are file names in the directory: `api/policies/`, ie: `api/policies/jwt.js` and `api/policies/isAdmin.js`.

#### Example Policy

```js
// api/policies/isAdmin.js

module.exports = (ctx, next) => {
  if (!ctx.state.user || !ctx.state.user.isAdmin) throw new Error('Forbidden');

  return next();
};
```

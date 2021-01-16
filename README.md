ember-mirage-gen
==============================================================================

The addon will give the complete Mirage section after receiving the API call.

Demo
------------------------------------------------------------------------------
Demo is available <a href="https://alwarg.github.io/mirage-gen-demo/" target="_blank" rel="noopener noreferrer">here</a>
<br>
![mirage-gen-common](https://i.imgur.com/Lfsx51V.png)

Installation
------------------------------------------------------------------------------

```
ember install ember-mirage-gen
```
Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above

Documentation
------------------------------------------------------------------------------

Consider we have the following sample response for the particular request
```javascript
  request = 'https://sample/studentdata';
  response = {
            student: {
                'personal-data': {
                  name: 'myname',
                  age: 12
                },
                'educational-data': {
                   marks: 98,
                   section: 'B'
                }
             } 
            }
```
The output for this response as
![mirage-gen-option](https://i.imgur.com/X2pIfgr.png)

As shown in the above image, we have the section of the object tree. Here, we can select the type of the node. The types are
  1. Fixture
  2. Factory
  3. Normal

  After selecting the option, we should click the `Generate Info` button.

  Note: if the node is normal, then it will be included in the config file section

![mirage-gen-api](https://i.imgur.com/5PBVm0m.png)
### Info strucure
  Here, we have three sections
  1. config file
  2. DataBase
  3. Test file
#### 1) config file:
 This file has the API endpoints.
 ```javascript
    this.get('your request', function(schema, request) {
       return your response;
    })
 ```
 #### 2) DataBase
  This section contains a list of fixtures and factories which are chosen in the previous section.
  Here, we can also compare our result with the available `factory/fixture` and generate the new results.. For more info try it in the <a href="https://alwarg.github.io/mirage-gen-demo/" target="_blank" rel="noopener noreferrer">demo</a> page.
 
#### 3) Test file
  It has the creation list of factories as well as fixtures like in the Ember test file.

Usage
------------------------------------------------------------------------------

1. Add the following code in the application.hbs
```
  <MirageGen @top="value" @left="value" />
```
2. In your config/environment.js, add an ember-mirage-gen object as below.
```javascript
// config/environment.js
let ENV = {
  'ember-mirage-gen': {
    isEnabled: environment === 'development', // Mandatory
    isOnlyForCurrentDomain: true, // optional
    excludedNodes: [] // optional
  }
};
```
* isEnabled - it works only when this node is true

* isOnlyForCurrentDomain - Allow only the same domain API's.

* excludedNodes - sometimes we got the same node for all responses and we don't need the mirage information for those nodes. So, we can exclude those nodes by adding those nodes in this array. example: **page-info** conatins page information

3. Visit the app and click the `mirage-gen` icon, you will see the list of API's

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

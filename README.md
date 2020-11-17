ember-mirage-gen
==============================================================================

The addon will give the complete Mirage section after receiving the API call.
![mirage-gen-common](https://i.imgur.com/Lfsx51V.png)

Installation
------------------------------------------------------------------------------

```
ember install ember-mirage-gen
```
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
![mirage-gen-api](https://i.imgur.com/LN0EI1f.png)
### strucure
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
  As shown in the above image, we have the section of the object tree. Here, we can select the type of the node. The types are
  1. Fixture
  2. Factory
  3. Normal
  <br>
  After selecting the option, we should click the `Generate DB` button.
  Note: if the node is normal, then it will be included in the config file section
 
#### 3) Test file
  It has the list of factories as well as fixtures like in the test file.

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

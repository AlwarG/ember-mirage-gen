import { setProperties } from '@ember/object';
import fakerConfig from '../utils/faker-config';

let addNodes = (obj) => {
  setProperties(obj, {
    isArray: Array.isArray(obj),
    isFactory: false,
    isFixture: false,
    isRemoved: true
  });
}

let addCond = (obj) => {
  addNodes(obj);
  let output = obj;
  if (obj.isArray) {
    output = obj[0] || {};
  }
  let objKeys = (Object.keys(output)|| []).filter((prop) => typeof output[prop] === 'object');;
  objKeys.forEach((key) => {
    let value = output[key];
    addCond(value);
  });
  return obj;
}

let getAddedNodes = ['isArray', 'isFactory', 'isFixture', 'isRemoved'];

let setChildNodes = (obj, isMainObj = false) => {
  let { isFactory, isFixture, isRemoved } = obj;

  let setDefultProps = (obj) => {
    setProperties(obj, {
      isFactory,
      isFixture,
      isRemoved: false
    });
  };

  let setProps = (obj) => {
    setProperties(obj, {
      isFactory: false,
      isFixture: false,
      isRemoved: true
    });
  };

  if (Array.isArray(obj)) {
    if (isRemoved) {
      obj.forEach((ele) => {
        if (typeof ele === 'object') {
          setProps(ele);
        }
      });
    }
    obj.forEach((node) => {
      if (isFactory || isFixture) {
        setDefultProps(node);
      }
      setChildNodes(node);
    });
  } else {
    let objKeys = (Object.keys(obj)|| []).filter((prop) => typeof obj[prop] === 'object');
    if (isMainObj && isRemoved) {
      objKeys.forEach((key) => {
        setProps(obj[key]);
      });
    }
    objKeys.forEach((key) => {
      let value = obj[key];
  
      if (isFactory || isFixture) {
        setDefultProps(value);
      }
      setChildNodes(value);
    });
  }
  return obj;
}


let removeBrackets = (str, startBracket, endBracket) => {
  let hasStartBracket = false;
  for (let i = 0; i < str.length; i++) {
    if (startBracket === str[i]) {
      hasStartBracket = true;
      // count for start brackets
      let j, startBracketCount = 1;
      for (j = i + 1; j < str.length; j++) {
        if (startBracket === str[j]) {
          startBracketCount++;
        }
        if (str[j] === endBracket) {
          startBracketCount--;
          if (!startBracketCount) {
            // Check for closing of all open brackets
            break;
          }
        }
      }
      if (hasStartBracket) {
        str = str.replace(str.substring(i, j + 1), '');
      }
    }
  }
  return str;
}


let getKeys = (objString) => {
  let myString = (objString || '').slice(1);
  myString = myString.slice(0, -1);
  let bracketsObj = {
    '{': '}',
    '[': ']',
    '(': ')'
  };
  for (let startBracket in bracketsObj) {
    myString = removeBrackets(myString, startBracket, bracketsObj[startBracket]);
  }

  return (myString.split(',') || []).map((key) => {
    let [node] = key.split(':');
    if (node.startsWith('\'') || node.startsWith('"')) {
      node = node.slice(1);
      node = node.slice(0, -1);
    }
    return node;
  });
}

let getDBString = (string) => {
  string = (string || '').replace(/ /g, '');
  string = string.replace(/(\r\n|\n|\r)/g, '');
  string = string.split('//$MirageSection-Start$')[1];
  return (string || '').split('//$MirageSection-End$')[0];
}

let getFakerString = (key) => {
  let myStr = key || '';
  ['_', '-'].forEach((mySymbol) => {
    myStr = myStr.replace(mySymbol, '');
  })
  myStr = myStr.toLowerCase();
  let keys = Object.keys(fakerConfig);

  let fakerKey = keys.find((str) => {
    let res = str.toLowerCase();
    return myStr.endsWith(res);
  });

  if (!fakerKey) {
    let resKey = '';
    let resValue = '';
    let canBreak = false;
    for (let i = 0; i < keys.length; i++) {
      let fakerValues = fakerConfig[keys[i]];
      for (let j = 0; j < fakerValues.length; j++) {
        if (myStr.endsWith(fakerValues[j].toLowerCase())) {
          resValue = fakerValues[j];
          canBreak = true;
          break;
        }
      }
      if (canBreak) {
        resKey = keys[i];
        break;
      }
    }
    if (resKey) {
      return `faker.${resKey}.${resValue}()`
    }
    return '';
  }
  return `faker.${fakerKey}.${fakerConfig[fakerKey][0]}()`;
}

export default { addCond, getAddedNodes, setChildNodes, getKeys, getDBString, getFakerString }

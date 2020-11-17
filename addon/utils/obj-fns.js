let addNodes = (obj) => {
  Object.assign(obj, {
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
  let { isFactory, isFixture, isArray, isRemoved } = obj;

  let setDefultProps = (obj) => {
    Object.assign(obj, {
      isFactory,
      isFixture,
      isRemoved: false
    });
  };

  let setProps = (obj) => {
    Object.assign(obj, {
      isFactory: false,
      isFixture: false,
      isRemoved: true
    });
  };

  if (isArray) {
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

export default { addCond, getAddedNodes, setChildNodes }

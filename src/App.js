import logo from './logo.svg';
import './App.css';

const getObj = jsonStr => typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr
const getValFromStack = (stack , key) => {
  if (stack.length > 1) {
    return stack.reduce((item1, item2) => item1[key] + '.' + item2[key])
  }
  return stack[0][key]
}


const diffJson = parameter => {
  console.log('parameter', parameter)
  const { newJson, oldJson, dataTree, stack = [], outPutList=[] } = parameter
  const newObj = getObj(newJson)
  const oldObj = getObj(oldJson)
  console.log('-newObj', newObj)
  const keysList = Object.keys(dataTree)
  for(let i = 0; i < keysList.length; i++) {
    const key = keysList[i]
    stack.push({
      key,
      des: dataTree[key].des
    })
    if (dataTree[key].properties) {
      diffJson({
        newJson: newObj[key],
        oldJson: oldObj[key],
        dataTree: dataTree[key].properties,
        stack,
        outPutList
      })
    } else {
      console.log('====>', newObj, key)
      if (newObj[key] !== oldObj[key]) {
        const { emuns } = dataTree[key]
        outPutList.push({
          key: getValFromStack(stack, 'key'),
          des: getValFromStack(stack, 'des'),
          newValue: emuns? emuns[newObj[key]]: newObj[key],
          oldValue: emuns? emuns[oldObj[key]]: oldObj[key],
        })
      }
      stack.pop()
    }
  }
  return outPutList
}

const dataTree = {
  backName: {
    des: '银行账号'
  },
  person: {
    des: '人',
    properties: {
      name: {
        des: '姓名',
      },
      sex: {
        emuns: {
          '1': '男',
          '2': '女'
        },
        des: '性别',
      }
    }
  },
  backNo: {
    des: '银行号码',
  }
}

function App() {
  const newJson = {
    backName: 'aaa',
    person: {
      name: 'vivi',
      sex: '2'
    },
    backNo: '123'
  }
  const oldJson = {
    backName: 'abb',
    person: {
      name: 'vivi2',
      sex: '1'
    },
    backNo: '123'
  }
  const diff = diffJson({
    newJson,
    oldJson,
    dataTree
  })
  console.log('diff', diff)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

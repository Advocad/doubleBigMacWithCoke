import React from 'react';

function App() {
  const [data, setData] = React.useState(null);

  console.log('sdfsdf');
  React.useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setData(data.message));
  }, [setData]);

  return <>{data}</>;
}

export default App;

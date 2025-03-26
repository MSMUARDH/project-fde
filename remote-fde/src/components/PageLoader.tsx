import { Spin } from 'antd';
import React from 'react'

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const PageLoader:React.FC  = () => {
  return (
    <div  style={{width:"100vw",height:"100vh", display:"flex",justifyContent:"center",alignItems:"center"}}>
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </div>
  );
}

export default PageLoader
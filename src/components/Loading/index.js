import React from "react";
import { Spin, Space } from 'antd';

const Loading = () => {
    return (
        <div style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Space size="middle">
                <Spin size="small" />
                <Spin />
                <Spin size="large" />
            </Space>
        </div>
    )
}

export default Loading;
